import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { verifyPassword } from '@/lib/auth';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { getClearAuthCookies } from '@/lib/auth';

// Account deletion validation schema
const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  reason: z.string().max(500, 'Reason is too long').optional(),
  confirmation: z.literal('DELETE', {
    errorMap: () => ({ message: 'Please type DELETE to confirm' }),
  }),
});

/**
 * DELETE /api/user/account
 * Delete user account (GDPR compliance)
 */
export async function DELETE(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent');

  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to delete your account.',
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = deleteAccountSchema.safeParse(body);

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

    const { password, reason } = validationResult.data;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true, email: true },
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

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'password.invalid',
          message: 'Password is incorrect.',
        },
        { status: 400 }
      );
    }

    // Store deletion reason in settings before deletion
    if (reason) {
      await prisma.userSettings.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          deletionReason: reason,
          deletionRequestedAt: new Date(),
        },
        update: {
          deletionReason: reason,
          deletionRequestedAt: new Date(),
        },
      });
    }

    // Log account deletion
    await prisma.securityLog.create({
      data: {
        type: 'SUSPICIOUS_ACTIVITY', // Using this type for account deletion
        userId: user.id,
        ip,
        userAgent: userAgent?.slice(0, 255) || null,
        metadata: { action: 'account_deletion', reason },
      },
    });

    // Anonymize user data instead of hard delete (GDPR best practice)
    // This preserves referential integrity while protecting user privacy
    const anonymizedEmail = `deleted_${user.id}@anonymized.local`;
    const anonymizedHash = `deleted_${user.id}`;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: anonymizedEmail,
        emailHash: anonymizedHash,
        password: 'DELETED',
        name: 'Deleted User',
        phone: null,
        avatar: null,
        isActive: false,
        emailVerified: null,
      },
    });

    // Revoke all refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { revokedAt: new Date() },
    });

    // Clear cookies
    const cookieStore = cookies();
    const clearCookies = getClearAuthCookies();
    cookieStore.set(clearCookies.accessToken);
    cookieStore.set(clearCookies.refreshToken);

    return NextResponse.json(
      {
        success: true,
        message: 'Your account has been deleted successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Account deletion error:', error);

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
 * POST /api/user/account/deletion-request
 * Request account deletion (with grace period)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to request account deletion.',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reason } = body;

    // Update user settings with deletion request
    await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        deletionRequestedAt: new Date(),
        deletionReason: reason || null,
      },
      update: {
        deletionRequestedAt: new Date(),
        deletionReason: reason || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account deletion request received. Your account will be deleted within 30 days.',
        data: {
          gracePeriodDays: 30,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Deletion request error:', error);

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
