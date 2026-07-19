import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

// Internal function to query DB directly for top rated companies
async function _getFeaturedCompanies(locale: string = 'en', limit: number = 4) {
  try {
    const companies = await prisma.company.findMany({
      where: {
        isActive: true,
      },
      include: {
        country: true,
        city: true,
      },
      orderBy: {
        rating: 'desc',
      },
      take: limit,
    });

    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      slug: company.slug,
      logo: company.logo,
      averageRating: Math.round((company.rating || 0) * 10) / 10,
      reviewCount: company.reviewCount,
      completedProjectsCount: 0,
      country: company.country
        ? {
            id: company.country.id,
            code: company.country.code,
            name: locale === 'ar' ? (company.country.nameAr || company.country.nameEn) : company.country.nameEn,
          }
        : null,
      city: company.city
        ? {
            id: company.city.id,
            slug: company.city.slug,
            name: locale === 'ar' ? (company.city.nameAr || company.city.nameEn) : company.city.nameEn,
          }
        : null,
    }));
  } catch (error) {
    console.error('Error fetching featured companies server-side:', error);
    return [];
  }
}

// Cached wrapper - revalidates every 1 hour
export const getFeaturedCompanies = (locale: string = 'en', limit: number = 4) =>
  unstable_cache(
    () => _getFeaturedCompanies(locale, limit),
    ['featured-companies', locale, String(limit)],
    { revalidate: 3600, tags: ['companies'] }
  )();
