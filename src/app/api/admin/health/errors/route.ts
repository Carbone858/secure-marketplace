/**
 * GET /api/admin/health/errors
 * Returns recent user-triggered errors from HealthLog (source = "user").
 * Admin only.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function GET() {
    try {
        const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const errors = await (prisma as any).healthLog.findMany({
            where: {
                source: 'user',
                testedAt: { gte: since24h },
            },
            orderBy: { testedAt: 'desc' },
            take: 50,
            select: {
                id: true,
                service: true,
                category: true,
                status: true,
                errorMessage: true,
                testedAt: true,
                details: true,
                source: true,
            },
        });

        // Count by category
        const categoryGroups: Record<string, number> = {};
        for (const e of errors) {
            categoryGroups[e.category] = (categoryGroups[e.category] || 0) + 1;
        }

        return NextResponse.json({ errors, categoryGroups, total: errors.length });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
