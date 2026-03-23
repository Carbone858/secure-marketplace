import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { companyDocumentSchema } from '@/lib/validations/company';
import { UPLOAD_PATHS, validateFileMagicBytes, resolveUploadPath, getFileServeUrl, generateSafeFileName, MAX_FILE_SIZE, uploadToSupabase } from '@/lib/upload';

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

/**
 * GET /api/companies/[id]/documents
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    const { id } = params;

    const company = await prisma.company.findFirst({
      where: { OR: [{ slug: id }, { id }] },
      include: { documents: { orderBy: { uploadedAt: 'desc' } } },
    });

    if (!company) {
      return NextResponse.json({ success: false, error: 'company.notFound', message: 'Company not found.' }, { status: 404 });
    }

    const canView = session.isAuthenticated && (company.userId === session.user?.id || session.user?.role === 'ADMIN');
    if (!canView) {
      return NextResponse.json({ success: false, error: 'forbidden', message: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: { documents: company.documents } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'server.error', message: 'Failed to load docs.' }, { status: 500 });
  }
}

/**
 * POST /api/companies/[id]/documents
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ success: false, error: 'unauthorized', message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const company = await prisma.company.findFirst({ where: { OR: [{ slug: id }, { id }] } });

    if (!company) {
      return NextResponse.json({ success: false, error: 'company.notFound', message: 'Company not found.' }, { status: 404 });
    }

    if (company.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'forbidden', message: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file || !type) {
      return NextResponse.json({ success: false, error: 'file.missing', message: 'File/Type missing.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'file.invalidType', message: 'Invalid file type.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'file.tooLarge', message: 'File too large.' }, { status: 400 });
    }

    const fileName = generateSafeFileName(file.name);
    const uploadsDir = UPLOAD_PATHS.documents;
    const filePath = path.join(uploadsDir, fileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (!validateFileMagicBytes(fileBuffer, file.type)) {
      return NextResponse.json({ success: false, error: 'file.contentMismatch', message: 'Security check failed.' }, { status: 400 });
    }

    // Detect Environment
    const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
    let url: string;

    if (isVercel) {
        console.log('Uploading document to Supabase Storage...');
        const cloudUrl = await uploadToSupabase('documents', fileName, fileBuffer, file.type);
        if (!cloudUrl) throw new Error('Supabase Storage failed');
        url = cloudUrl;
    } else {
        try {
            if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });
            await writeFile(filePath, fileBuffer);
            url = getFileServeUrl('documents', fileName);
        } catch (e) {
            console.warn('Local save failed, fallback to cloud:', e);
            const cloudUrl = await uploadToSupabase('documents', fileName, fileBuffer, file.type);
            if (!cloudUrl) throw e;
            url = cloudUrl;
        }
    }

    // Create record
    const document = await prisma.companyDocument.create({
      data: {
        companyId: company.id,
        type,
        fileUrl: url,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        status: 'PENDING',
      },
    });

    if (company.verificationStatus === 'PENDING') {
      await prisma.company.update({ where: { id: company.id }, data: { verificationStatus: 'UNDER_REVIEW' } });
    }

    return NextResponse.json({ success: true, message: 'Uploaded.', data: { document } }, { status: 201 });
  } catch (error) {
    console.error('Doc upload error:', error);
    return NextResponse.json({ success: false, error: 'server.error', message: 'Failed to upload.' }, { status: 500 });
  }
}

/**
 * DELETE /api/companies/[id]/documents
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        if (!session.isAuthenticated || !session.user) return NextResponse.json({ success: false, message: 'Unauth' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get('documentId');
        if (!documentId) return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });

        await prisma.companyDocument.deleteMany({
            where: {
                id: documentId,
                company: { userId: session.user.id }
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
    }
}
