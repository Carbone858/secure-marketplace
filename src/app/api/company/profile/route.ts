import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { authenticateRequest } from '@/lib/auth-middleware';

/**
 * GET /api/company/profile
 * Get full company profile for the logged-in company user
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await authenticateRequest(request);
        if (auth instanceof NextResponse) return auth;
        const { user } = auth;

        if (user.role !== 'COMPANY') {
            return NextResponse.json({ error: 'Only companies can access this endpoint' }, { status: 403 });
        }

        const company = await prisma.company.findUnique({
            where: { userId: user.id },
            include: {
                services: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
                socialLinks: true,
                workingHours: true,
                country: true,
                city: true,
            },
        });

        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        return NextResponse.json({ company });
    } catch (error) {
        console.error('Get company profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * PUT /api/company/profile
 * Update company profile (basic info + categories stored in skills[])
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
        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        const body = await request.json();
        const {
            name,
            description,
            phone,
            website,
            address,
            email,
            categoryIds, // stored in skills[]
            socialLinks,
        } = body;

        // Update company basic info + categories (skills)
        const updatedCompany = await prisma.company.update({
            where: { id: company.id },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(phone !== undefined && { phone }),
                ...(website !== undefined && { website }),
                ...(address !== undefined && { address }),
                ...(email !== undefined && { email }),
                ...(categoryIds !== undefined && { skills: categoryIds }), // reuse skills[] for categoryIds
            },
        });

        // Update social links if provided
        if (socialLinks !== undefined) {
            await prisma.companySocialLinks.upsert({
                where: { companyId: company.id },
                update: socialLinks,
                create: { companyId: company.id, ...socialLinks },
            });
        }

        return NextResponse.json({ success: true, company: updatedCompany });
    } catch (error) {
        console.error('Update company profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
