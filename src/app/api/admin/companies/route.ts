export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, requirePermission } from '@/lib/auth-middleware';
import { z } from 'zod';

const updateCompanySchema = z.object({
  verificationStatus: z.enum(['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED']).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  currentPlan: z.enum(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    // Base Access: Must have manage_companies permission
    const forbidden = requirePermission(auth.user, 'manage_companies');
    if (forbidden) return forbidden;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.verificationStatus = status;
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          country: { select: { nameEn: true, nameAr: true } },
          city: { select: { nameEn: true, nameAr: true } },
          _count: { select: { offers: true, projects: true, reviews: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.company.count({ where }),
    ]);

    return NextResponse.json({
      companies,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    // Base Access: Must have manage_companies permission
    const forbidden = requirePermission(auth.user, 'manage_companies');
    if (forbidden) return forbidden;

    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    const parsed = updateCompanySchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    const updateData: any = { ...parsed.data };
    
    // Fine-grained check: Modifying verification status requires specific manage_verifications permission
    if (parsed.data.verificationStatus) {
      const verificationForbidden = requirePermission(auth.user, 'manage_verifications');
      if (verificationForbidden) {
        return NextResponse.json({ error: 'Missing permission: manage_verifications' }, { status: 403 });
      }

      if (parsed.data.verificationStatus === 'VERIFIED') {
        updateData.verifiedAt = new Date();
        updateData.verifiedBy = auth.user.id;
      }
    }

    const company = await prisma.company.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ company });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

