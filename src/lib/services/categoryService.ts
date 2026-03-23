import { prisma } from '@/lib/prisma';

export async function getFeaturedCategories(locale: string = 'en', limit: number = 8) {
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
