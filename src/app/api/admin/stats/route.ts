import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';

// GET /api/admin/stats - Get admin dashboard stats
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      totalCompanies,
      totalRequests,
      totalProjects,
      pendingVerifications,
      recentUsers,
      recentRequests,
      requestsByStatus,
      companiesByStatus,
    ] = await Promise.all([
      // Total users
      prisma.user.count({
        where: { role: 'USER' },
      }),

      // Total companies
      prisma.company.count(),

      // Total requests
      prisma.serviceRequest.count(),

      // Total projects
      prisma.project.count(),

      // Pending verifications
      prisma.company.count({
        where: { verificationStatus: 'PENDING' },
      }),

      // Recent users
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),

      // Recent requests
      prisma.serviceRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Requests by status
      prisma.serviceRequest.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),

      // Companies by status
      prisma.company.groupBy({
        by: ['verificationStatus'],
        _count: {
          verificationStatus: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalCompanies,
        totalRequests,
        totalProjects,
        pendingVerifications,
      },
      recentUsers,
      recentRequests,
      requestsByStatus,
      companiesByStatus,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
