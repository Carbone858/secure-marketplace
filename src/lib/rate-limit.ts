/**
 * Production-ready rate limiter with Redis backend + in-memory fallback.
 *
 * Features:
 *   • Sliding-window algorithm (accurate, no burst gaps)
 *   • Redis-backed for multi-instance / horizontal scaling
 *   • Automatic in-memory fallback when Redis is unavailable
 *   • Configurable via environment variables
 *   • Per-IP rate limiting with key prefixes
 *
 * Environment variables:
 *   REDIS_URL                       — Redis connection string
 *   RATE_LIMIT_REGISTER_MAX         — Max registration attempts per window (default: 5)
 *   RATE_LIMIT_REGISTER_WINDOW_SEC  — Window in seconds (default: 300 = 5 min)
 *   RATE_LIMIT_LOGIN_MAX            — Max login attempts per window (default: 10)
 *   RATE_LIMIT_LOGIN_WINDOW_SEC     — Window in seconds (default: 900 = 15 min)
 *   RATE_LIMIT_API_MAX              — General API limit per window (default: 60)
 *   RATE_LIMIT_API_WINDOW_SEC       — Window in seconds (default: 60)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { SecurityLogType } from '@prisma/client';
import { getRedisClient } from './redis';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface RateLimitEntry {
  timestamps: number[];
}

export interface RateLimiterOptions {
  /** Time window in milliseconds */
  interval: number;
  /** Maximum requests allowed per window */
  maxRequests: number;
  /** Optional key prefix for namespacing in Redis */
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfter?: number;
  resetAt?: number;
}

export interface RateLimiter {
  check(identifier: string): Promise<RateLimitResult>;
  checkSync(identifier: string): RateLimitResult;
  reset(identifier: string): Promise<void>;
}

// ──────────────────────────────────────────────
// In-memory store (fallback when Redis is unavailable)
// ──────────────────────────────────────────────

const memoryStores = new Map<string, Map<string, RateLimitEntry>>();

// Periodic cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    memoryStores.forEach((store) => {
      store.forEach((entry, key) => {
        entry.timestamps = entry.timestamps.filter((t) => now - t < 600_000);
        if (entry.timestamps.length === 0) {
          store.delete(key);
        }
      });
    });
  }, 300_000);
}

function memoryCheck(
  storeId: string,
  identifier: string,
  options: RateLimiterOptions
): RateLimitResult {
  if (!memoryStores.has(storeId)) {
    memoryStores.set(storeId, new Map());
  }
  const store = memoryStores.get(storeId)!;
  const now = Date.now();
  const entry = store.get(identifier) || { timestamps: [] };

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < options.interval);

  if (entry.timestamps.length >= options.maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfter = Math.ceil(
      (oldestInWindow + options.interval - now) / 1000
    );
    store.set(identifier, entry);
    return {
      allowed: false,
      remaining: 0,
      limit: options.maxRequests,
      retryAfter,
      resetAt: oldestInWindow + options.interval,
    };
  }

  entry.timestamps.push(now);
  store.set(identifier, entry);

  return {
    allowed: true,
    remaining: options.maxRequests - entry.timestamps.length,
    limit: options.maxRequests,
  };
}

function memoryReset(storeId: string, identifier: string): void {
  memoryStores.get(storeId)?.delete(identifier);
}

// ──────────────────────────────────────────────
// Redis-backed sliding window
// ──────────────────────────────────────────────

async function redisCheck(
  identifier: string,
  options: RateLimiterOptions
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  if (!redis) {
    // Fallback to in-memory
    return memoryCheck(
      options.keyPrefix || 'default',
      identifier,
      options
    );
  }

  const key = `ratelimit:${options.keyPrefix || 'default'}:${identifier}`;
  const now = Date.now();
  const windowStart = now - options.interval;

  try {
    // Atomic sliding window using sorted set
    const pipeline = redis.pipeline();
    // Remove entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);
    // Count current entries in window
    pipeline.zcard(key);
    // Add current request
    pipeline.zadd(key, now.toString(), `${now}:${Math.random()}`);
    // Set TTL so keys auto-expire
    pipeline.pexpire(key, options.interval);

    const results = await pipeline.exec();

    if (!results) {
      // Pipeline failed, fallback to memory
      return memoryCheck(
        options.keyPrefix || 'default',
        identifier,
        options
      );
    }

    // zcard result is at index 1 (0-based: zremrangebyscore=0, zcard=1)
    const currentCount = (results[1]?.[1] as number) || 0;

    if (currentCount >= options.maxRequests) {
      // Over the limit — get oldest entry to calculate retry-after
      const oldest = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const oldestTimestamp = oldest.length >= 2 ? parseInt(oldest[1], 10) : now;
      const retryAfter = Math.ceil(
        (oldestTimestamp + options.interval - now) / 1000
      );

      return {
        allowed: false,
        remaining: 0,
        limit: options.maxRequests,
        retryAfter: Math.max(retryAfter, 1),
        resetAt: oldestTimestamp + options.interval,
      };
    }

    return {
      allowed: true,
      remaining: options.maxRequests - currentCount - 1, // -1 for the one we just added
      limit: options.maxRequests,
    };
  } catch (err) {
    console.error('[RateLimit] Redis error, falling back to memory:', err);
    return memoryCheck(
      options.keyPrefix || 'default',
      identifier,
      options
    );
  }
}

