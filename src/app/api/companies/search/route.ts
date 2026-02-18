import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isYellowPagesFeaturedActive } from '@/lib/feature-flags';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (s: string) => UUID_REGEX.test(s);

// GET /api/companies/search - Search and filter companies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || '';
    const countryParam = searchParams.get('countryId') || searchParams.get('country');
    const cityParam = searchParams.get('cityId') || searchParams.get('city');
    const categoryParam = searchParams.get('categoryId') || searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategoryId') || searchParams.get('subcategory');
    const minRating = searchParams.get('minRating') || searchParams.get('rating');
    const verifiedOnly = (searchParams.get('verifiedOnly') === 'true') || (searchParams.get('verified') === 'true');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const locale = searchParams.get('locale') || 'en';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '24')));
    const skip = (page - 1) * limit;

    // ── Resolve category slug → UUID ─────────────────────────────────────────
    let resolvedCategoryId: string | null = null;
    if (categoryParam) {
      if (isUUID(categoryParam)) {
        resolvedCategoryId = categoryParam;
      } else {
        // Look up by slug in DB
        const cat = await prisma.category.findFirst({
          where: { slug: categoryParam, isActive: true },
          select: { id: true },
        });
        resolvedCategoryId = cat?.id ?? null;
      }
    }

    // ── Resolve subcategory slug → UUID ──────────────────────────────────────
    let resolvedSubcategoryId: string | null = null;
    if (subcategoryParam) {
      if (isUUID(subcategoryParam)) {
        resolvedSubcategoryId = subcategoryParam;
      } else {
        const sub = await prisma.category.findFirst({
          where: { slug: subcategoryParam, isActive: true },
          select: { id: true },
        });
        resolvedSubcategoryId = sub?.id ?? null;
      }
    }

    // ── Resolve country code → UUID ───────────────────────────────────────────
    let resolvedCountryId: string | null = null;
    if (countryParam) {
      if (isUUID(countryParam)) {
        resolvedCountryId = countryParam;
      } else {
        const country = await prisma.country.findFirst({
          where: { code: countryParam.toUpperCase() },
          select: { id: true },
        });
        resolvedCountryId = country?.id ?? null;
      }
    }

    // ── Resolve city slug → UUID ──────────────────────────────────────────────
    let resolvedCityId: string | null = null;
    if (cityParam) {
      if (isUUID(cityParam)) {
        resolvedCityId = cityParam;
      } else {
        // Try slug match, optionally scoped to the resolved country
        const city = await prisma.city.findFirst({
          where: {
            slug: cityParam.toLowerCase(),
            ...(resolvedCountryId ? { countryId: resolvedCountryId } : {}),
          },
          select: { id: true },
        });
        resolvedCityId = city?.id ?? null;
      }
    }

    // ── Build where clause ────────────────────────────────────────────────────
    const where: any = { isActive: true };

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

    if (resolvedCountryId) {
      where.countryId = resolvedCountryId;
    }

    if (resolvedCityId) {
      where.cityId = resolvedCityId;
    }

    // Language filter — only apply if locale-tagged companies exist in DB
    const langTag = locale === 'ar' ? 'lang:ar' : 'lang:en';
    const langTaggedCount = await prisma.company.count({
      where: { isActive: true, skills: { has: langTag } },
    });
    if (langTaggedCount > 0) {
      where.skills = { has: langTag };
    }

    // Category filter — match UUID stored in skills array
    if (resolvedCategoryId) {
      if (!where.AND) where.AND = [];
      where.AND.push({ skills: { has: resolvedCategoryId } });
    }

    if (resolvedSubcategoryId) {
      if (!where.AND) where.AND = [];
      where.AND.push({ skills: { has: resolvedSubcategoryId } });
    }

    // ── Build orderBy ─────────────────────────────────────────────────────────
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'rating': orderBy = { rating: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      case 'projects': orderBy = { reviewCount: 'desc' }; break;
    }

    // ── Fetch companies ───────────────────────────────────────────────────────
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          country: true,
          city: true,
          services: { take: 3 },
          projects: { where: { status: 'COMPLETED' }, select: { id: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.company.count({ where }),
    ]);

    const companiesWithRating = companies.map((company) => ({
      ...company,
      averageRating: Math.round((company.rating || 0) * 10) / 10,
      reviewCount: company.reviewCount,
      completedProjectsCount: company.projects.length,
      country: company.country
        ? { ...company.country, name: locale === 'ar' ? company.country.nameAr : company.country.nameEn }
        : null,
      city: company.city
        ? { ...company.city, name: locale === 'ar' ? company.city.nameAr : company.city.nameEn }
        : null,
    }));

    const yellowPagesActive = await isYellowPagesFeaturedActive();

    let filteredCompanies = companiesWithRating;
    if (minRating) {
      filteredCompanies = companiesWithRating.filter(
        (c) => c.averageRating >= parseFloat(minRating)
      );
    }

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
