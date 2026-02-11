import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { verifyPassword, hashPassword } from '@/lib/auth';
import { z } from 'zod';

// Password change validation schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain a special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * PUT /api/user/password
 * Change user password
 */
export async function PUT(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent');

  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to change your password.',
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = changePasswordSchema.safeParse(body);

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

    const { currentPassword, newPassword } = validationResult.data;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
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

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      // Log failed password change attempt
      await prisma.securityLog.create({
        data: {
          type: 'PASSWORD_RESET_FAILED',
          userId: user.id,
          ip,
          userAgent: userAgent?.slice(0, 255) || null,
          metadata: { reason: 'invalid_current_password' },
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'password.invalid',
          message: 'Current password is incorrect.',
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Revoke all refresh tokens for security
    await prisma.refreshToken.updateMany({
      where: {
        userId: user.id,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    // Log successful password change
    await prisma.securityLog.create({
      data: {
        type: 'PASSWORD_RESET',
        userId: user.id,
        ip,
        userAgent: userAgent?.slice(0, 255) || null,
        metadata: { source: 'user_settings' },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Password changed successfully. Please log in again with your new password.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);

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
