import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
  emailVerified: Date | null;
}

export interface AuthResult {
  user: AuthenticatedUser;
}

/**
 * Authenticate an API request by verifying the JWT from cookies or Authorization header.
 * Returns { user } on success, or a 401 NextResponse on failure.
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<AuthResult | NextResponse> {
  try {
    // Try to get token from cookies first, then Authorization header
    let token = request.cookies.get('access_token')?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload || payload.type !== 'access') {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        emailVerified: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.avatar, // Map avatar field to image for API compatibility
        emailVerified: user.emailVerified,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
