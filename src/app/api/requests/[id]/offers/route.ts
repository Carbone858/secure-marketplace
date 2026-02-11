import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { offerSchema } from '@/lib/validations/request';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/requests/[id]/offers
 * Get offers for a request
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    const { id } = params;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
    });

    if (!serviceRequest) {
      return NextResponse.json(
        {
          success: false,
          error: 'request.notFound',
          message: 'Request not found.',
        },
        { status: 404 }
      );
    }

    // Check permissions
    const isOwner = session.isAuthenticated && session.user?.id === serviceRequest.userId;
    const isAdmin = session.isAuthenticated && (session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN');

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'forbidden',
          message: 'You do not have permission to view these offers.',
        },
        { status: 403 }
      );
    }

    const offers = await prisma.offer.findMany({
      where: { requestId: id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            rating: true,
            reviewCount: true,
            verificationStatus: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { offers },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get offers error:', error);
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
 * POST /api/requests/[id]/offers
 * Create an offer for a request
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to submit an offer.',
        },
        { status: 401 }
      );
    }

    const { id } = params;

    // Get user's company
    const company = await prisma.company.findUnique({
      where: { userId: session.user.id },
    });

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: 'company.notFound',
          message: 'You must have a registered company to submit offers.',
        },
        { status: 400 }
      );
    }

    if (!company.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'company.inactive',
          message: 'Your company is not active.',
        },
        { status: 400 }
      );
    }

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
    });

    if (!serviceRequest || !serviceRequest.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'request.notFound',
          message: 'Request not found.',
        },
        { status: 404 }
      );
    }

    // Check if request is open for offers
    if (!['PENDING', 'ACTIVE', 'MATCHING', 'REVIEWING_OFFERS'].includes(serviceRequest.status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'request.notOpen',
          message: 'This request is not accepting offers.',
        },
        { status: 400 }
      );
    }

    // Check if company already submitted an offer
    const existingOffer = await prisma.offer.findFirst({
      where: {
        requestId: id,
        companyId: company.id,
        status: { not: 'WITHDRAWN' },
      },
    });

    if (existingOffer) {
      return NextResponse.json(
        {
          success: false,
          error: 'offer.exists',
          message: 'You have already submitted an offer for this request.',
        },
        { status: 400 }
      );
    }

    // Check verification requirement
    if (serviceRequest.requireVerification && company.verificationStatus !== 'VERIFIED') {
      return NextResponse.json(
        {
          success: false,
          error: 'company.notVerified',
          message: 'This request requires a verified company.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = offerSchema.safeParse({ ...body, requestId: id });

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

    // Create offer
    const offer = await prisma.offer.create({
      data: {
        requestId: id,
        companyId: company.id,
        price: data.price,
        currency: data.currency,
        description: data.description,
        estimatedDays: data.estimatedDays,
        attachments: data.attachments,
        message: data.message,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    // Update request status to REVIEWING_OFFERS if it's the first offer
    const offerCount = await prisma.offer.count({
      where: { requestId: id, status: { not: 'WITHDRAWN' } },
    });

    if (offerCount === 1) {
      await prisma.serviceRequest.update({
        where: { id },
        data: { status: 'REVIEWING_OFFERS' },
      });
    }

    // TODO: Notify request owner of new offer

    return NextResponse.json(
      {
        success: true,
        message: 'Offer submitted successfully.',
        data: { offer },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create offer error:', error);
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
