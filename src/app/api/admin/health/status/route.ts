/**
 * /api/admin/health/status
 * Returns aggregated health stats and the latest logs for the dashboard.
 */
import { NextResponse } from 'next/server';
import { PrismaClient, HealthCategory } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // ─ Overall stats ─────────────────────────────────────────────────────────
        const totalChecks = await prisma.healthLog.count({ where: { testedAt: { gte: since24h } } });
        const failedChecks = await prisma.healthLog.count({
            where: { testedAt: { gte: since24h }, status: { in: ['CRITICAL', 'WARNING'] } },
        });
        const uptimePercent = totalChecks > 0
            ? Math.round(((totalChecks - failedChecks) / totalChecks) * 100 * 10) / 10
            : 100;

        // ─ Average latency ───────────────────────────────────────────────────────
        const latencyAgg = await prisma.healthLog.aggregate({
            where: { testedAt: { gte: since24h }, latencyMs: { not: null } },
            _avg: { latencyMs: true },
        });
        const avgLatencyMs = Math.round(latencyAgg._avg.latencyMs ?? 0);

        // ─ Per-category current status (latest result per category) ──────────────
        const categories = Object.values(HealthCategory);
        const categoryStatus: Record<string, { status: string; latencyMs: number | null }> = {};

        for (const cat of categories) {
            const latest = await prisma.healthLog.findFirst({
                where: { category: cat },
                orderBy: { testedAt: 'desc' },
                select: { status: true, latencyMs: true },
            });
            categoryStatus[cat] = {
                status: latest?.status ?? 'OK',
                latencyMs: latest?.latencyMs ?? null,
            };
        }

        // ─ Recent logs (last 50) ─────────────────────────────────────────────────
        const recentLogs = await prisma.healthLog.findMany({
            orderBy: { testedAt: 'desc' },
            take: 50,
            select: {
                id: true,
                service: true,
                category: true,
                status: true,
                latencyMs: true,
                statusCode: true,
                errorMessage: true,
                url: true,
                retryCount: true,
                testedAt: true,
            },
        });

        // ─ Latency trend chart data (last 12 hours, grouped by hour) ─────────────
        const since12h = new Date(Date.now() - 12 * 60 * 60 * 1000);
        const latencyTrend = await prisma.healthLog.groupBy({
            by: ['testedAt'],
            where: { testedAt: { gte: since12h }, latencyMs: { not: null } },
            _avg: { latencyMs: true },
            orderBy: { testedAt: 'asc' },
        });

        // ─ Error frequency chart (per category, last 24h) ────────────────────────
        const errorsByCategory = await prisma.healthLog.groupBy({
            by: ['category'],
            where: { testedAt: { gte: since24h }, status: { in: ['CRITICAL', 'WARNING'] } },
            _count: { _all: true },
        });

        return NextResponse.json({
            uptimePercent,
            totalChecks,
            failedChecks,
            avgLatencyMs,
            categoryStatus,
            recentLogs,
            latencyTrend: latencyTrend.map((t) => ({
                time: t.testedAt.toISOString(),
                avgMs: Math.round(t._avg.latencyMs ?? 0),
            })),
            errorsByCategory: errorsByCategory.map((e) => ({
                category: e.category,
                count: e._count._all,
            })),
        });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
