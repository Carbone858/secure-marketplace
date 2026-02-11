import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { forgotPasswordSchema, hashEmail } from '@/lib/validations/auth';
import { generateSecureToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email/service';
import { getPasswordResetEmailTemplate } from '@/lib/email/templates';

// Rate limiting configuration
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit for IP address
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetTime: now + RATE_LIMIT_WINDOW };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count, resetTime: record.resetTime };
}

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
 * POST /api/auth/forgot-password
 * Handle password reset request
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent');

  try {
    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: 'rateLimit.exceeded',
          message: 'Too many password reset requests. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
            'Retry-After': String(retryAfter),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = forgotPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      await logSecurityEvent('PASSWORD_RESET_FAILED', ip, userAgent, undefined, {
        reason: 'validation_error',
      });
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

    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
      await logSecurityEvent('PASSWORD_RESET_FAILED', ip, userAgent, undefined, {
        reason: 'recaptcha_failed',
      });
      return NextResponse.json(
        {
          success: false,
          error: 'recaptcha.invalid',
          message: 'Security verification failed. Please try again.',
        },
        { status: 400 }
      );
    }

    // Find user by email hash
    const emailHash = await hashEmail(email);
    const user = await prisma.user.findUnique({
      where: { emailHash },
    });

    // Always return success to prevent email enumeration
    // But only send email if user exists and is active
    if (user && user.isActive) {
      // Delete any existing unused tokens for this email
      await prisma.passwordResetToken.deleteMany({
        where: {
          email,
          usedAt: null,
        },
      });

      // Generate new reset token
      const resetToken = generateSecureToken(64);
      const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token
      await prisma.passwordResetToken.create({
        data: {
          email,
          token: resetToken,
          expires: tokenExpiry,
        },
      });

      // Send password reset email
      const locale = request.headers.get('accept-language')?.startsWith('ar')
        ? 'ar'
        : 'en';
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/auth/reset-password/${resetToken}`;

      const emailTemplate = getPasswordResetEmailTemplate(
        user.name || email,
        resetUrl,
        locale
      );

      const emailResult = await sendEmail({
        to: email,
        template: emailTemplate,
      });

      if (!emailResult.success) {
        console.error('Failed to send password reset email:', emailResult.error);
      }

      // Log password reset request
      await logSecurityEvent('PASSWORD_RESET', ip, userAgent, user.id, {
        emailSent: emailResult.success,
      });
    }

    // Return generic success message
    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('Forgot password error:', error);

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
