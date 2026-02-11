import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/companies/[slug] - Get company details
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const company = await prisma.company.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        country: true,
        city: true,
        services: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            reviews: true,
            completedProjects: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error('Get company error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
