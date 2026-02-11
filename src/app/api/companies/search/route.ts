import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/companies/search - Search and filter companies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const countryId = searchParams.get('countryId');
    const cityId = searchParams.get('cityId');
    const categoryId = searchParams.get('categoryId');
    const minRating = searchParams.get('minRating');
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (verifiedOnly) {
      where.verificationStatus = 'VERIFIED';
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { services: { some: { name: { contains: query, mode: 'insensitive' } } } },
      ];
    }

    if (countryId) {
      where.countryId = countryId;
    }

    if (cityId) {
      where.cityId = cityId;
    }

    if (categoryId) {
      where.services = {
        some: {
          categoryId: categoryId,
        },
      };
    }

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { reviews: { _count: 'desc' } };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'projects':
        orderBy = { completedProjects: { _count: 'desc' } };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Fetch companies
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          country: true,
          city: true,
          services: {
            take: 3,
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              completedProjects: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.company.count({ where }),
    ]);

    // Calculate average rating for each company
    const companiesWithRating = companies.map((company) => {
      const avgRating =
        company.reviews.length > 0
          ? company.reviews.reduce((sum, r) => sum + r.rating, 0) / company.reviews.length
          : 0;

      return {
        ...company,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: company._count.reviews,
        completedProjectsCount: company._count.completedProjects,
      };
    });

    // Filter by minimum rating if specified
    let filteredCompanies = companiesWithRating;
    if (minRating) {
      filteredCompanies = companiesWithRating.filter(
        (c) => c.averageRating >= parseFloat(minRating)
      );
    }

    return NextResponse.json({
      companies: filteredCompanies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search companies error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
