import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/countries - Get all countries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCities = searchParams.get('includeCities') === 'true';

    const countries = await prisma.country.findMany({
      where: {
        isActive: true,
      },
      include: includeCities
        ? {
            cities: {
              where: { isActive: true },
              orderBy: { name: 'asc' },
            },
          }
        : undefined,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ countries });
  } catch (error) {
    console.error('Get countries error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/countries/[id]/cities - Get cities for a country
export async function GET_CITIES(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const cities = await prisma.city.findMany({
      where: {
        countryId: id,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Get cities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
