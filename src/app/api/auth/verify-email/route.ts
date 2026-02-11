import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyEmailSchema } from '@/lib/validations/auth';
import { sendEmail } from '@/lib/email/service';
import { getWelcomeEmailTemplate } from '@/lib/email/templates';

/**
 * Log security event
 */
async function logSecurityEvent(
  type: 'EMAIL_VERIFIED' | 'EMAIL_VERIFICATION_FAILED',
  ip: string,
  userAgent: string | null,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.securityLog.create({
      data: {
        type,
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
 * POST /api/auth/verify-email
 * Verify email address with token
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent');

  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = verifyEmailSchema.safeParse(body);

    if (!validationResult.success) {
      await logSecurityEvent('EMAIL_VERIFICATION_FAILED', ip, userAgent, {
        reason: 'invalid_token_format',
      });
      return NextResponse.json(
        {
          success: false,
          error: 'token.invalid',
          message: 'Invalid verification token.',
        },
        { status: 400 }
      );
    }

    const { token } = validationResult.data;

    // Find the verification token
    const verificationRecord = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationRecord) {
      await logSecurityEvent('EMAIL_VERIFICATION_FAILED', ip, userAgent, {
        reason: 'token_not_found',
      });
      return NextResponse.json(
        {
          success: false,
          error: 'token.invalid',
          message: 'Invalid or expired verification token.',
        },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > verificationRecord.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { id: verificationRecord.id },
      });

      await logSecurityEvent('EMAIL_VERIFICATION_FAILED', ip, userAgent, {
        reason: 'token_expired',
        email: verificationRecord.email,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'token.expired',
          message: 'Verification token has expired. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationRecord.email },
    });

    if (!user) {
      await logSecurityEvent('EMAIL_VERIFICATION_FAILED', ip, userAgent, {
        reason: 'user_not_found',
        email: verificationRecord.email,
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

    // Check if email is already verified
    if (user.emailVerified) {
      // Delete the token anyway
      await prisma.verificationToken.delete({
        where: { id: verificationRecord.id },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Email is already verified.',
          data: { alreadyVerified: true },
        },
        { status: 200 }
      );
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { id: verificationRecord.id },
    });

    // Send welcome email
    const locale = request.headers.get('accept-language')?.startsWith('ar')
      ? 'ar'
      : 'en';

    const welcomeTemplate = getWelcomeEmailTemplate(
      user.name || user.email,
      locale
    );

    await sendEmail({
      to: user.email,
      template: welcomeTemplate,
    });

    // Log successful verification
    await logSecurityEvent('EMAIL_VERIFIED', ip, userAgent, {
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully. You can now log in.',
        data: {
          userId: user.id,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);

    await logSecurityEvent('EMAIL_VERIFICATION_FAILED', ip, userAgent, {
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
