import { hash, verify } from 'argon2';
import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-fallback-secret-min-32-characters-long'
);

const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, { type: 2, memoryCost: 65536, timeCost: 3, parallelism: 4 });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try { return await verify(hash, password); } catch { return false; }
}

/**
 * Generate JWT access token
 */
export async function generateAccessToken(payload: Omit<TokenPayload, 'type'>): Promise<string> {
  return new SignJWT({ ...payload, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setAudience('secure-marketplace')
    .setIssuer('secure-marketplace-api')
    .sign(JWT_SECRET);
}

/**
 * Generate JWT refresh token
 */
export async function generateRefreshToken(payload: Omit<TokenPayload, 'type'>): Promise<string> {
  return new SignJWT({ ...payload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .setAudience('secure-marketplace')
    .setIssuer('secure-marketplace-api')
    .sign(JWT_SECRET);
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      audience: 'secure-marketplace',
      issuer: 'secure-marketplace-api',
    });
    return payload as unknown as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Generate secure random token for password reset
 */
export function generateSecureToken(length: number = 64): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Set authentication cookies
 */
export function getAuthCookies(accessToken: string, refreshToken: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    accessToken: {
      name: 'access_token',
      value: accessToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict' as const,
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    },
    refreshToken: {
      name: 'refresh_token',
      value: refreshToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    },
  };
}

/**
 * Clear authentication cookies
 */
export function getClearAuthCookies() {
  return {
    accessToken: {
      name: 'access_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 0,
      path: '/',
    },
    refreshToken: {
      name: 'refresh_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 0,
      path: '/',
    },
  };
}
