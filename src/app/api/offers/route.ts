import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';

// GET /api/offers - Fetch offers for the authenticated company
export async function GET(request: NextRequest) {
    try {
        const auth = await authenticateRequest(request);
        if (auth instanceof NextResponse) return auth;

        const { user } = auth;

        if (user.role !== 'COMPANY') {
            return NextResponse.json(
                { error: 'Only companies can access this endpoint' },
                { status: 403 }
            );
        }

        const company = await prisma.company.findUnique({
            where: { userId: user.id },
        });

        if (!company) {
            return NextResponse.json(
                { error: 'Company profile not found' },
                { status: 404 }
            );
        }

        const { searchParams } = new URL(request.url);
        const statusFilter = searchParams.get('status');

        const whereClause: any = {
            companyId: company.id,
        };

        if (statusFilter && ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED'].includes(statusFilter)) {
            whereClause.status = statusFilter;
        }

        const rawOffers = await prisma.offer.findMany({
            where: whereClause,
            include: {
                request: {
                    select: {
                        title: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Map DB fields 'price' and 'estimatedDays' to 'amount' and 'duration' for the frontend UI
        const offers = rawOffers.map((offer) => ({
            ...offer,
            amount: offer.price,
            duration: offer.estimatedDays,
        }));

        return NextResponse.json({ offers });

    } catch (error) {
        console.error('Failed to fetch company offers:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
