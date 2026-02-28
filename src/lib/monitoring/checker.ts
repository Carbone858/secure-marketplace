/**
 * src/lib/monitoring/checker.ts
 * Core health monitoring engine.
 * Runs checks against API endpoints, database, and simulates user workflows.
 */

import { PrismaClient, HealthCategory, HealthStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CheckResult {
    service: string;
    category: HealthCategory;
    status: HealthStatus;
    latencyMs?: number;
    statusCode?: number;
    errorMessage?: string;
    url?: string;
    details?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ── Helper ────────────────────────────────────────────────────────────────────

async function timedFetch(
    url: string,
    options?: RequestInit
): Promise<{ status: number; latencyMs: number; ok: boolean; text?: string }> {
    const start = Date.now();
    try {
        const res = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
        const latencyMs = Date.now() - start;
        let text: string | undefined;
        try { text = await res.text(); } catch { /* ignore */ }
        return { status: res.status, latencyMs, ok: res.ok, text };
    } catch (err: any) {
        return { status: 0, latencyMs: Date.now() - start, ok: false, text: err?.message };
    }
}

// ── Database Check ────────────────────────────────────────────────────────────

export async function checkDatabase(): Promise<CheckResult> {
    const start = Date.now();
    try {
        await prisma.$queryRaw`SELECT 1`;
        return {
            service: 'db-connection',
            category: 'DATABASE',
            status: 'OK',
            latencyMs: Date.now() - start,
        };
    } catch (err: any) {
        return {
            service: 'db-connection',
            category: 'DATABASE',
            status: 'CRITICAL',
            latencyMs: Date.now() - start,
            errorMessage: err?.message || 'Database unreachable',
        };
    }
}

// ── API Endpoint Checks ───────────────────────────────────────────────────────

const API_ENDPOINTS: Array<{ name: string; path: string; category: HealthCategory; expectStatus?: number[] }> = [
    { name: 'api-categories', path: '/api/categories', category: 'API', expectStatus: [200] },
    { name: 'api-requests-list', path: '/api/requests', category: 'REQUESTS', expectStatus: [200, 401] },
    { name: 'api-auth-session', path: '/api/auth/session', category: 'AUTH', expectStatus: [200] },
    { name: 'api-upload-health', path: '/api/upload', category: 'UPLOADS', expectStatus: [200, 401, 405] },
    { name: 'api-notifications', path: '/api/notifications', category: 'MESSAGING', expectStatus: [200, 401] },
];

export async function checkApiEndpoints(): Promise<CheckResult[]> {
    const results: CheckResult[] = [];

    for (const ep of API_ENDPOINTS) {
        const url = `${BASE_URL}${ep.path}`;
        const { status, latencyMs, text } = await timedFetch(url);
        const expected = ep.expectStatus ?? [200];
        const ok = expected.includes(status);

        results.push({
            service: ep.name,
            category: ep.category,
            status: ok ? (latencyMs > 2000 ? 'WARNING' : 'OK') : 'CRITICAL',
            latencyMs,
            statusCode: status,
            url,
            errorMessage: ok ? undefined : `Unexpected status ${status}`,
            details: !ok ? text?.slice(0, 500) : undefined,
        });
    }

    return results;
}

// ── Auth Workflow Simulation ──────────────────────────────────────────────────

export async function checkAuthWorkflow(): Promise<CheckResult> {
    const url = `${BASE_URL}/api/auth/login`;
    const { status, latencyMs } = await timedFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'healthcheck@internal.test', password: 'invalid_probe' }),
    });

    // We expect 401 (wrong password) or 400 (invalid email). 200 would be a security bug.
    const ok = [400, 401, 403, 422, 429].includes(status);
    return {
        service: 'auth-login-workflow',
        category: 'AUTH',
        status: ok ? 'OK' : (status === 200 ? 'CRITICAL' : 'WARNING'),
        latencyMs,
        statusCode: status,
        url,
        errorMessage: !ok && status !== 200 ? `Auth endpoint returned unexpected status ${status}` : undefined,
    };
}

// ── Request Posting Simulation ────────────────────────────────────────────────

