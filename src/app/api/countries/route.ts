import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/countries - Get all countries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCities = searchParams.get('includeCities') === 'true';
    const locale = searchParams.get('locale') || 'en';

    const countries = await prisma.country.findMany({
      where: {
        isActive: true,
      },
      include: includeCities
        ? {
            cities: {
              where: { isActive: true },
              orderBy: { nameEn: 'asc' },
            },
          }
        : undefined,
      orderBy: { nameEn: 'asc' },
    });

    const normalized = countries.map((country: any) => ({
      ...country,
      name: locale === 'ar' ? country.nameAr : country.nameEn,
      cities: includeCities && country.cities
        ? country.cities.map((city: any) => ({
            ...city,
            name: locale === 'ar' ? city.nameAr : city.nameEn,
          }))
        : undefined,
    }));

    return NextResponse.json({ countries: normalized });
  } catch (error) {
    console.error('Get countries error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
