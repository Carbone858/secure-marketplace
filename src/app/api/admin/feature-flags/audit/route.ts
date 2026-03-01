/**
 * GET /api/admin/feature-flags/audit
 *
 * Returns audit log of flag toggle actions.
 * Supports filtering by flagKey, adminId, date range.
 * Admin only.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
    try {
        const auth = await authenticateRequest(request);
        if (auth instanceof NextResponse) return auth;
        if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const flagKey = searchParams.get('flagKey');
        const adminId = searchParams.get('adminId');
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

        const where: any = {};
        if (flagKey) where.flagKey = flagKey;
        if (adminId) where.adminId = adminId;
        if (from || to) {
            where.createdAt = {};
            if (from) where.createdAt.gte = new Date(from);
            if (to) where.createdAt.lte = new Date(to);
        }

        const logs = await (prisma as any).flagAuditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        return NextResponse.json({ logs, total: logs.length });
    } catch (error) {
        console.error('[FLAG AUDIT GET]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
