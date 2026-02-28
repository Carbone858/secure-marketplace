/**
 * GET /api/admin/health/sla
 * Returns all stored monthly SLA reports + current month live data.
 *
 * POST /api/admin/health/sla
 * Generates (or regenerates) the SLA report for a given month.
 * Body: { year: number, month: number }
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSlaReports, upsertSlaReport, getCurrentMonthSla } from '@/lib/monitoring/sla';

export async function GET() {
    try {
        const [reports, current] = await Promise.all([
            getSlaReports(24),
            getCurrentMonthSla(),
        ]);

        return NextResponse.json({ reports, currentMonth: current });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const now = new Date();
        const year = Number(body.year ?? now.getFullYear());
        const month = Number(body.month ?? now.getMonth() + 1);

        if (month < 1 || month > 12 || year < 2020 || year > 2100) {
            return NextResponse.json({ error: 'Invalid year/month' }, { status: 400 });
        }

        const report = await upsertSlaReport(year, month);
        return NextResponse.json({ report });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
