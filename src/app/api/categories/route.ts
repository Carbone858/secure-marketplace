import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true';

    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null, // Only top-level categories
      },
      include: includeSubcategories
        ? {
            children: {
              where: { isActive: true },
              orderBy: { name: 'asc' },
            },
          }
        : undefined,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
