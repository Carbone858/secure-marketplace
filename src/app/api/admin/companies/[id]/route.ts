export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, requirePermission } from '@/lib/auth-middleware';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const forbidden = requirePermission(auth.user, 'manage_companies');
    if (forbidden) return forbidden;

    const company = await prisma.company.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        country: true,
        city: true,
        documents: true,
        workingHours: true,
        socialLinks: true,
        _count: {
          select: {
            offers: true,
            projects: true,
            reviews: true,
            services: true,
          }
        }
      }
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const recentOffers = await prisma.offer.findMany({
      where: { companyId: params.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return NextResponse.json({ company, recentOffers });
  } catch (error) {
    console.error('Company details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
