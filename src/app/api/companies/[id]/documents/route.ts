import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { companyDocumentSchema } from '@/lib/validations/company';
import { UPLOAD_PATHS, validateFileMagicBytes, resolveUploadPath, getFileServeUrl } from '@/lib/upload';

interface RouteParams {
  params: { id: string };
}

// Allowed document types
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * GET /api/companies/[id]/documents
 * Get company documents
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    const { id } = params;

    // Find company
    const company = await prisma.company.findFirst({
      where: {
        OR: [{ slug: id }, { id }],
      },
      include: {
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: 'company.notFound',
          message: 'Company not found.',
        },
        { status: 404 }
      );
    }

    // Check if user can view documents
    const canViewDocuments =
      session.isAuthenticated &&
      (company.userId === session.user?.id ||
        session.user?.role === 'ADMIN' ||
        session.user?.role === 'SUPER_ADMIN');

    if (!canViewDocuments) {
      return NextResponse.json(
        {
          success: false,
          error: 'forbidden',
          message: 'You do not have permission to view these documents.',
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { documents: company.documents },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get documents error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'server.error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/companies/[id]/documents
 * Upload company document
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to upload documents.',
        },
        { status: 401 }
      );
    }

    const { id } = params;

    // Find company
    const company = await prisma.company.findFirst({
      where: {
        OR: [{ slug: id }, { id }],
      },
    });

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: 'company.notFound',
          message: 'Company not found.',
        },
        { status: 404 }
      );
    }

    // Check ownership
    if (company.userId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'forbidden',
          message: 'You do not have permission to upload documents for this company.',
        },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file || !type) {
      return NextResponse.json(
        {
          success: false,
          error: 'file.missing',
          message: 'File and document type are required.',
        },
        { status: 400 }
      );
    }

    // Validate document type
    const typeValidation = companyDocumentSchema.safeParse({ type });
    if (!typeValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'type.invalid',
          message: 'Invalid document type.',
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'file.invalidType',
          message: 'Invalid file type. Only PDF, JPEG, PNG, and WebP are allowed.',
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'file.tooLarge',
          message: 'File is too large. Maximum size is 10MB.',
        },
        { status: 400 }
      );
    }

    // Generate safe filename
    const fileExtension = file.type === 'application/pdf' ? 'pdf' : file.type.split('/')[1];
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileName = `${company.id}_${type}_${randomName}.${fileExtension}`;

    // Ensure uploads directory exists (OUTSIDE public/ for auth-protected access)
    const uploadsDir = UPLOAD_PATHS.documents;
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadsDir, fileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Validate magic bytes match claimed MIME type
    if (!validateFileMagicBytes(fileBuffer, file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'file.contentMismatch',
          message: 'File content does not match the declared file type.',
        },
        { status: 400 }
      );
    }

    await writeFile(filePath, fileBuffer);

    // Generate auth-protected URL (served via /api/files/...)
    const fileUrl = getFileServeUrl('documents', fileName);

    // Create document record
    const document = await prisma.companyDocument.create({
      data: {
        companyId: company.id,
        type,
        fileUrl,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        status: 'PENDING',
      },
    });

    // Update company verification status to UNDER_REVIEW if it was PENDING
    if (company.verificationStatus === 'PENDING') {
      await prisma.company.update({
        where: { id: company.id },
        data: { verificationStatus: 'UNDER_REVIEW' },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Document uploaded successfully. It will be reviewed by our team.',
        data: { document },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Document upload error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'server.error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/companies/[id]/documents
 * Delete a company document
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to delete documents.',
        },
        { status: 401 }
      );
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'documentId.missing',
          message: 'Document ID is required.',
        },
        { status: 400 }
      );
    }

    // Find company
    const company = await prisma.company.findFirst({
      where: {
        OR: [{ slug: id }, { id }],
      },
    });

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: 'company.notFound',
          message: 'Company not found.',
        },
        { status: 404 }
      );
    }

    // Check ownership
    if (company.userId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'forbidden',
          message: 'You do not have permission to delete documents for this company.',
        },
        { status: 403 }
      );
    }

    // Find document
    const document = await prisma.companyDocument.findFirst({
      where: {
        id: documentId,
        companyId: company.id,
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          error: 'document.notFound',
          message: 'Document not found.',
        },
        { status: 404 }
      );
    }

    // Delete file from disk (safe path resolution)
    try {
      // Extract the filename from the stored URL
      const storedFileName = path.basename(document.fileUrl);
      const filePath = resolveUploadPath('documents', storedFileName);
      if (filePath && existsSync(filePath)) {
        const { unlink } = await import('fs/promises');
        await unlink(filePath);
      }
    } catch (error) {
      console.error('Failed to delete document file:', error);
      // Continue even if file deletion fails
    }

    // Delete document record
    await prisma.companyDocument.delete({
      where: { id: documentId },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Document deleted successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Document delete error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'server.error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
