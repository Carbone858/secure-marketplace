/**
 * /api/admin/health/run
 * Manually trigger a health check cycle from the admin dashboard.
 */
import { NextResponse } from 'next/server';
import { runAllChecks, persistResults } from '@/lib/monitoring/checker';

export async function POST() {
    try {
        const results = await runAllChecks();
        await persistResults(results);

        const summary = {
            total: results.length,
            ok: results.filter((r) => r.status === 'OK').length,
            warnings: results.filter((r) => r.status === 'WARNING').length,
            critical: results.filter((r) => r.status === 'CRITICAL').length,
            results,
        };

        return NextResponse.json(summary);
    } catch (err: any) {
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
