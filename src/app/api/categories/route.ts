// Cache at the edge for 1 hour — categories rarely change
export const revalidate = 3600;
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

// Helper to query categories with caching
const getCachedCategories = unstable_cache(
  async (whereStr: string, limitNum: number | undefined) => {
    const where = JSON.parse(whereStr);
    return prisma.category.findMany({
      where,
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { requests: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
      ...(limitNum ? { take: limitNum } : {}),
    });
  },
  ['categories-list'],
  { revalidate: 3600, tags: ['categories'] }
);

// GET /api/categories - Get all categories with subcategories
// Query params: ?featured=true&limit=12&locale=ar
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let locale = searchParams.get('locale');
    // Fallback to 'en' if locale is missing or invalid
    if (!locale || (locale !== 'ar' && locale !== 'en')) {
      locale = 'en';
    }
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const where: Record<string, unknown> = { isActive: true, parentId: null };
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const categories = await getCachedCategories(
      JSON.stringify(where),
      limit ? parseInt(limit, 10) : undefined
    );

    // Normalize names based on locale
    const normalized = categories.map((cat) => ({
      id: cat.id,
      name: locale === 'ar' ? cat.nameAr : cat.nameEn,
      nameEn: cat.nameEn,
      nameAr: cat.nameAr,
      slug: cat.slug,
      icon: cat.icon,
      iconName: cat.iconName,
      imageUrl: cat.imageUrl,
      isFeatured: cat.isFeatured,
      _count: {
        companies: cat._count.requests,
      },
      subcategories: cat.children.map((sub) => ({
        id: sub.id,
        name: locale === 'ar' ? sub.nameAr : sub.nameEn,
        nameEn: sub.nameEn,
        nameAr: sub.nameAr,
      })),
    }));

    return NextResponse.json({ categories: normalized });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

