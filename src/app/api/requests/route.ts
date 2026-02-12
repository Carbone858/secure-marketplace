import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { createRequestSchema, requestFilterSchema } from '@/lib/validations/request';
import { isRequestLimitActive, isPaidPlanActive } from '@/lib/feature-flags';

/**
 * GET /api/requests
 * Get list of service requests with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);

    // Parse filter params
    const filters: Record<string, unknown> = {};
    
    const categoryId = searchParams.get('categoryId');
    const countryId = searchParams.get('countryId');
    const cityId = searchParams.get('cityId');
    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    const budgetMin = searchParams.get('budgetMin');
    const budgetMax = searchParams.get('budgetMax');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    // Status filter
    if (status) {
      where.status = status;
    } else {
      // Default: show active requests only
      where.status = { in: ['PENDING', 'ACTIVE', 'MATCHING', 'REVIEWING_OFFERS'] };
    }

    // Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Location filters
    if (countryId) {
      where.countryId = countryId;
    }
    if (cityId) {
      where.cityId = cityId;
    }

    // Urgency filter
    if (urgency) {
      where.urgency = urgency;
    }

    // Budget filter
    if (budgetMin || budgetMax) {
      where.AND = [];
      if (budgetMin) {
        (where.AND as unknown[]).push({ budgetMax: { gte: parseFloat(budgetMin as string) } });
      }
      if (budgetMax) {
        (where.AND as unknown[]).push({ budgetMin: { lte: parseFloat(budgetMax as string) } });
      }
    }

    // User filter (for "my requests")
    if (userId) {
      where.userId = userId;
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Visibility filter based on user role
    if (!session.isAuthenticated) {
      where.visibility = 'PUBLIC';
    }

    // Get requests with pagination
    const [requests, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              nameEn: true,
              nameAr: true,
              icon: true,
            },
          },
          country: {
            select: {
              id: true,
              nameEn: true,
              nameAr: true,
            },
          },
          city: {
            select: {
              id: true,
              nameEn: true,
              nameAr: true,
            },
          },
          _count: {
            select: {
              offers: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.serviceRequest.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          requests,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get requests error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'server.error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/requests
 * Create a new service request
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to create a request.',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = createRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'validation.failed',
          message: 'Please check your input and try again.',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Phase 2: Check request limits if feature flag is enabled
    const requestLimitEnabled = await isRequestLimitActive();
    if (requestLimitEnabled) {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const requestCount = await prisma.serviceRequest.count({
        where: {
          userId: session.user.id,
          createdAt: { gte: monthStart },
        },
      });

      const FREE_REQUEST_LIMIT = 10; // Configurable
      if (requestCount >= FREE_REQUEST_LIMIT) {
        return NextResponse.json(
          {
            success: false,
            error: 'request.limitReached',
            message: 'You have reached the monthly request limit. Upgrade your plan for unlimited requests.',
          },
          { status: 403 }
        );
      }
    }

    // Create request
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        userId: session.user.id,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        countryId: data.countryId,
        cityId: data.cityId,
        areaId: data.areaId,
        address: data.address,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        currency: data.currency,
        deadline: data.deadline ? new Date(data.deadline) : null,
        urgency: data.urgency,
        visibility: data.visibility,
        images: data.images,
        attachments: data.attachments,
        tags: data.tags,
        allowRemote: data.allowRemote,
        requireVerification: data.requireVerification,
        status: 'PENDING',
      },
      include: {
        category: true,
        country: true,
        city: true,
      },
    });

    // TODO: Trigger matching algorithm to notify relevant companies

    return NextResponse.json(
      {
        success: true,
        message: 'Request created successfully.',
        data: { request: serviceRequest },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'server.error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
