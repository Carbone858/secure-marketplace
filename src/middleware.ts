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

async function verifyTokenFromCookie(request: NextRequest): Promise<{ userId: string; role: string } | null> {
  const token = request.cookies.get('access_token')?.value;
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { audience: 'secure-marketplace', issuer: 'secure-marketplace-api' }
    );
    if (payload.type !== 'access') return null;
    return { userId: payload.userId as string, role: payload.role as string };
  } catch {
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle API routes protection
  if (pathname.startsWith('/api/')) {
    const isProtectedApi = PROTECTED_API_PATTERNS.some(p => p.test(pathname));
    if (isProtectedApi) {
      // Check for auth token in cookie or Authorization header
      let token = request.cookies.get('access_token')?.value;
      if (!token) {
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.slice(7);
        }
      }
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      // For admin API routes, verify role
      if (pathname.startsWith('/api/admin/')) {
        const user = await verifyTokenFromCookie(request);
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
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdmin && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)', '/api/:path*']
};
