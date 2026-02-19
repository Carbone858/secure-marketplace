import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyPassword, generateAccessToken, generateRefreshToken, getAuthCookies } from '@/lib/auth';
import { loginSchema, hashEmail } from '@/lib/validations/auth';
import { loginLimiter, getClientIp, getIdentifyKey, checkRateLimit } from '@/lib/rate-limit';
import { SecurityLogType } from '@prisma/client';
import { cookies } from 'next/headers';

const ACCOUNT_LOCKOUT_ATTEMPTS = 5;
const ACCOUNT_LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Log security event
 */
async function logSecurityEvent(
  type: 'LOGIN' | 'LOGIN_FAILED' | 'ACCOUNT_LOCKED',
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
 * POST /api/auth/login
 * Handle user login
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent');

  try {
    // Check rate limit (Redis-backed with in-memory fallback)
    const rateLimit = await checkRateLimit(request, loginLimiter, {
      type: SecurityLogType.LOGIN_FAILED
    });
    if (rateLimit instanceof Response) return rateLimit;

    // Parse and validate request body
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      await logSecurityEvent('LOGIN_FAILED', ip, userAgent, undefined, {
        reason: 'validation_error',
      });
      return NextResponse.json(
        {
          success: false,
          error: 'validation.failed',
          message: 'Please provide valid email and password.',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = validationResult.data;

    // Find user by email hash
    const emailHash = await hashEmail(email);
    const user = await prisma.user.findUnique({
      where: { emailHash },
    });

    // Check if user exists and is active
    if (!user || !user.isActive) {
      await logSecurityEvent('LOGIN_FAILED', ip, userAgent, undefined, {
        reason: 'user_not_found_or_inactive',
        email: email.substring(0, 3) + '***',
      });
      // Return generic error to prevent user enumeration
      return NextResponse.json(
        {
          success: false,
          error: 'login.invalid',
          message: 'Invalid email or password.',
        },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      await logSecurityEvent('LOGIN_FAILED', ip, userAgent, user.id, {
        reason: 'account_locked',
        lockedUntil: user.lockedUntil.toISOString(),
      });
      return NextResponse.json(
        {
          success: false,
          error: 'account.locked',
          message: `Account is temporarily locked due to too many failed attempts. Please try again in ${remainingTime} minutes.`,
          data: { lockedUntil: user.lockedUntil.toISOString(), remainingMinutes: remainingTime },
        },
        { status: 423 }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      await logSecurityEvent('LOGIN_FAILED', ip, userAgent, user.id, {
        reason: 'email_not_verified',
      });
      return NextResponse.json(
        {
          success: false,
          error: 'email.notVerified',
          message: 'Please verify your email address before logging in.',
          data: { requiresVerification: true, email: user.email },
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      const newFailedAttempts = user.failedLoginAttempts + 1;
      const shouldLockAccount = newFailedAttempts >= ACCOUNT_LOCKOUT_ATTEMPTS;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newFailedAttempts,
          ...(shouldLockAccount && {
            lockedUntil: new Date(Date.now() + ACCOUNT_LOCKOUT_DURATION),
          }),
        },
      });

      if (shouldLockAccount) {
        await logSecurityEvent('ACCOUNT_LOCKED', ip, userAgent, user.id, {
          failedAttempts: newFailedAttempts,
          lockedUntil: new Date(Date.now() + ACCOUNT_LOCKOUT_DURATION).toISOString(),
        });
        return NextResponse.json(
          {
            success: false,
            error: 'account.locked',
            message: 'Account has been temporarily locked due to too many failed login attempts. Please try again in 30 minutes.',
            data: { lockedDuration: 30 },
          },
          { status: 423 }
        );
      }

      await logSecurityEvent('LOGIN_FAILED', ip, userAgent, user.id, {
        reason: 'invalid_password',
        failedAttempts: newFailedAttempts,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'login.invalid',
          message: 'Invalid email or password.',
          data: { remainingAttempts: ACCOUNT_LOCKOUT_ATTEMPTS - newFailedAttempts },
        },
        { status: 401 }
      );
    }

    // Password is valid - reset failed attempts and clear lock
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await generateAccessToken(tokenPayload);
    const refreshToken = await generateRefreshToken(tokenPayload);

    // Store refresh token in database
    const refreshTokenExpiry = new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiry,
        ipAddress: ip,
        userAgent: userAgent?.slice(0, 255) || null,
      },
    });

    // Log successful login
    await logSecurityEvent('LOGIN', ip, userAgent, user.id, {
      rememberMe,
    });

    // Set cookies
    const cookieStore = cookies();
    const authCookies = getAuthCookies(accessToken, refreshToken);

    // Adjust refresh token expiry based on remember me
    if (rememberMe) {
      authCookies.refreshToken.maxAge = 30 * 24 * 60 * 60; // 30 days
    }

    cookieStore.set(authCookies.accessToken);
    cookieStore.set(authCookies.refreshToken);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful.',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
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
    console.error('Login error:', error);

    await logSecurityEvent('LOGIN_FAILED', ip, userAgent, undefined, {
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
