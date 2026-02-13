import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categories/:id/subcategories
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const subcategories = await prisma.category.findMany({
      where: { parentId: id, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    const normalized = subcategories.map((sub) => ({
      id: sub.id,
      name: locale === 'ar' ? sub.nameAr : sub.nameEn,
      nameEn: sub.nameEn,
      nameAr: sub.nameAr,
      icon: sub.icon,
    }));

    return NextResponse.json({
      success: true,
      data: { subcategories: normalized },
    });
  } catch (error) {
    console.error('Get subcategories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
