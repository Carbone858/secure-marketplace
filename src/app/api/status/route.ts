/**
 * GET /api/status
 * Public status API — returns current system status with no sensitive data.
 * Safe to call without authentication.
 */
import { NextResponse } from 'next/server';
import { PrismaClient, HealthCategory } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES: HealthCategory[] = [
    'AUTH', 'DATABASE', 'API', 'REQUESTS', 'MESSAGING', 'UPLOADS', 'SECURITY', 'CACHE',
];

export async function GET() {
    try {
        const since72h = new Date(Date.now() - 72 * 60 * 60 * 1000);
        const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // ─ Per-category latest status ────────────────────────────────────────────
        const categoryStatus: Record<string, {
            status: string;
            latencyMs: number | null;
            lastChecked: string | null;
        }> = {};

        for (const cat of CATEGORIES) {
            const latest = await prisma.healthLog.findFirst({
                where: { category: cat },
                orderBy: { testedAt: 'desc' },
                select: { status: true, latencyMs: true, testedAt: true },
            });
            categoryStatus[cat] = {
                status: latest?.status ?? 'OK',
                latencyMs: latest?.latencyMs ?? null,
                lastChecked: latest?.testedAt?.toISOString() ?? null,
            };
        }

        // ─ Overall status ─────────────────────────────────────────────────────────
        const statuses = Object.values(categoryStatus).map(c => c.status);
        const overallStatus =
            statuses.includes('CRITICAL') ? 'DOWN' :
                statuses.includes('WARNING') ? 'DEGRADED' :
                    'OPERATIONAL';

        // ─ Recent incidents (last 72 hours, CRITICAL only) ────────────────────────
        const incidents = await prisma.healthLog.findMany({
            where: {
                testedAt: { gte: since72h },
                status: 'CRITICAL',
            },
            orderBy: { testedAt: 'desc' },
            take: 20,
            select: {
                id: true,
                service: true,
                category: true,
                errorMessage: true,
                testedAt: true,
            },
        });

        // ─ Uptime last 24h ────────────────────────────────────────────────────────
        const total24h = await prisma.healthLog.count({ where: { testedAt: { gte: since24h } } });
        const failed24h = await prisma.healthLog.count({
            where: { testedAt: { gte: since24h }, status: { in: ['CRITICAL', 'WARNING'] } },
        });
        const uptime24h = total24h > 0
            ? Math.round(((total24h - failed24h) / total24h) * 10000) / 100
            : 100;

        // ─ Response (clean, no sensitive info) ───────────────────────────────────
        return NextResponse.json({
            status: overallStatus,
            uptime24h,
            checkedAt: new Date().toISOString(),
            components: categoryStatus,
            incidents: incidents.map(i => ({
                id: i.id,
                service: i.service,
                category: i.category,
                message: i.errorMessage,
                time: i.testedAt.toISOString(),
            })),
        }, {
            headers: {
                'Cache-Control': 'public, max-age=60', // cache 1 minute
            },
        });
    } catch (err: any) {
        return NextResponse.json({ error: 'Status unavailable' }, { status: 500 });
    }
}