async function redisReset(
  identifier: string,
  keyPrefix: string
): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.del(`ratelimit:${keyPrefix}:${identifier}`);
    } catch {
      // Ignore Redis errors on reset
    }
  }
  memoryReset(keyPrefix, identifier);
}

// ──────────────────────────────────────────────
// Public API: createRateLimiter
// ──────────────────────────────────────────────

export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  return {
    /**
     * Check if the identifier (typically an IP) is within rate limits.
     * Uses Redis when available, falls back to in-memory.
     */
    async check(identifier: string): Promise<RateLimitResult> {
      return redisCheck(identifier, options);
    },

    /**
     * Synchronous check using in-memory store only.
     * Use when you cannot await (rare cases).
     */
    checkSync(identifier: string): RateLimitResult {
      return memoryCheck(
        options.keyPrefix || 'default',
        identifier,
        options
      );
    },

    /**
     * Reset rate limit for an identifier (e.g. after successful verification).
     */
    async reset(identifier: string): Promise<void> {
      await redisReset(identifier, options.keyPrefix || 'default');
    },
  };
}

// ──────────────────────────────────────────────
// Pre-configured limiters (env-var driven)
// ──────────────────────────────────────────────

function envInt(name: string, fallback: number): number {
  const val = process.env[name];
  if (val) {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return fallback;
}

/** Registration: default 5 per 5 min */
export const registerLimiter = createRateLimiter({
  interval: envInt('RATE_LIMIT_REGISTER_WINDOW_SEC', 300) * 1000,
  maxRequests: envInt('RATE_LIMIT_REGISTER_MAX', 5),
  keyPrefix: 'register',
});

/** Login: default 10 per 15 min */
export const loginLimiter = createRateLimiter({
  interval: envInt('RATE_LIMIT_LOGIN_WINDOW_SEC', 900) * 1000,
  maxRequests: envInt('RATE_LIMIT_LOGIN_MAX', 10),
  keyPrefix: 'login',
});

/** General API rate limit: 60 per minute */
export const apiLimiter = createRateLimiter({
  interval: envInt('RATE_LIMIT_API_WINDOW_SEC', 60) * 1000,
  maxRequests: envInt('RATE_LIMIT_API_MAX', 60),
  keyPrefix: 'api',
});

/** Auth endpoints: 10 requests per minute */
export const authLimiter = createRateLimiter({
  interval: 60_000,
  maxRequests: 10,
  keyPrefix: 'auth',
});

/** Refresh token: 5 requests per 15 minutes */
export const refreshLimiter = createRateLimiter({
  interval: 15 * 60 * 1000,
  maxRequests: 5,
  keyPrefix: 'refresh',
});

/** Strict rate limit: 5 requests per minute (sensitive operations) */
export const strictLimiter = createRateLimiter({
  interval: 60_000,
  maxRequests: 5,
  keyPrefix: 'strict',
});

// ──────────────────────────────────────────────
// Helper utilities
// ──────────────────────────────────────────────

/** Extract client IP from request headers */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return '127.0.0.1';
}

/** 
 * Get a rate limit key that combines IP and UserId if available.
 * Helps prevent both IP-based brute force and user-based credential stuffing.
 */
export function getIdentifyKey(request: Request, userId?: string): string {
  const ip = getClientIp(request);
  return userId ? `${ip}:${userId}` : ip;
}


/** Apply rate limiting and return 429 Response if exceeded */
export async function checkRateLimit(
  request: Request,
  limiter: RateLimiter,
  options: {
    userId?: string;
    type?: SecurityLogType;
  } = {}
): Promise<Response | { allowed: true; remaining: number; limit: number }> {
  const ip = getClientIp(request);
  const key = options.userId ? `${ip}:${options.userId}` : ip;
  const result = await limiter.check(key);

  if (!result.allowed) {
    // Log security event for rate limit trigger
    try {
      await prisma.securityLog.create({
        data: {
          type: options.type || SecurityLogType.SUSPICIOUS_ACTIVITY,
          userId: options.userId || null,
          ip: ip,
          userAgent: request.headers.get('user-agent')?.slice(0, 255) || null,
          metadata: {
            path: new URL(request.url).pathname,
            limit: result.limit,
            reset: result.resetAt,
          } as any
        }
      });
    } catch (logError) {
      console.error('Failed to log security event:', logError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'rateLimit.exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: result.retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(result.retryAfter || 60),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'X-Frame-Options': 'DENY',
        },
      }
    );
  }

  return { allowed: true, remaining: result.remaining, limit: result.limit };
}

/**
 * Log a generic security event to the database
 */
export async function logSecurityEvent(data: {
  type: SecurityLogType;
  request: Request;
  userId?: string;
  details?: any;
}) {
  try {
    const ip = getClientIp(data.request);
    await prisma.securityLog.create({
      data: {
        type: data.type,
        userId: data.userId || null,
        ip: ip,
        userAgent: data.request.headers.get('user-agent')?.slice(0, 255) || null,
        metadata: {
          path: new URL(data.request.url).pathname,
          ...data.details,
        } as any
      }
    });
  } catch (error) {
    console.error('Security Logging Error:', error);
  }
}
