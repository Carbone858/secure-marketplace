import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    const where: any = {};
    if (status === 'reported') {
      where.rating = { lte: 2 };
    } else if (status === 'pending') {
      where.isApproved = false;
    } else if (status === 'approved') {
      where.isApproved = true;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          company: { select: { id: true, name: true } },
          project: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, isApproved } = body;

    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    const review = await (prisma.review as any).update({
      where: { id },
      data: { isApproved: !!isApproved },
      select: { companyId: true }
    });

    // Recalculate company rating and reviewCount
    const stats = await (prisma.review as any).aggregate({
      where: { 
        companyId: review.companyId,
        isApproved: true 
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.company.update({
      where: { id: review.companyId },
      data: {
        rating: Math.round((stats._avg.rating || 0) * 100) / 100,
        reviewCount: stats._count.rating,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Patch review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    // Capture companyId before deletion to recalculate stats
    const review = await (prisma.review as any).findUnique({
      where: { id },
      select: { companyId: true, isApproved: true }
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await prisma.review.delete({ where: { id } });

    // If the deleted review was approved, recalculate stats
    if (review.isApproved) {
      const stats = await (prisma.review as any).aggregate({
        where: { 
          companyId: review.companyId,
          isApproved: true 
        },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.company.update({
        where: { id: review.companyId },
        data: {
          rating: Math.round((stats._avg.rating || 0) * 100) / 100,
          reviewCount: stats._count.rating,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
