/**
 * src/lib/monitoring/withErrorMonitoring.ts
 *
 * Higher-order function that wraps Next.js API route handlers.
 * Automatically catches unhandled exceptions, logs them to HealthLog,
 * and returns a clean 500 JSON response.
 *
 * Usage:
 *   export const PUT = withErrorMonitoring(async (req, ctx) => { ... }, 'REQUESTS', 'requests-update');
 */

import { NextRequest, NextResponse } from 'next/server';
import { logApiError } from './apiErrorLogger';

type RouteHandler = (req: NextRequest, ctx: any) => Promise<NextResponse> | NextResponse;

/**
 * Wrap a Next.js App Router route handler with automatic error monitoring.
 *
 * @param handler     The original route handler function.
 * @param category    HealthCategory string (AUTH | API | REQUESTS | MESSAGING | UPLOADS | SECURITY | CACHE | DATABASE)
 * @param serviceName Short human-readable name for the service (e.g. "requests-update")
 */
export function withErrorMonitoring(
    handler: RouteHandler,
    category: string,
    serviceName: string
): RouteHandler {
    return async function wrappedHandler(req: NextRequest, ctx: any): Promise<NextResponse> {
        const startMs = Date.now();
        try {
            const response = await handler(req, ctx);

            // Log slow responses (> 5s) as warnings
            const latencyMs = Date.now() - startMs;
            if (latencyMs > 5000) {
                console.warn(`[Monitor] Slow response on ${serviceName}: ${latencyMs}ms`);
                // Fire-and-forget warning log — don't await to avoid slowing the response
                logApiError(new Error(`Slow response: ${latencyMs}ms`), {
                    service: serviceName,
                    category,
                    urlPath: req.nextUrl?.pathname,
                    method: req.method,
                    details: `Response time exceeded 5s threshold`,
                }).catch(() => { });
            }

            return response;
        } catch (error: any) {
            const latencyMs = Date.now() - startMs;
            console.error(`[Monitor] Unhandled error in ${serviceName}:`, error?.message);

            // Log to HealthLog asynchronously — don't await to keep the 500 response fast
            logApiError(error, {
                service: serviceName,
                category,
                urlPath: req.nextUrl?.pathname,
                method: req.method,
                details: `Unhandled exception. Latency before crash: ${latencyMs}ms`,
            }).catch(() => { });

            return NextResponse.json(
                {
                    success: false,
                    error: 'server.error',
                    message: 'An unexpected error occurred. Please try again later.',
                },
                { status: 500 }
            );
        }
    };
}
