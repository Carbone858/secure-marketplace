import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/countries/[id]/cities
 * Get cities for a country
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const cities = await prisma.city.findMany({
      where: { countryId: id },
      select: {
        id: true,
        nameEn: true,
        nameAr: true,
      },
      orderBy: {
        nameEn: 'asc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          cities: cities.map((city) => ({
            id: city.id,
            name: city.nameEn,
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
