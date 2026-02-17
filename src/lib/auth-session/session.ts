import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  avatar: string | null;
  emailVerified: Date | null;
}

export interface Session {
  user: SessionUser | null;
  isAuthenticated: boolean;
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<Session> {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      // Try to get session from NextAuth (Social Login)
      const nextAuthSession = await getServerSession(authOptions);

      if (nextAuthSession?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: nextAuthSession.user.email },
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

        if (user && user.isActive) {
          return {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              avatar: user.avatar,
              emailVerified: user.emailVerified,
            },
            isAuthenticated: true,
          };
        }
      }

      return { user: null, isAuthenticated: false };
    }

    // Verify the token
    const payload = await verifyToken(accessToken);

    if (!payload || payload.type !== 'access') {
      return { user: null, isAuthenticated: false };
    }

    // Get user from database
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
      return { user: null, isAuthenticated: false };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
      },
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('Session error:', error);
    return { user: null, isAuthenticated: false };
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();

  if (!session.isAuthenticated || !session.user) {
    throw new Error('Unauthorized');
  }

  return session.user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isAuthenticated;
}
