import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { updateRequestSchema } from '@/lib/validations/request';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/requests/[id]
 * Get request details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    const { id } = params;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
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
        subcategory: {
          select: {
            id: true,
            nameEn: true,
            nameAr: true,
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
        area: {
          select: {
            id: true,
            nameEn: true,
            nameAr: true,
          },
        },
        offers: {
          where: { status: { in: ['PENDING', 'ACCEPTED'] } },
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
        },
        _count: {
          select: {
            offers: true,
          },
        },
      },
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

    // Check visibility permissions
    if (serviceRequest.visibility !== 'PUBLIC') {
      if (!session.isAuthenticated) {
        return NextResponse.json(
          {
            success: false,
            error: 'unauthorized',
            message: 'You must be logged in to view this request.',
          },
          { status: 401 }
        );
      }

      if (serviceRequest.visibility === 'VERIFIED_COMPANIES') {
        const userCompany = await prisma.company.findUnique({
          where: { userId: session.user!.id },
        });

        if (!userCompany || userCompany.verificationStatus !== 'VERIFIED') {
          return NextResponse.json(
            {
              success: false,
              error: 'forbidden',
              message: 'Only verified companies can view this request.',
            },
            { status: 403 }
          );
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: { request: serviceRequest },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get request error:', error);
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
 * PUT /api/requests/[id]
 * Update request
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to update a request.',
        },
        { status: 401 }
      );
    }

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

    // Check ownership
    if (serviceRequest.userId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'forbidden',
          message: 'You do not have permission to update this request.',
        },
        { status: 403 }
      );
    }

    // Check if request can be edited
    if (!['DRAFT', 'PENDING', 'ACTIVE'].includes(serviceRequest.status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'request.notEditable',
          message: 'This request cannot be edited at this stage.',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = updateRequestSchema.safeParse(body);

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

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id },
      data: validationResult.data,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Request updated successfully.',
        data: { request: updatedRequest },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update request error:', error);
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
 * DELETE /api/requests/[id]
 * Cancel/delete request
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to cancel a request.',
        },
        { status: 401 }
      );
    }

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

    // Check ownership
    if (serviceRequest.userId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'forbidden',
          message: 'You do not have permission to cancel this request.',
        },
        { status: 403 }
      );
    }

    // Soft delete - set isActive to false
    await prisma.serviceRequest.update({
      where: { id },
      data: { isActive: false, status: 'CANCELLED' },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Request cancelled successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete request error:', error);
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