export async function checkRequestPostWorkflow(): Promise<CheckResult> {
    const url = `${BASE_URL}/api/requests`;
    const { status, latencyMs } = await timedFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '__healthcheck__', description: 'synthetic test' }),
    });
    // Should be rejected with 401 (not logged in) or 400 (validation)
    const ok = [400, 401, 403].includes(status);
    return {
        service: 'request-post-workflow',
        category: 'REQUESTS',
        status: ok ? 'OK' : 'CRITICAL',
        latencyMs,
        statusCode: status,
        url,
        errorMessage: !ok ? `Request post endpoint returned ${status}` : undefined,
    };
}

// ── Security Probes ───────────────────────────────────────────────────────────

export async function checkSecurityProbes(): Promise<CheckResult[]> {
    const results: CheckResult[] = [];

    // XSS probe – inject a script tag in a query param
    const xssUrl = `${BASE_URL}/api/requests?search=%3Cscript%3Ealert(1)%3C%2Fscript%3E`;
    const xss = await timedFetch(xssUrl);
    const xssEchoed = xss.text?.includes('<script>');
    results.push({
        service: 'security-xss-probe',
        category: 'SECURITY',
        status: xssEchoed ? 'CRITICAL' : 'OK',
        latencyMs: xss.latencyMs,
        statusCode: xss.status,
        url: xssUrl,
        errorMessage: xssEchoed ? 'XSS – raw <script> echoed back in response!' : undefined,
    });

    // SQL Injection probe
    const sqliUrl = `${BASE_URL}/api/requests?search=' OR '1'='1`;
    const sqli = await timedFetch(sqliUrl);
    const sqliVulnerable = sqli.status === 500;
    results.push({
        service: 'security-sqli-probe',
        category: 'SECURITY',
        status: sqliVulnerable ? 'CRITICAL' : 'OK',
        latencyMs: sqli.latencyMs,
        statusCode: sqli.status,
        url: sqliUrl,
        errorMessage: sqliVulnerable ? 'SQLi probe caused a 500 error – possible vulnerability!' : undefined,
    });

    // Auth bypass probe – hit an admin-only endpoint unauthenticated
    const authBypass = await timedFetch(`${BASE_URL}/api/admin/users`);
    const bypassed = authBypass.status === 200;
    results.push({
        service: 'security-auth-bypass',
        category: 'SECURITY',
        status: bypassed ? 'CRITICAL' : 'OK',
        latencyMs: authBypass.latencyMs,
        statusCode: authBypass.status,
        url: `${BASE_URL}/api/admin/users`,
        errorMessage: bypassed ? 'CRITICAL: Unauthenticated access to admin endpoint succeeded!' : undefined,
    });

    return results;
}

// ── Run All Checks ────────────────────────────────────────────────────────────

export async function runAllChecks(): Promise<CheckResult[]> {
    const [db, authWorkflow, requestWorkflow, ...apiRest] = await Promise.all([
        checkDatabase(),
        checkAuthWorkflow(),
        checkRequestPostWorkflow(),
        checkApiEndpoints(),
        checkSecurityProbes(),
    ]);

    // apiRest is actually the last two Promise.all results (api endpoints + security probes)
    const apiEndpoints = (apiRest[0] as unknown) as CheckResult[];
    const securityProbes = (apiRest[1] as unknown) as CheckResult[];

    return [db, authWorkflow, requestWorkflow, ...apiEndpoints, ...securityProbes];
}

// ── Persist Results to DB ─────────────────────────────────────────────────────

export async function persistResults(results: CheckResult[]): Promise<void> {
    for (const r of results) {
        await prisma.healthLog.create({
            data: {
                service: r.service,
                category: r.category,
                status: r.status,
                latencyMs: r.latencyMs,
                statusCode: r.statusCode,
                errorMessage: r.errorMessage,
                url: r.url,
                details: r.details,
            },
        });
    }
}

// ── Cleanup Old Logs (30 day retention) ──────────────────────────────────────

export async function cleanupOldLogs(retentionDays = 30): Promise<void> {
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    await prisma.healthLog.deleteMany({ where: { testedAt: { lt: cutoff } } });
}
