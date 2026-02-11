import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
          message: 'File is too large. Maximum size is 5MB.',
        },
        { status: 400 }
      );
    }

    // Generate safe filename
    const fileExtension = file.type.split('/')[1];
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileName = `${session.user.id}_${randomName}.${fileExtension}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadsDir, fileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);

    // Generate public URL
    const avatarUrl = `/uploads/avatars/${fileName}`;

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
      // Delete file from disk (optional - can be done via cleanup job)
      try {
        const filePath = path.join(process.cwd(), 'public', user.avatar);
        if (existsSync(filePath)) {
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
