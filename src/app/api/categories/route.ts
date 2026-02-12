import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categories - Get all categories with subcategories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const categories = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
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
    });

    // Normalize names based on locale
    const normalized = categories.map((cat) => ({
      id: cat.id,
      name: locale === 'ar' ? cat.nameAr : cat.nameEn,
      nameEn: cat.nameEn,
      nameAr: cat.nameAr,
      icon: cat.icon,
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
