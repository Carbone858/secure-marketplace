import { prisma } from '@/lib/db/client';

/**
 * Feature flag keys used in the platform.
 * Phase 2 flags are wired but NOT activated.
 */
export const FEATURE_FLAG_KEYS = {
  // Phase 1 (active)
  isSmartMatchingEnabled: 'isSmartMatchingEnabled',
  isEmailVerificationRequired: 'isEmailVerificationRequired',
  isReviewModerationEnabled: 'isReviewModerationEnabled',
  isMaintenanceMode: 'isMaintenanceMode',

  // Phase 2 (wired but inactive)
  isRequestLimitEnabled: 'isRequestLimitEnabled',
  isCompanyPaidPlanActive: 'isCompanyPaidPlanActive',
  isYellowPagesFeatured: 'isYellowPagesFeatured',
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAG_KEYS;

// In-memory cache for feature flags (avoid hitting DB on every check)
let flagCache: Map<string, boolean> = new Map();
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

/**
 * Get the value of a feature flag.
 * Returns false if the flag doesn't exist.
 */
export async function getFeatureFlag(key: string): Promise<boolean> {
  const now = Date.now();

  // Refresh cache if stale
  if (now - cacheTimestamp > CACHE_TTL) {
    try {
      const flags = await prisma.featureFlag.findMany();
      flagCache = new Map(flags.map(f => [f.key, f.value]));
      cacheTimestamp = now;
    } catch (error) {
      console.error('Failed to load feature flags:', error);
      // Return cached value or false
    }
  }

  return flagCache.get(key) ?? false;
}

/**
 * Get all feature flags as a map.
 */
export async function getAllFeatureFlags(): Promise<Record<string, boolean>> {
  const now = Date.now();

  if (now - cacheTimestamp > CACHE_TTL) {
    try {
      const flags = await prisma.featureFlag.findMany();
      flagCache = new Map(flags.map(f => [f.key, f.value]));
      cacheTimestamp = now;
    } catch {
      // Return cached values
    }
  }

  return Object.fromEntries(flagCache);
}

/**
 * Check if request limits should be enforced (Phase 2).
 * When enabled, users have a maximum number of free requests per month.
 */
export async function isRequestLimitActive(): Promise<boolean> {
  return getFeatureFlag(FEATURE_FLAG_KEYS.isRequestLimitEnabled);
}

/**
 * Check if paid plans are enforced for companies (Phase 2).
 * When enabled, certain features require a paid subscription.
 */
export async function isPaidPlanActive(): Promise<boolean> {
  return getFeatureFlag(FEATURE_FLAG_KEYS.isCompanyPaidPlanActive);
}

/**
 * Check if Yellow Pages featured listings are active (Phase 2).
 * When enabled, companies can pay for featured placement.
 */
export async function isYellowPagesFeaturedActive(): Promise<boolean> {
  return getFeatureFlag(FEATURE_FLAG_KEYS.isYellowPagesFeatured);
}

/**
 * Invalidate the flag cache (e.g., after admin updates flags).
 */
export function invalidateFlagCache(): void {
  cacheTimestamp = 0;
}
