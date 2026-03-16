import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';
import { getFeatureFlag, FEATURE_FLAG_KEYS } from '@/lib/feature-flags';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

// GET /api/companies/[id]/reviews - Get company reviews
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { 
          companyId: id,
          isApproved: true 
        },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ 
        where: { 
          companyId: id,
          isApproved: true 
        } 
      }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/companies/[id]/reviews - Create a review
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request);

    if (auth instanceof NextResponse) {
      return auth;
    }

    const { user } = auth;
    const { id } = params;

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Prevent reviewing own company
    if (company.userId === user.id) {
      return NextResponse.json(
        { error: 'Cannot review your own company' },
        { status: 403 }
      );
    }

    // Check if user already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        companyId: id,
        userId: user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this company' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    const isModerationEnabled = await getFeatureFlag(FEATURE_FLAG_KEYS.isReviewModerationEnabled);

    const review = await prisma.review.create({
      data: {
        ...validatedData,
        companyId: id,
        userId: user.id,
        isApproved: !isModerationEnabled,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    // If moderation is disabled, recalculate company rating and reviewCount immediately
    if (!isModerationEnabled) {
      try {
        console.log('[REVIEWS] Recalculating stats for company:', id);
        const stats = await prisma.review.aggregate({
          where: { 
            companyId: id,
            isApproved: true 
          },
          _avg: { rating: true },
          _count: { rating: true },
        });
        console.log('[REVIEWS] New stats:', stats);

        await prisma.company.update({
          where: { id },
          data: {
            rating: stats._avg?.rating ? Math.round(stats._avg.rating * 100) / 100 : 0,
            reviewCount: stats._count?.rating || 0,
          },
        });
        console.log('[REVIEWS] Company stats updated for:', id);
      } catch (statsError) {
        console.error('[REVIEWS] Failed to update company stats:', statsError);
        // We don't fail the whole request since the review WAS created
      }
    }

    return NextResponse.json({ 
      review, 
      requiresModeration: isModerationEnabled 
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
