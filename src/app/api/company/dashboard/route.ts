import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';

// GET /api/company/dashboard - Get company dashboard data
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
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalOffers,
      acceptedOffers,
      pendingOffers,
      totalReviews,
      averageRating,
      recentProjects,
      recentOffers,
      membership,
    ] = await Promise.all([
      // Total projects
      prisma.project.count({
        where: { companyId: company.id },
      }),

      // Active projects
      prisma.project.count({
        where: {
          companyId: company.id,
          status: { in: ['PENDING', 'ACTIVE'] },
        },
      }),

      // Completed projects
      prisma.project.count({
        where: {
          companyId: company.id,
          status: 'COMPLETED',
        },
      }),

      // Total offers
      prisma.offer.count({
        where: { companyId: company.id },
      }),

      // Accepted offers
      prisma.offer.count({
        where: {
          companyId: company.id,
          status: 'ACCEPTED',
        },
      }),

      // Pending offers
      prisma.offer.count({
        where: {
          companyId: company.id,
          status: 'PENDING',
        },
      }),

      // Total reviews
      prisma.review.count({
        where: { companyId: company.id },
      }),

      // Average rating
      prisma.review.aggregate({
        where: { companyId: company.id },
        _avg: { rating: true },
      }),

      // Recent projects
      prisma.project.findMany({
        where: { companyId: company.id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Recent offers
      prisma.offer.findMany({
        where: { companyId: company.id },
        include: {
          request: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Active membership
      prisma.membership.findFirst({
        where: {
          companyId: company.id,
          status: 'ACTIVE',
          endDate: { gt: new Date() },
        },
        include: {
          plan: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalOffers,
        acceptedOffers,
        pendingOffers,
        totalReviews,
        averageRating: averageRating._avg.rating || 0,
      },
      recentProjects,
      recentOffers,
      membership,
      company: {
        id: company.id,
        name: company.name,
        verificationStatus: company.verificationStatus,
        logo: company.logo,
      },
    });
  } catch (error) {
    console.error('Get company dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
