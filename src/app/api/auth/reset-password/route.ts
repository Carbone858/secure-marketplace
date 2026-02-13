import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { resetPasswordSchema } from '@/lib/validations/auth';
import { hashPassword } from '@/lib/auth';
import { authLimiter, getClientIp } from '@/lib/rate-limit';

/**
 * Log security event
 */
async function logSecurityEvent(
  type: 'PASSWORD_RESET' | 'PASSWORD_RESET_FAILED',
  ip: string,
  userAgent: string | null,
  userId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.securityLog.create({
      data: {
        type,
        userId,
        ip,
        userAgent: userAgent?.slice(0, 255) || null,
        metadata: (metadata || {}) as any,
      },
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

/**
 * POST /api/auth/reset-password
 * Handle password reset
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent');

  try {
    // Check rate limit (Redis-backed with in-memory fallback)
    const rateLimit = await authLimiter.check(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'rateLimit.exceeded',
          message: 'Too many password reset attempts. Please try again later.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
            'Retry-After': String(rateLimit.retryAfter || 60),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = resetPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      await logSecurityEvent('PASSWORD_RESET_FAILED', ip, userAgent, undefined, {
        reason: 'validation_error',
        errors: validationResult.error.flatten().fieldErrors,
      });
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

    const { token, password } = validationResult.data;

    // Find the reset token
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      await logSecurityEvent('PASSWORD_RESET_FAILED', ip, userAgent, undefined, {
        reason: 'token_not_found',
      });
      return NextResponse.json(
        {
          success: false,
          error: 'token.invalid',
          message: 'Invalid or expired reset token.',
        },
        { status: 400 }
      );
    }

    // Check if token has been used
    if (resetRecord.usedAt) {
      await logSecurityEvent('PASSWORD_RESET_FAILED', ip, userAgent, undefined, {
        reason: 'token_already_used',
        email: resetRecord.email,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'token.used',
          message: 'This reset link has already been used. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > resetRecord.expires) {
      await logSecurityEvent('PASSWORD_RESET_FAILED', ip, userAgent, undefined, {
        reason: 'token_expired',
        email: resetRecord.email,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'token.expired',
          message: 'Reset token has expired. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: resetRecord.email },
    });

    if (!user) {
      await logSecurityEvent('PASSWORD_RESET_FAILED', ip, userAgent, undefined, {
        reason: 'user_not_found',
        email: resetRecord.email,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'user.notFound',
          message: 'User not found.',
        },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user's password and reset failed login attempts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    });

    // Revoke all existing refresh tokens for this user
    await prisma.refreshToken.updateMany({
      where: {
        userId: user.id,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    // Log successful password reset
    await logSecurityEvent('PASSWORD_RESET', ip, userAgent, user.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Password has been reset successfully. Please log in with your new password.',
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('Reset password error:', error);

    await logSecurityEvent('PASSWORD_RESET_FAILED', ip, userAgent, undefined, {
      reason: 'server_error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

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
