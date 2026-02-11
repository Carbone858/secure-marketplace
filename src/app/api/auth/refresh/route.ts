import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyToken, generateAccessToken, generateRefreshToken, getAuthCookies } from '@/lib/auth';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const refreshTokenCookie = cookieStore.get('refresh_token')?.value;

    if (!refreshTokenCookie) {
      return NextResponse.json(
        {
          success: false,
          error: 'token.missing',
          message: 'No refresh token provided.',
        },
        { status: 401 }
      );
    }

    // Verify the refresh token
    const payload = await verifyToken(refreshTokenCookie);

    if (!payload || payload.type !== 'refresh') {
      // Clear invalid cookies
      cookieStore.set('access_token', '', { maxAge: 0, path: '/' });
      cookieStore.set('refresh_token', '', { maxAge: 0, path: '/' });

      return NextResponse.json(
        {
          success: false,
          error: 'token.invalid',
          message: 'Invalid or expired refresh token.',
        },
        { status: 401 }
      );
    }

    // Check if token exists in database and is not revoked
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenCookie },
      include: { user: true },
    });

    if (!storedToken || storedToken.revokedAt || new Date() > storedToken.expiresAt) {
      // Clear invalid cookies
      cookieStore.set('access_token', '', { maxAge: 0, path: '/' });
      cookieStore.set('refresh_token', '', { maxAge: 0, path: '/' });

      return NextResponse.json(
        {
          success: false,
          error: 'token.invalid',
          message: 'Invalid or expired refresh token.',
        },
        { status: 401 }
      );
    }

    const user = storedToken.user;

    // Check if user is still active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'account.inactive',
          message: 'Account is no longer active.',
        },
        { status: 403 }
      );
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = await generateAccessToken(tokenPayload);
    const newRefreshToken = await generateRefreshToken(tokenPayload);

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Store new refresh token
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent');

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: ip,
        userAgent: userAgent?.slice(0, 255) || null,
      },
    });

    // Set new cookies
    const authCookies = getAuthCookies(newAccessToken, newRefreshToken);
    cookieStore.set(authCookies.accessToken);
    cookieStore.set(authCookies.refreshToken);

    return NextResponse.json(
      {
        success: true,
        message: 'Token refreshed successfully.',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token refresh error:', error);

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
