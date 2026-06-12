import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

// Internal function that does the actual DB query
async function _getFeaturedCategories(locale: string = 'en', limit: number = 8) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null,
        isFeatured: true,
      },
      include: {
        _count: {
          select: { requests: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
      take: limit,
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: locale === 'ar' ? (cat.nameAr || cat.nameEn) : cat.nameEn,
      nameEn: cat.nameEn,
      nameAr: cat.nameAr,
      slug: cat.slug,
      icon: cat.icon,
      iconName: cat.iconName,
      imageUrl: cat.imageUrl,
      _count: {
        companies: cat._count.requests,
      },
    }));
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    return [];
  }
}

// Cached wrapper — revalidates every 1 hour
export const getFeaturedCategories = unstable_cache(
  _getFeaturedCategories,
  ['featured-categories'],
  { revalidate: 3600, tags: ['categories'] }
);

