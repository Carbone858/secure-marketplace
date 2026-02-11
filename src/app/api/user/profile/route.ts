import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/validations/auth';

// Profile update validation schema
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').optional(),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
});

/**
 * GET /api/user/profile
 * Get current user profile
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to view your profile.',
        },
        { status: 401 }
      );
    }

    // Get full user data with settings
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
        notificationSettings: true,
        userSettings: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'user.notFound',
          message: 'User not found.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
          },
          notificationSettings: user.notificationSettings,
          userSettings: user.userSettings,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get profile error:', error);

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
 * PUT /api/user/profile
 * Update user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to update your profile.',
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'validation.failed',
          message: 'Please check your input and try again.',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, phone } = validationResult.data;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name: sanitizeInput(name) }),
        ...(phone && { phone: sanitizeInput(phone) }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        emailVerified: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully.',
        data: {
          user: updatedUser,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);

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
