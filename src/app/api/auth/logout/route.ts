import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyToken, getClearAuthCookies } from '@/lib/auth';
import { cookies } from 'next/headers';

/**
 * Log security event
 */
async function logSecurityEvent(
  type: 'LOGOUT',
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
 * POST /api/auth/logout
 * Handle user logout
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent');

  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    const accessToken = cookieStore.get('access_token')?.value;

    let userId: string | undefined;

    // Verify and decode the token to get user ID
    if (accessToken) {
      const payload = await verifyToken(accessToken);
      if (payload) {
        userId = payload.userId;
      }
    }

    // If refresh token exists, revoke it in the database
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revokedAt: new Date() },
      });
    }

    // Clear cookies
    const clearCookies = getClearAuthCookies();
    cookieStore.set(clearCookies.accessToken);
    cookieStore.set(clearCookies.refreshToken);

    // Log logout event
    if (userId) {
      await logSecurityEvent('LOGOUT', ip, userAgent, userId);
    }

    // Redirect to home page after logout
    return NextResponse.redirect(new URL('/', request.url), { status: 303 });
  } catch (error) {
    console.error('Logout error:', error);

    // Still clear cookies even if there's an error
    const cookieStore = cookies();
    const clearCookies = getClearAuthCookies();
    cookieStore.set(clearCookies.accessToken);
    cookieStore.set(clearCookies.refreshToken);

    // Redirect to home even on error
    return NextResponse.redirect(new URL('/', request.url), { status: 303 });
  }
}

/**
 * GET /api/auth/logout
 * Alternative logout method (for links)
 */
export async function GET(request: NextRequest) {
  return POST(request);
}
