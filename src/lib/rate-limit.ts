/**
 * In-memory rate limiter with sliding window.
 * For production with multiple instances, replace with Redis-backed implementation.
 *
 * Usage:
 *   const limiter = createRateLimiter({ interval: 60_000, maxRequests: 20 });
 *   const result = limiter.check(identifier);
 *   if (!result.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
 */

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimiterOptions {
  /** Time window in milliseconds */
  interval: number;
  /** Maximum requests per window */
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

// Periodic cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  stores.forEach((store) => {
    store.forEach((entry, key) => {
      entry.timestamps = entry.timestamps.filter((t: number) => now - t < 600_000);
      if (entry.timestamps.length === 0) {
        store.delete(key);
      }
    });
  });
}, 300_000);

export function createRateLimiter(options: RateLimiterOptions) {
  const storeId = `${options.interval}-${options.maxRequests}`;
  if (!stores.has(storeId)) {
    stores.set(storeId, new Map());
  }
  const store = stores.get(storeId)!;

  return {
    check(identifier: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(identifier) || { timestamps: [] };

      // Remove timestamps outside of the window
      entry.timestamps = entry.timestamps.filter(t => now - t < options.interval);

      if (entry.timestamps.length >= options.maxRequests) {
        const oldestInWindow = entry.timestamps[0];
        const retryAfter = Math.ceil((oldestInWindow + options.interval - now) / 1000);
        store.set(identifier, entry);
        return {
          allowed: false,
          remaining: 0,
          retryAfter,
        };
      }

      entry.timestamps.push(now);
      store.set(identifier, entry);

      return {
        allowed: true,
        remaining: options.maxRequests - entry.timestamps.length,
      };
    },

    reset(identifier: string) {
      store.delete(identifier);
    },
  };
}

// Pre-configured limiters for different endpoints
/** General API rate limit: 60 requests per minute */
export const apiLimiter = createRateLimiter({ interval: 60_000, maxRequests: 60 });

/** Auth endpoints: 10 requests per minute (login, register, password reset) */
export const authLimiter = createRateLimiter({ interval: 60_000, maxRequests: 10 });

/** Strict rate limit: 5 requests per minute (sensitive operations) */
export const strictLimiter = createRateLimiter({ interval: 60_000, maxRequests: 5 });

/** Helper to get client IP from request */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return '127.0.0.1';
}

/** Apply rate limiting and return 429 response if exceeded */
export function checkRateLimit(
  request: Request,
  limiter = apiLimiter,
  keyPrefix = ''
): { allowed: true } | Response {
  const ip = getClientIp(request);
  const key = keyPrefix ? `${keyPrefix}:${ip}` : ip;
  const result = limiter.check(key);

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        retryAfter: result.retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(result.retryAfter || 60),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  return { allowed: true };
}
