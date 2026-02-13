import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { resendVerificationSchema, hashEmail } from '@/lib/validations/auth';
import { sendEmail } from '@/lib/email/service';
import { getVerificationEmailTemplate } from '@/lib/email/templates';
import { strictLimiter, getClientIp } from '@/lib/rate-limit';
import crypto from 'crypto';

/**
 * Verify reCAPTCHA v3 token
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.warn('⚠️ RECAPTCHA_SECRET_KEY not configured');
      return process.env.NODE_ENV !== 'production';
    }

    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data = await response.json();
    return data.success === true && data.score >= 0.5;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}

/**
 * Generate secure verification token
 */
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * POST /api/auth/resend-verification
 * Resend verification email
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent');

  try {
    // Check rate limit (Redis-backed with in-memory fallback)
    const rateLimit = await strictLimiter.check(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'rateLimit.exceeded',
          message: 'Too many requests. Please try again later.',
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
    const validationResult = resendVerificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'validation.failed',
          message: 'Please provide a valid email address.',
        },
        { status: 400 }
      );
    }

    const { email, recaptchaToken } = validationResult.data;

    // Verify reCAPTCHA (skip in dev if token is empty)
    if (recaptchaToken) {
      const recaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaValid) {
        return NextResponse.json(
          {
            success: false,
            error: 'recaptcha.invalid',
            message: 'Security verification failed. Please try again.',
          },
          { status: 400 }
        );
      }
    } else if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'recaptcha.required',
          message: 'Security verification is required.',
        },
        { status: 400 }
      );
    }

    // Find user by email hash
    const emailHash = await hashEmail(email);
    const user = await prisma.user.findUnique({
      where: { emailHash },
    });

    // If user not found, still return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: 'If an account exists with this email, a verification link has been sent.',
        },
        { status: 200 }
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: true,
          message: 'If an account exists with this email, a verification link has been sent.',
        },
        { status: 200 }
      );
    }

    // Delete any existing verification tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { email },
    });

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store new verification token
    await prisma.verificationToken.create({
      data: {
        email,
        token: verificationToken,
        expires: tokenExpiry,
      },
    });

    // Send verification email
    const locale = request.headers.get('accept-language')?.startsWith('ar')
      ? 'ar'
      : 'en';
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/auth/verify-email/${verificationToken}`;

    const emailTemplate = getVerificationEmailTemplate(
      user.name || email,
      verificationUrl,
      locale
    );

    const emailResult = await sendEmail({
      to: email,
      template: emailTemplate,
    });

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      return NextResponse.json(
        {
          success: false,
          error: 'email.failed',
          message: 'Failed to send verification email. Please try again later.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with this email, a verification link has been sent.',
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
    console.error('Resend verification error:', error);

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
