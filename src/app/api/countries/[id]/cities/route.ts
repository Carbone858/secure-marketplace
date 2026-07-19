// Cache at the edge for 24 hours — cities almost never change
export const revalidate = 86400;
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { unstable_cache } from 'next/cache';

interface RouteParams {
  params: { id: string };
}

// Helper to query cities with caching
const getCachedCities = unstable_cache(
  async (countryId: string) => {
    return prisma.city.findMany({
      where: { countryId },
      select: {
        id: true,
        nameEn: true,
        nameAr: true,
      },
      orderBy: {
        nameEn: 'asc',
      },
    });
  },
  ['cities-list'],
  { revalidate: 86400, tags: ['cities'] }
);

/**
 * GET /api/countries/[id]/cities
 * Get cities for a country
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const cities = await getCachedCities(id);

    return NextResponse.json(
      {
        success: true,
        data: {
          cities: cities.map((city) => ({
            id: city.id,
            name: locale === 'ar' ? city.nameAr : city.nameEn,
            nameEn: city.nameEn,
            nameAr: city.nameAr,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get cities error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'server.error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
