import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';

/**
 * GET /api/user/reviews
 * Returns reviews authored by the authenticated user.
 */
export async function GET() {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { userId: session.user.id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Fetch user reviews error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
