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
            userId: true,
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

      // Prevent accepting/rejecting already finalized offers
      if (offer.status !== 'PENDING') {
        return NextResponse.json(
          {
            success: false,
            error: 'offer.alreadyProcessed',
            message: `This offer has already been ${offer.status.toLowerCase()}.`,
          },
          { status: 400 }
        );
      }

      // Use a transaction to prevent race conditions
      if (body.status === 'ACCEPTED') {
        const result = await prisma.$transaction(async (tx) => {
          // Re-check offer status inside transaction to prevent race conditions
          const freshOffer = await tx.offer.findUnique({
            where: { id },
            include: { request: true, company: true },
          });

          if (!freshOffer || freshOffer.status !== 'PENDING') {
            throw new Error('OFFER_ALREADY_PROCESSED');
          }

          // Update the accepted offer
          const updatedOffer = await tx.offer.update({
            where: { id },
            data: { status: 'ACCEPTED' },
          });

          // Update request status
          await tx.serviceRequest.update({
            where: { id: freshOffer.requestId },
            data: { status: 'ACCEPTED' },
          });

          // Reject all other pending offers for this request
          await tx.offer.updateMany({
            where: {
              requestId: freshOffer.requestId,
              id: { not: id },
              status: 'PENDING',
            },
            data: { status: 'REJECTED' },
          });

          // Auto-create project from the accepted offer
          const project = await tx.project.create({
            data: {
              title: freshOffer.request.title,
              description: freshOffer.request.description,
              userId: freshOffer.request.userId,
              companyId: freshOffer.companyId,
              requestId: freshOffer.requestId,
              budget: freshOffer.price,
              currency: freshOffer.currency,
              status: 'PENDING',
            },
          });

          // Create notification for company owner
          await tx.notification.create({
            data: {
              userId: freshOffer.company.userId,
              type: 'PROJECT',
              title: 'Offer Accepted - New Project',
              message: `Your offer for "${freshOffer.request.title}" has been accepted! A new project has been created.`,
              data: { projectId: project.id, offerId: updatedOffer.id },
            },
          });

          return { offer: updatedOffer, project };
        });

        return NextResponse.json(
          {
            success: true,
            message: 'Offer accepted and project created.',
            data: { offer: result.offer, project: result.project },
          },
          { status: 200 }
        );
      }

      // Handle rejection (simpler, no transaction needed)
      const updatedOffer = await prisma.offer.update({
        where: { id },
        data: { status: 'REJECTED' },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Offer rejected.',
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
  } catch (error: any) {
    if (error?.message === 'OFFER_ALREADY_PROCESSED') {
      return NextResponse.json(
        {
          success: false,
          error: 'offer.alreadyProcessed',
          message: 'This offer has already been processed by another action.',
        },
        { status: 409 }
      );
    }
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
