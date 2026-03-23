import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { UPLOAD_PATHS, validateFileMagicBytes, resolveUploadPath, getFileServeUrl, generateSafeFileName, MAX_FILE_SIZE, sanitizeImageBuffer, uploadToSupabase } from '@/lib/upload';

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
        { success: false, error: 'unauthorized', message: 'You must be logged in to upload an avatar.' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'file.missing', message: 'No file provided.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'file.invalidType', message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'file.tooLarge', message: `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
        { status: 400 }
      );
    }

    // Generate safe filename using UUID
    const fileName = generateSafeFileName(file.name);
    const uploadsDir = UPLOAD_PATHS.avatars;
    const filePath = path.join(uploadsDir, fileName);
    
    let fileBuffer = Buffer.from(await file.arrayBuffer() as any);

    // Validate magic bytes match claimed MIME type
    if (!validateFileMagicBytes(fileBuffer, file.type)) {
      return NextResponse.json(
        { success: false, error: 'file.contentMismatch', message: 'The file type check failed. Please try a different image or format.' },
        { status: 400 }
      );
    }

    // Sanitize image (metadata stripping)
    fileBuffer = sanitizeImageBuffer(fileBuffer);

    // Detect Environment
    const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
    let url: string;

    if (isVercel) {
        console.log('Uploading avatar to Supabase Storage...');
        const cloudUrl = await uploadToSupabase('avatars', fileName, fileBuffer, file.type);
        if (!cloudUrl) throw new Error('Supabase upload failed');
        url = cloudUrl;
    } else {
        try {
            if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });
            await writeFile(filePath, fileBuffer);
            url = getFileServeUrl('avatars', fileName);
        } catch (err) {
            console.warn('Local save failed, fallback to cloud:', err);
            const cloudUrl = await uploadToSupabase('avatars', fileName, fileBuffer, file.type);
            if (!cloudUrl) throw err;
            url = cloudUrl;
        }
    }

    // Update user avatar in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: url },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Avatar uploaded successfully.',
        data: { avatarUrl: url },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { success: false, error: 'server.error', message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/avatar
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { success: false, error: 'unauthorized', message: 'You must be logged in to delete your avatar.' },
        { status: 401 }
      );
    }

    // Update user to remove avatar
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: null },
    });

    return NextResponse.json({ success: true, message: 'Avatar deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Avatar delete error:', error);
    return NextResponse.json({ success: false, error: 'server.error', message: 'Internal server error.' }, { status: 500 });
  }
}
