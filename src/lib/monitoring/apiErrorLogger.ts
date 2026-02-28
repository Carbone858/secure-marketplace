/**
 * src/lib/monitoring/apiErrorLogger.ts
 *
 * Application Error Logger.
 * Call this from inside API route catch blocks to persist real-user-triggered
 * backend errors directly into the HealthLog table.
 *
 * RULES:
 *  - Call ONLY for unexpected errors (status 500, Prisma crashes, unhandled exceptions).
 *  - Do NOT call for expected errors: 400 validation, 401 auth, 403 permissions.
 *  - Never let a logger failure cascade to the user.
 */

import { prisma } from '@/lib/db/client';

// Map from URL path prefix → HealthCategory
const PATH_CATEGORY_MAP: Array<[RegExp, string]> = [
    [/\/api\/auth\//, 'AUTH'],
    [/\/api\/requests\//, 'REQUESTS'],
    [/\/api\/offers\//, 'API'],
    [/\/api\/projects\//, 'API'],
    [/\/api\/messages\//, 'MESSAGING'],
    [/\/api\/upload/, 'UPLOADS'],
    [/\/api\/companies?\//, 'API'],
    [/\/api\/company\//, 'API'],
    [/\/api\/admin\//, 'API'],
    [/\/api\//, 'API'],
];

function inferCategory(urlPath?: string): string {
    if (!urlPath) return 'API';
    for (const [pattern, cat] of PATH_CATEGORY_MAP) {
        if (pattern.test(urlPath)) return cat;
    }
    return 'API';
}

export interface ApiErrorContext {
    /** Name for the service (e.g. "requests-update") */
    service: string;
    /** Optional: override the inferred category */
    category?: string;
    /** URL path — used to infer category if not provided */
    urlPath?: string;
    /** HTTP method (GET, POST, PUT, etc.) */
    method?: string;
    /** Any extra detail string for admins */
    details?: string;
}

/**
 * Log a backend error to HealthLog.
 * Safe to call from any catch block — failures are swallowed.
 */
export async function logApiError(error: any, ctx: ApiErrorContext): Promise<void> {
    try {
        const category = (ctx.category ?? inferCategory(ctx.urlPath)) as any;
        const errorMessage =
            typeof error === 'string'
                ? error
                : error?.message ?? 'Unknown server error';

        const details = [
            ctx.method ? `Method: ${ctx.method}` : '',
            ctx.urlPath ? `Path: ${ctx.urlPath}` : '',
            error?.stack ? `\n--- Stack ---\n${String(error.stack).slice(0, 2000)}` : '',
            ctx.details ? `\n--- Context ---\n${ctx.details}` : '',
        ]
            .filter(Boolean)
            .join('\n');

        await (prisma as any).healthLog.create({
            data: {
                service: ctx.service,
                category,
                status: 'CRITICAL' as any,
                errorMessage: errorMessage.slice(0, 500),
                details: details.slice(0, 3000),
                source: 'user',
                testedAt: new Date(),
            },
        });
    } catch {
        // Never throw from the logger — it must be invisible to the request
    }
}

/**
 * Quick helper for Prisma FK / constraint errors specifically.
 */
export function isPrismaError(error: any): boolean {
    return Boolean(error?.code && String(error.code).startsWith('P'));
}

/**
 * Returns true for server-side unexpected errors (500-level).
 * Returns false for expected user errors (400, 401, 403).
 */
export function isSystemError(error: any): boolean {
    const code = error?.code;
    // Prisma operational errors (FK, unique, connection)
    if (typeof code === 'string' && code.startsWith('P')) return true;
    // Untyped thrown errors
    if (error instanceof Error) return true;
    return false;
}
