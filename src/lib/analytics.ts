/**
 * src/lib/analytics.ts
 *
 * Client-side Google Analytics (GA4) / Google Tag Manager (GTM) event tracker.
 * Safely calls the window.gtag function if it is defined.
 */

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, any>) => void;
  }
}

export type MarketplaceEvent =
  | 'user_signup'
  | 'user_login'
  | 'profile_completed'
  | 'company_signup'
  | 'company_profile_completed'
  | 'company_verified'
  | 'request_created'
  | 'offer_sent'
  | 'request_completed'
  | 'company_contacted'
  | 'company_profile_viewed'
  | 'contact_clicked'
  | 'company_claimed'
  | 'verification_submitted';

/**
 * Send a custom event to Google Analytics
 */
export function trackEvent(event: MarketplaceEvent, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', event, {
        ...params,
        timestamp: new Date().toISOString(),
      });
      console.log(`[Analytics] Tracked Event: ${event}`, params);
    } catch (e) {
      console.error('[Analytics] Failed to log event:', e);
    }
  } else {
    // In development mode or if GA is not loaded, just log it to console
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics (DEV)] Event "${event}" triggered with data:`, params);
    }
  }
}
