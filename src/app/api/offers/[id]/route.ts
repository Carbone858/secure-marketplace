import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { updateOfferSchema } from '@/lib/validations/request';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/offers/[id]
 * Get offer details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    const { id } = params;

    const offer = await prisma.offer.findUnique({
      where: { id },
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
        request: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!offer) {
      return NextResponse.json(
        {
          success: false,
          error: 'offer.notFound',
          message: 'Offer not found.',
        },
        { status: 404 }
      );
    }

    // Check permissions
    const isRequestOwner = session.isAuthenticated && session.user?.id === offer.request.userId;
    const isCompanyOwner = session.isAuthenticated && session.user?.id === offer.company.userId;
    const isAdmin = session.isAuthenticated && (session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN');

    if (!isRequestOwner && !isCompanyOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'forbidden',
          message: 'You do not have permission to view this offer.',
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { offer },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get offer error:', error);
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
 * PUT /api/offers/[id]
 * Update offer (company can modify, request owner can accept/reject)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to update an offer.',
        },
        { status: 401 }
      );
    }

    const { id } = params;

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        request: true,
        company: true,
      },
    });

    if (!offer) {
      return NextResponse.json(
        {
          success: false,
          error: 'offer.notFound',
          message: 'Offer not found.',
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const isRequestOwner = session.user.id === offer.request.userId;
    const isCompanyOwner = session.user.id === offer.company.userId;
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';

    // Request owner can accept or reject
    if (body.status === 'ACCEPTED' || body.status === 'REJECTED') {
      if (!isRequestOwner && !isAdmin) {
        return NextResponse.json(
          {
            success: false,
            error: 'forbidden',
            message: 'Only the request owner can accept or reject offers.',
          },
          { status: 403 }
        );
      }

      const updatedOffer = await prisma.offer.update({
        where: { id },
        data: { status: body.status },
      });

      // If accepted, update request status and reject other offers
      if (body.status === 'ACCEPTED') {
        await prisma.serviceRequest.update({
          where: { id: offer.requestId },
          data: { status: 'ACCEPTED' },
        });

        await prisma.offer.updateMany({
          where: {
            requestId: offer.requestId,
            id: { not: id },
            status: 'PENDING',
          },
          data: { status: 'REJECTED' },
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: `Offer ${body.status.toLowerCase()}.`,
          data: { offer: updatedOffer },
        },
        { status: 200 }
      );
    }

    // Company owner can update their offer
    if (!isCompanyOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'forbidden',
          message: 'You do not have permission to update this offer.',
        },
        { status: 403 }
      );
    }

    // Can only update pending offers
    if (offer.status !== 'PENDING') {
      return NextResponse.json(
        {
          success: false,
          error: 'offer.notEditable',
          message: 'This offer cannot be modified.',
        },
        { status: 400 }
      );
    }

    const validationResult = updateOfferSchema.safeParse(body);

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

    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: validationResult.data,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Offer updated successfully.',
        data: { offer: updatedOffer },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update offer error:', error);
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
 * DELETE /api/offers/[id]
 * Withdraw offer
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to withdraw an offer.',
        },
        { status: 401 }
      );
    }

    const { id } = params;

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!offer) {
      return NextResponse.json(
        {
          success: false,
          error: 'offer.notFound',
          message: 'Offer not found.',
        },
        { status: 404 }
      );
    }

    // Check ownership
    if (offer.company.userId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'forbidden',
          message: 'You do not have permission to withdraw this offer.',
        },
        { status: 403 }
      );
    }

    // Can only withdraw pending offers
    if (offer.status !== 'PENDING') {
      return NextResponse.json(
        {
          success: false,
          error: 'offer.notWithdrawable',
          message: 'This offer cannot be withdrawn.',
        },
        { status: 400 }
      );
    }

    await prisma.offer.update({
      where: { id },
      data: { status: 'WITHDRAWN' },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Offer withdrawn successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Withdraw offer error:', error);
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
