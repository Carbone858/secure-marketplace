/**
 * Utility to extract client IP from request headers.
 * Safe for use in Next.js Middleware (Edge Runtime).
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    const realIp = request.headers.get('x-real-ip');
    if (realIp) return realIp;
    return '127.0.0.1';
}
