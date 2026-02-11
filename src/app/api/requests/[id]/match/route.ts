import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';

// POST /api/requests/[id]/match - Find matching companies for a request
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;
    const { id } = params;

    // Get the request
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        category: true,
        country: true,
        city: true,
      },
    });

    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (serviceRequest.userId !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Find matching companies based on multiple criteria
    const matchingCompanies = await prisma.company.findMany({
      where: {
        verificationStatus: 'VERIFIED',
        isActive: true,
        OR: [
          // Match by category
          {
            services: {
              some: {
                OR: [
                  { name: { contains: serviceRequest.category.name, mode: 'insensitive' } },
                  { description: { contains: serviceRequest.category.name, mode: 'insensitive' } },
                ],
              },
            },
          },
          // Match by location
          {
            countryId: serviceRequest.countryId,
          },
          {
            cityId: serviceRequest.cityId,
          },
          // Match by service tags
          {
            services: {
              some: {
                tags: {
                  hasSome: serviceRequest.tags,
                },
              },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        country: true,
        city: true,
        services: true,
        reviews: {
          select: {
            rating: true,
          },
        },
        projects: {
          where: { status: 'COMPLETED' },
          select: { id: true },
        },
      },
      take: 20,
    });

    // Calculate match score for each company
    const scoredCompanies = matchingCompanies.map((company) => {
      let score = 0;
      const reasons: string[] = [];

      // Category match (highest weight)
      const categoryMatch = company.services.some(
        (s) =>
          s.name.toLowerCase().includes(serviceRequest.category.name.toLowerCase()) ||
          s.description?.toLowerCase().includes(serviceRequest.category.name.toLowerCase())
      );
      if (categoryMatch) {
        score += 40;
        reasons.push('Category match');
      }

      // Location match
      if (company.cityId === serviceRequest.cityId) {
        score += 30;
        reasons.push('Same city');
      } else if (company.countryId === serviceRequest.countryId) {
        score += 20;
        reasons.push('Same country');
      }

      // Tag match
      const tagMatches = company.services.flatMap((s) => s.tags).filter((tag) =>
        serviceRequest.tags.includes(tag)
      ).length;
      if (tagMatches > 0) {
        score += Math.min(tagMatches * 5, 15);
        reasons.push(`${tagMatches} tag matches`);
      }

      // Rating bonus
      const avgRating =
        company.reviews.length > 0
          ? company.reviews.reduce((sum, r) => sum + r.rating, 0) / company.reviews.length
          : 0;
      if (avgRating >= 4.5) {
        score += 10;
        reasons.push('Top rated');
      } else if (avgRating >= 4.0) {
        score += 5;
        reasons.push('Highly rated');
      }

      // Experience bonus
      if (company.projects.length >= 10) {
        score += 5;
        reasons.push('Experienced');
      }

      return {
        ...company,
        matchScore: score,
        matchReasons: reasons,
        averageRating: avgRating,
      };
    });

    // Sort by match score
    scoredCompanies.sort((a, b) => b.matchScore - a.matchScore);

    // Update request status to MATCHING
    await prisma.serviceRequest.update({
      where: { id },
      data: { status: 'MATCHING' },
    });

    return NextResponse.json({
      matches: scoredCompanies.slice(0, 10),
      totalMatches: scoredCompanies.length,
    });
  } catch (error) {
    console.error('Match request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
