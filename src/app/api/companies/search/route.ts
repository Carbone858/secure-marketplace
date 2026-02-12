import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isYellowPagesFeaturedActive } from '@/lib/feature-flags';

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
    const locale = searchParams.get('locale') || 'en';
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
      // Find companies associated with this category through their offers or projects
      if (!where.AND) where.AND = [];
      where.AND.push({
        OR: [
          { offers: { some: { request: { categoryId } } } },
          { projects: { some: { request: { categoryId } } } },
        ],
      });
    }

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'projects':
        orderBy = { reviewCount: 'desc' };
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
          projects: {
            where: { status: 'COMPLETED' },
            select: { id: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.company.count({ where }),
    ]);

    // Calculate average rating for each company
    const companiesWithRating = companies.map((company) => ({
      ...company,
      averageRating: Math.round(company.rating * 10) / 10,
      reviewCount: company.reviewCount,
      completedProjectsCount: company.projects.length,
      country: company.country
        ? { ...company.country, name: locale === 'ar' ? company.country.nameAr : company.country.nameEn }
        : null,
      city: company.city
        ? { ...company.city, name: locale === 'ar' ? company.city.nameAr : company.city.nameEn }
        : null,
    }));

    // Phase 2: If Yellow Pages featured is active, prioritize featured companies
    const yellowPagesActive = await isYellowPagesFeaturedActive();

    // Filter by minimum rating if specified
    let filteredCompanies = companiesWithRating;
    if (minRating) {
      filteredCompanies = companiesWithRating.filter(
        (c) => c.averageRating >= parseFloat(minRating)
      );
    }

    // Phase 2: Sort featured companies to top when feature is active
    if (yellowPagesActive) {
      filteredCompanies.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
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
