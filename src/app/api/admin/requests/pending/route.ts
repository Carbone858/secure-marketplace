export const dynamic = 'force-dynamic';
/**
 * GET /api/admin/requests/pending
 * Returns count of PENDING (unapproved) service requests.
 * Admin only. Used for sidebar badge.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function GET() {
    try {
        const count = await prisma.serviceRequest.count({
            where: { status: 'PENDING', isActive: true },
        });
        return NextResponse.json({ count });
    } catch {
        return NextResponse.json({ count: 0 });
    }
}

