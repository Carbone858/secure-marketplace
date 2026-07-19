export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';

// GET /api/admin/stats - Get admin dashboard stats + marketplace KPI metrics
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

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalCompanies,
      realCompanies,
      demoCompanies,
      totalRequests,
      totalProjects,
      pendingVerifications,
      recentUsers,
      recentRequests,
      requestsByStatus,
      companiesByStatus,
      // KPI: requests with at least one offer
      requestsWithOffers,
      // KPI: all active requests (for liquidity ratio)
      activeRequests,
      // KPI: completed requests (for matching rate)
      completedRequests,
      // KPI: companies that have submitted at least one offer in last 7 days
      activeProviders,
      // KPI: total verified non-demo companies (as denominator for engagement)
      verifiedCompanies,
      // KPI: first offer per request (for liquidity speed)
      firstOfferTimes,
    ] = await Promise.all([
      // Total users
      prisma.user.count({ where: { role: 'USER' } }),
      // Total companies (real + demo)
      prisma.company.count(),
      // Real (non-demo) companies
      prisma.company.count({ where: { isDemo: false } }),
      // Demo seed companies
      prisma.company.count({ where: { isDemo: true } }),
      // Total requests
      prisma.serviceRequest.count(),
      // Total projects
      prisma.project.count(),
      // Pending verifications
      prisma.company.count({ where: { verificationStatus: 'PENDING' } }),
      // Recent users
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      // Recent requests
      prisma.serviceRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          category: { select: { name: true } },
        },
      }),
      // Requests by status
      prisma.serviceRequest.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      // Companies by verification status
      prisma.company.groupBy({
        by: ['verificationStatus'],
        _count: { verificationStatus: true },
      }),
      // KPI: count of unique requestIds that have at least one offer
      prisma.offer.findMany({
        distinct: ['requestId'],
        select: { requestId: true },
      }),
      // KPI: all public/active requests
      prisma.serviceRequest.count({ where: { status: 'ACTIVE' } }),
      // KPI: completed requests
      prisma.serviceRequest.count({ where: { status: 'COMPLETED' } }),
      // KPI: companies active in last 7 days (submitted an offer)
      prisma.offer.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        distinct: ['companyId'],
        select: { companyId: true },
      }),
      // KPI: total real verified companies
      prisma.company.count({ where: { isDemo: false, verificationStatus: 'VERIFIED' } }),
      // KPI: first offer timestamps grouped by request (raw query for median)
      prisma.$queryRaw<{ request_id: string; first_offer_minutes: number }[]>`
        SELECT 
          o."requestId" AS request_id,
          EXTRACT(EPOCH FROM (MIN(o."createdAt") - r."createdAt")) / 60 AS first_offer_minutes
        FROM "Offer" o
        JOIN "ServiceRequest" r ON o."requestId" = r.id
        GROUP BY o."requestId", r."createdAt"
      `,
    ]);

    // ── Calculate KPI metrics ──────────────────────────────────────────────
    // 1. Active Liquidity Ratio: % of active requests with ≥1 offer
    const activeLiquidityRatio = activeRequests > 0
      ? Math.round((requestsWithOffers.length / Math.max(activeRequests, requestsWithOffers.length)) * 100)
      : 0;

    // 2. Liquidity Speed: Median minutes from request approval to first offer
    let liquiditySpeedMinutes: number | null = null;
    if (firstOfferTimes.length > 0) {
      const sorted = [...firstOfferTimes]
        .map(r => Number(r.first_offer_minutes))
        .filter(n => n >= 0)
        .sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      liquiditySpeedMinutes = sorted.length % 2 !== 0
        ? Math.round(sorted[mid])
        : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }

    // 3. Supplier Engagement: % of verified companies active (bidding) in last 7 days
    const supplierEngagement = verifiedCompanies > 0
      ? Math.round((activeProviders.length / verifiedCompanies) * 100)
      : 0;

    // 4. Transaction Matching Rate: % of created requests that completed
    const matchingRate = totalRequests > 0
      ? Math.round((completedRequests / totalRequests) * 100)
      : 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        totalCompanies,
        realCompanies,
        demoCompanies,
        totalRequests,
        totalProjects,
        pendingVerifications,
      },
      recentUsers,
      recentRequests,
      requestsByStatus,
      companiesByStatus,
      // Marketplace KPI metrics
      kpi: {
        activeLiquidityRatio,       // % active requests with ≥1 offer
        liquiditySpeedMinutes,      // Median minutes to first offer (null if no data)
        supplierEngagement,         // % verified companies bidding this week
        matchingRate,               // % requests completed
        // Raw counts for context
        activeRequests,
        completedRequests,
        requestsWithOffersCount: requestsWithOffers.length,
        activeProvidersThisWeek: activeProviders.length,
        verifiedCompanies,
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


