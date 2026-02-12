/**
 * Server-side logger that only outputs in development
 * or outputs sanitized info in production
 */

const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  error(context: string, error: unknown) {
    if (isDev) {
      console.error(`[${context}]`, error);
    } else {
      // In production, log context but not full error details
      console.error(`[${context}] An error occurred`);
    }
  },
  warn(context: string, message: string) {
    console.warn(`[${context}] ${message}`);
  },
  info(context: string, message: string) {
    if (isDev) {
      console.log(`[${context}] ${message}`);
    }
  },
  /** Log security-relevant events even in production */
  security(event: string, details: Record<string, unknown>) {
    console.log(JSON.stringify({
      type: 'SECURITY',
      event,
      timestamp: new Date().toISOString(),
      ...details,
    }));
  },
};
