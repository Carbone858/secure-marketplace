/**
 * Redis Client Singleton
 *
 * Uses ioredis for production-grade Redis connectivity.
 * Falls back gracefully when REDIS_URL is not configured.
 *
 * Environment variables:
 *   REDIS_URL  — Full Redis connection string (e.g. redis://localhost:6379)
 */

import Redis from 'ioredis';

let redis: Redis | null = null;

/**
 * Get the shared Redis client instance.
 * Returns null if REDIS_URL is not configured (graceful fallback).
 */
export function getRedisClient(): Redis | null {
  if (redis) return redis;

  const url = process.env.REDIS_URL;
  if (!url) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Redis] REDIS_URL not set — using in-memory rate limiting');
    }
    return null;
  }

  try {
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null; // stop retrying after 5 attempts
        return Math.min(times * 200, 2000);
      },
      enableReadyCheck: true,
      connectTimeout: 5000,
      lazyConnect: true,
    });

    redis.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message);
    });

    redis.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });

    // Eagerly connect so errors surface early
    redis.connect().catch((err) => {
      console.error('[Redis] Initial connect failed:', err.message);
      redis = null;
    });

    return redis;
  } catch (err) {
    console.error('[Redis] Failed to create client:', err);
    return null;
  }
}

/**
 * Disconnect Redis (for graceful shutdown).
 */
export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
