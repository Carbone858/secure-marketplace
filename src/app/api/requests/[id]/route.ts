import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { updateRequestSchema } from '@/lib/validations/request';
import { logApiError } from '@/lib/monitoring/apiErrorLogger';
import {
  assertRequestEditable,
  assertRequestCancellable,
  InvalidTransitionError,
  type RequestStatus,
} from '@/lib/state-machine';

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
        projects: {
          include: {
            company: {
              select: {
                userId: true
              }
            }
          }
        },
      },
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

    // Extract the primary project if it exists
    const project = (serviceRequest as any).projects?.[0] || null;

    const isOwner = session.isAuthenticated && session.user?.id === serviceRequest.userId;
    const isAdmin = session.isAuthenticated && (session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN');

    // Check if the current user is a company that has submitted an offer
    let hasOffer = false;
    if (session.isAuthenticated && session.user?.role === 'COMPANY') {
      const company = await prisma.company.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
      });
      if (company) {
        hasOffer = serviceRequest.offers.some(o => o.company.id === company.id);
      }
    }

    if (!serviceRequest.isActive && !isOwner && !isAdmin && !hasOffer) {
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
        data: {
          request: serviceRequest,
          project: project
        },
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
/**
 * PUT /api/requests/[id]
 * Update request
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  let body: any = null;
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { success: false, error: 'unauthorized', message: 'You must be logged in to update a request.' },
        { status: 401 }
      );
    }

    const { id } = params;

    const serviceRequest = await prisma.serviceRequest.findUnique({ where: { id } });

    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, error: 'request.notFound', message: 'Request not found.' },
        { status: 404 }
      );
    }

    if (
      serviceRequest.userId !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.json(
        { success: false, error: 'forbidden', message: 'You do not have permission to update this request.' },
        { status: 403 }
      );
    }

    // Guard: only editable states (DRAFT, PENDING, ACTIVE)
    try {
      assertRequestEditable(serviceRequest.status as RequestStatus);
    } catch (err) {
      if (err instanceof InvalidTransitionError) {
        return NextResponse.json(
          { success: false, error: err.errorCode, message: 'This request cannot be edited at this stage.' },
          { status: 400 }
        );
      }
      throw err;
    }

    body = await request.json();
    console.log('[PUT /api/requests] Raw body keys:', Object.keys(body));

    // ── Pre-sanitize before Zod validation ──────────────────────────────────
    // Convert empty strings to undefined so Zod optional() passes cleanly
    const sanitized: any = {};
    for (const [key, val] of Object.entries(body)) {
      if (val === '') {
        // Keep as undefined — Zod partial() will skip it
        continue;
      }
      sanitized[key] = val;
    }

    // Convert budget strings to numbers
    if (sanitized.budgetMin !== undefined) sanitized.budgetMin = Number(sanitized.budgetMin);
    if (sanitized.budgetMax !== undefined) sanitized.budgetMax = Number(sanitized.budgetMax);

    // Convert deadline string to ISO string (Prisma DateTime expects either ISO or Date)
    if (sanitized.deadline && typeof sanitized.deadline === 'string') {
      const d = new Date(sanitized.deadline);
      if (!isNaN(d.getTime())) {
        sanitized.deadline = d.toISOString();
      } else {
        delete sanitized.deadline; // invalid date — drop it
      }
    }

    console.log('[PUT /api/requests] Sanitized body keys:', Object.keys(sanitized));

    const validationResult = updateRequestSchema.safeParse(sanitized);

    if (!validationResult.success) {
      console.error('[PUT /api/requests] Validation errors:', validationResult.error.flatten().fieldErrors);
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

    const updateData: any = { ...validationResult.data };

    // Sanitize optional FK fields — empty strings cause FK constraint violations
    const nullableOptionalFKs = ['subcategoryId', 'areaId'];
    for (const fk of nullableOptionalFKs) {
      if (updateData[fk] === '' || updateData[fk] === null) {
        updateData[fk] = null;
      }
    }

    // Remove required FKs if empty (safer to keep DB value)
    if (!updateData.cityId) delete updateData.cityId;
    if (!updateData.countryId) delete updateData.countryId;
    if (!updateData.categoryId) delete updateData.categoryId;

    // images / attachments — Prisma stores as Json, send as array which Prisma accepts
    // No conversion needed; Prisma Json field accepts JS arrays directly

    console.log('[PUT /api/requests] Final updateData keys:', Object.keys(updateData));

    const isResubmission = serviceRequest.status === 'REJECTED';

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id },
      data: {
        ...updateData,
        // If user edits a rejected request, it goes back to PENDING for admin review
        ...(isResubmission ? {
          status: 'PENDING',
          rejectionReason: null,
          rejectedAt: null,
          isActive: true,
        } : {}),
      },
    });

    return NextResponse.json(
      { success: true, message: 'Request updated successfully.', data: { request: updatedRequest } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[PUT /api/requests] ERROR:', error?.message);
    console.error('[PUT /api/requests] STACK:', error?.stack);
    console.error('[PUT /api/requests] BODY WAS:', JSON.stringify(body)?.slice(0, 500));

    // Automatically log to HealthLog for the admin health dashboard
    logApiError(error, {
      service: 'requests-update',
      category: 'REQUESTS',
      urlPath: `/api/requests/${body ? 'id' : 'unknown'}`,
      method: 'PUT',
      details: `Body: ${JSON.stringify(body)?.slice(0, 500)}`,
    }).catch(() => { });

    return NextResponse.json(
      { success: false, error: 'server.error', message: 'An unexpected error occurred. Please try again later.' },
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

    // Guard: can we cancel from current state?
    try {
      assertRequestCancellable(serviceRequest.status as RequestStatus);
    } catch (err) {
      if (err instanceof InvalidTransitionError) {
        return NextResponse.json(
          { success: false, error: err.errorCode, message: `Cannot cancel a request that is '${serviceRequest.status}'.` },
          { status: 400 }
        );
      }
      throw err;
    }

    // Atomically: withdraw all PENDING offers + soft-delete the request
    await prisma.$transaction([
      prisma.offer.updateMany({
        where: { requestId: id, status: 'PENDING' },
        data: { status: 'WITHDRAWN' },
      }),
      prisma.serviceRequest.update({
        where: { id },
        data: { isActive: false, status: 'CANCELLED' },
      }),
    ]);

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
