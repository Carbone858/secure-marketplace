import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { hashPassword } from '@/lib/auth';
import {
  registerSchema,
  sanitizeInput,
  hashEmail,
} from '@/lib/validations/auth';
import { sendEmail } from '@/lib/email/service';
import { getVerificationEmailTemplate } from '@/lib/email/templates';
import { registerLimiter, getClientIp, checkRateLimit } from '@/lib/rate-limit';
import { SecurityLogType } from '@prisma/client';
import crypto from 'crypto';

/**
 * Verify reCAPTCHA v3 token
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.warn('⚠️ RECAPTCHA_SECRET_KEY not configured');
      // In development, allow without verification
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
 * Log security event
 */
async function logSecurityEvent(
  type: 'REGISTER' | 'REGISTER_FAILED',
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
 * POST /api/auth/register
 * Handle user registration
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent');

  try {
    // Check rate limit (Redis-backed with in-memory fallback)
    const rateLimit = await checkRateLimit(request, registerLimiter, {
      type: SecurityLogType.REGISTER_FAILED
    });
    if (rateLimit instanceof Response) {
      await logSecurityEvent('REGISTER_FAILED', ip, userAgent, {
        reason: 'rate_limit_exceeded',
      });
      return rateLimit;
    }

    // Parse and validate request body
    const body = await request.json();

    // Sanitize inputs
    const sanitizedBody = {
      email: sanitizeInput(body.email || ''),
      password: body.password || '', // Don't sanitize password
      confirmPassword: body.confirmPassword || '',
      name: sanitizeInput(body.name || ''),
      phone: sanitizeInput(body.phone || ''),
      termsAccepted: body.termsAccepted === true,
      recaptchaToken: body.recaptchaToken || '',
    };

    // Validate with Zod
    const validationResult = registerSchema.safeParse(sanitizedBody);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      await logSecurityEvent('REGISTER_FAILED', ip, userAgent, {
        reason: 'validation_error',
        errors: Object.keys(errors),
      });
      return NextResponse.json(
        {
          success: false,
          error: 'validation.failed',
          message: 'Please check your input and try again.',
          errors,
        },
        { status: 400 }
      );
    }

    const { email, password, name, phone, recaptchaToken } =
      validationResult.data;

    // Verify reCAPTCHA (skip in dev if token is empty)
    if (recaptchaToken) {
      const recaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaValid) {
        await logSecurityEvent('REGISTER_FAILED', ip, userAgent, {
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
    } else if (process.env.NODE_ENV === 'production') {
      // In production, reCAPTCHA is mandatory
      return NextResponse.json(
        {
          success: false,
          error: 'recaptcha.required',
          message: 'Security verification is required.',
        },
        { status: 400 }
      );
    }

    // Check if email already exists (using hash for privacy)
    const emailHash = await hashEmail(email);
    const existingUser = await prisma.user.findUnique({
      where: { emailHash },
    });

    if (existingUser) {
      await logSecurityEvent('REGISTER_FAILED', ip, userAgent, {
        reason: 'email_exists',
      });
      // Return helpful but non-leaking error message
      const isArabic = request.headers.get('accept-language')?.startsWith('ar');
      const dupMessage = isArabic
        ? 'تعذّر إكمال التسجيل. إذا كان لديك حساب بالفعل، يرجى تسجيل الدخول أو إعادة تعيين كلمة المرور.'
        : 'Unable to complete registration. If you already have an account, please sign in or reset your password.';
      return NextResponse.json(
        {
          success: false,
          error: 'registration.failed',
          message: dupMessage,
        },
        { status: 400 }
      );
    }

    // Hash password with Argon2
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        emailHash,
        password: hashedPassword,
        name,
        phone,
        emailVerified: null,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token
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
      name || email,
      verificationUrl,
      locale
    );

    const emailResult = await sendEmail({
      to: email,
      template: emailTemplate,
    });

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Don't fail registration if email fails, but log it
    }

    // Log successful registration
    await logSecurityEvent('REGISTER', ip, userAgent, {
      userId: user.id,
    });

    // Return success response (without sensitive data)
    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        data: {
          userId: user.id,
          email: user.email,
          emailSent: emailResult.success,
        },
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('Registration error:', error);

    await logSecurityEvent('REGISTER_FAILED', ip, userAgent, {
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

/**
 * GET /api/auth/register
 * Check registration status (for health checks)
 */
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: 'Registration endpoint is active',
    },
    { status: 200 }
  );
}
