import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { UPLOAD_PATHS, validateFileMagicBytes, resolveUploadPath, getFileServeUrl, generateSafeFileName, MAX_FILE_SIZE, sanitizeImageBuffer } from '@/lib/upload';

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * POST /api/user/avatar
 * Upload user avatar
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to upload an avatar.',
        },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'file.missing',
          message: 'No file provided.',
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
          message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
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
          message: `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        },
        { status: 400 }
      );
    }

    // Generate safe filename using UUID
    const fileName = generateSafeFileName(file.name);

    // Ensure uploads directory exists (OUTSIDE public/ for controlled access)
    const uploadsDir = UPLOAD_PATHS.avatars;
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadsDir, fileName);
    let fileBuffer = Buffer.from(await file.arrayBuffer() as any);

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

    // Sanitize image (metadata stripping)
    fileBuffer = sanitizeImageBuffer(fileBuffer);

    await writeFile(filePath, fileBuffer);

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

    // Generate URL served via /api/files/... (avatars are semi-public)
    const avatarUrl = getFileServeUrl('avatars', fileName);

    // Update user avatar in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: avatarUrl },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Avatar uploaded successfully.',
        data: {
          avatarUrl,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Avatar upload error:', error);

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
 * DELETE /api/user/avatar
 * Delete user avatar
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to delete your avatar.',
        },
        { status: 401 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { avatar: true },
    });

    if (user?.avatar) {
      // Delete file from disk (safe path resolution)
      try {
        const avatarFileName = path.basename(user.avatar);
        const filePath = resolveUploadPath('avatars', avatarFileName);
        if (filePath && existsSync(filePath)) {
          const { unlink } = await import('fs/promises');
          await unlink(filePath);
        }
      } catch (error) {
        console.error('Failed to delete avatar file:', error);
        // Continue even if file deletion fails
      }
    }

    // Update user to remove avatar
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: null },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Avatar deleted successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Avatar delete error:', error);

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
