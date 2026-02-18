import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localeDetection: true,
  localePrefix: 'always'
});

// Routes that require authentication
const PROTECTED_PATTERNS = [
  /^\/[a-z]{2}\/dashboard/,
  /^\/[a-z]{2}\/admin/,
  /^\/[a-z]{2}\/company\/dashboard/,
];

// Routes that require admin role
const ADMIN_PATTERNS = [
  /^\/[a-z]{2}\/admin/,
];

// API routes that require auth (excluding public endpoints)
const PROTECTED_API_PATTERNS = [
  /^\/api\/admin\//,
  /^\/api\/projects/,
  /^\/api\/messages/,
  /^\/api\/notifications/,
  /^\/api\/offers/,
  /^\/api\/user\//,
  /^\/api\/matching\//,
  /^\/api\/membership\/subscribe/,
  /^\/api\/company\/dashboard/,
];

// API routes that are always public (bypass auth even if they match above)
const PUBLIC_API_WHITELIST = [
  /^\/api\/admin\/seed-companies/,
];

import { getToken } from 'next-auth/jwt';

async function verifyTokenFromCookie(request: NextRequest): Promise<{ userId: string; role: string } | null> {
  // 1. Try Custom Auth Token
  let token = request.cookies.get('access_token')?.value;

  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (token) {
    const secret = process.env.JWT_SECRET;
    if (secret) {
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(secret),
          { audience: 'secure-marketplace', issuer: 'secure-marketplace-api' }
        );
        if (payload.type === 'access') {
          return { userId: payload.userId as string, role: payload.role as string };
        }
      } catch {
        // Continue to check NextAuth if custom token fails
      }
    }
  }

  // 2. Try NextAuth Token (Social Login)
  try {
    const nextAuthToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
    });

    if (nextAuthToken?.id) {
      return {
        userId: nextAuthToken.id as string,
        role: (nextAuthToken.role as string) || 'USER'
      };
    }
  } catch {
    return null;
  }

  return null;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle API routes protection
  if (pathname.startsWith('/api/')) {
    const isWhitelisted = PUBLIC_API_WHITELIST.some(p => p.test(pathname));
    const isProtectedApi = !isWhitelisted && PROTECTED_API_PATTERNS.some(p => p.test(pathname));
    if (isProtectedApi) {
      // Verify auth token (supporting Cookie, Bearer, and NextAuth)
      const user = await verifyTokenFromCookie(request);

      if (!user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      // For admin API routes, verify role
      if (pathname.startsWith('/api/admin/')) {
        // user is already verified above
        if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
      }
    }

    // CSRF protection for state-changing methods on API routes
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      if (origin) {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
        }
      }
    }

    return NextResponse.next();
  }

  // Handle page routes
  const isProtected = PROTECTED_PATTERNS.some(p => p.test(pathname));
  const isAdmin = ADMIN_PATTERNS.some(p => p.test(pathname));

  if (isProtected) {
    const user = await verifyTokenFromCookie(request);
    const locale = pathname.split('/')[1] || 'ar';

    if (!user) {
      // Try to silently refresh using the refresh_token cookie
      const refreshToken = request.cookies.get('refresh_token')?.value;
      if (refreshToken) {
        try {
          const secret = process.env.JWT_SECRET;
          if (secret) {
            const { payload } = await jwtVerify(
              refreshToken,
              new TextEncoder().encode(secret),
              { audience: 'secure-marketplace', issuer: 'secure-marketplace-api' }
            );
            if (payload.type === 'refresh' && payload.userId) {
              // Issue a new access token inline
              const { SignJWT } = await import('jose');
              const newAccessToken = await new SignJWT({
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
                type: 'access',
              })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('2h')
                .setAudience('secure-marketplace')
                .setIssuer('secure-marketplace-api')
                .sign(new TextEncoder().encode(secret));

              // Let the request through and set the new cookie on the response
              const intlResponse = intlMiddleware(request);
              const response = intlResponse || NextResponse.next();
              response.cookies.set('access_token', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 2 * 60 * 60, // 2 hours
                path: '/',
              });
              return response;
            }
          }
        } catch {
          // Refresh token invalid — fall through to redirect
        }
      }

      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdmin && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  // Only apply next-intl to non-API routes (reuse existing pathname)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next|_vercel|.*\\..*).*)',
    // Explicitly match all API routes
    '/api/:path*',
  ]
};
