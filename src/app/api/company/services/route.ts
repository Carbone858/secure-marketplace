import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { authenticateRequest } from '@/lib/auth-middleware';

/**
 * GET /api/company/services
 * Get all services for the logged-in company
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await authenticateRequest(request);
        if (auth instanceof NextResponse) return auth;
        const { user } = auth;

        if (user.role !== 'COMPANY') {
            return NextResponse.json({ error: 'Only companies can access this endpoint' }, { status: 403 });
        }

        const company = await prisma.company.findUnique({ where: { userId: user.id } });
        if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

        const services = await prisma.companyService.findMany({
            where: { companyId: company.id, isActive: true },
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json({ services });
    } catch (error) {
        console.error('Get services error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST /api/company/services
 * Add a new service
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await authenticateRequest(request);
        if (auth instanceof NextResponse) return auth;
        const { user } = auth;

        if (user.role !== 'COMPANY') {
            return NextResponse.json({ error: 'Only companies can access this endpoint' }, { status: 403 });
        }

        const company = await prisma.company.findUnique({ where: { userId: user.id } });
        if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

        const { name, description, priceFrom, priceTo, tags } = await request.json();

        if (!name?.trim()) {
            return NextResponse.json({ error: 'Service name is required' }, { status: 400 });
        }

        const service = await prisma.companyService.create({
            data: {
                companyId: company.id,
                name: name.trim(),
                description: description?.trim() || null,
                priceFrom: priceFrom ? parseFloat(priceFrom) : null,
                priceTo: priceTo ? parseFloat(priceTo) : null,
                tags: tags || [],
            },
        });

        return NextResponse.json({ success: true, service }, { status: 201 });
    } catch (error) {
        console.error('Create service error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * PUT /api/company/services
 * Update a service (id in body)
 */
export async function PUT(request: NextRequest) {
    try {
        const auth = await authenticateRequest(request);
        if (auth instanceof NextResponse) return auth;
        const { user } = auth;

        if (user.role !== 'COMPANY') {
            return NextResponse.json({ error: 'Only companies can access this endpoint' }, { status: 403 });
        }

        const company = await prisma.company.findUnique({ where: { userId: user.id } });
        if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

        const { id, name, description, priceFrom, priceTo, tags } = await request.json();

        if (!id) return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });

        // Verify ownership
        const existing = await prisma.companyService.findFirst({
            where: { id, companyId: company.id },
        });
        if (!existing) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

        const service = await prisma.companyService.update({
            where: { id },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(description !== undefined && { description: description?.trim() || null }),
                ...(priceFrom !== undefined && { priceFrom: priceFrom ? parseFloat(priceFrom) : null }),
                ...(priceTo !== undefined && { priceTo: priceTo ? parseFloat(priceTo) : null }),
                ...(tags !== undefined && { tags }),
            },
        });

        return NextResponse.json({ success: true, service });
    } catch (error) {
        console.error('Update service error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE /api/company/services?id=...
 * Soft-delete a service
 */
export async function DELETE(request: NextRequest) {
    try {
        const auth = await authenticateRequest(request);
        if (auth instanceof NextResponse) return auth;
        const { user } = auth;

        if (user.role !== 'COMPANY') {
            return NextResponse.json({ error: 'Only companies can access this endpoint' }, { status: 403 });
        }

        const company = await prisma.company.findUnique({ where: { userId: user.id } });
        if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

        const id = new URL(request.url).searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });

        // Verify ownership
        const existing = await prisma.companyService.findFirst({
            where: { id, companyId: company.id },
        });
        if (!existing) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

        await prisma.companyService.update({
            where: { id },
            data: { isActive: false },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete service error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
