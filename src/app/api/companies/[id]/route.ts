import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { companyUpdateSchema } from '@/lib/validations/company';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/companies/[id]
 * Get company details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Try to find by slug first, then by ID
    let company = await prisma.company.findFirst({
      where: {
        OR: [{ slug: id }, { id }],
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            image: true,
          },
        },
        country: true,
        city: true,
        services: {
          where: { isActive: true },
        },
        workingHours: true,
        socialLinks: true,
        documents: {
          where: { status: 'APPROVED' },
          select: {
            type: true,
            status: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        projects: {
          where: { status: 'COMPLETED' },
          select: { id: true },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: 'company.notFound',
          message: 'Company not found.',
        },
        { status: 404 }
      );
    }

    const { projects, country, city, reviews, ...rest } = company;
    const normalizedCompany = {
      ...rest,
      country: country ? { ...country, name: country.nameEn } : null,
      city: city ? { ...city, name: city.nameEn } : null,
      reviews,
      _count: {
        reviews: reviews.length,
        completedProjects: projects.length,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: { company: normalizedCompany },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get company error:', error);

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
 * PUT /api/companies/[id]
 * Update company details
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to update a company.',
        },
        { status: 401 }
      );
    }

    const { id } = params;

    // Find company
    const company = await prisma.company.findFirst({
      where: {
        OR: [{ slug: id }, { id }],
      },
    });

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: 'company.notFound',
          message: 'Company not found.',
        },
        { status: 404 }
      );
    }

    // Check ownership
    if (company.userId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'forbidden',
          message: 'You do not have permission to update this company.',
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = companyUpdateSchema.safeParse(body);

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

    // Update company
    const updatedCompany = await prisma.company.update({
      where: { id: company.id },
      data: validationResult.data,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Company updated successfully.',
        data: { company: updatedCompany },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update company error:', error);

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
 * DELETE /api/companies/[id]
 * Delete company (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to delete a company.',
        },
        { status: 401 }
      );
    }

    const { id } = params;

    // Find company
    const company = await prisma.company.findFirst({
      where: {
        OR: [{ slug: id }, { id }],
      },
    });

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: 'company.notFound',
          message: 'Company not found.',
        },
        { status: 404 }
      );
    }

    // Check ownership
    if (company.userId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'forbidden',
          message: 'You do not have permission to delete this company.',
        },
        { status: 403 }
      );
    }

    // Soft delete - set isActive to false
    await prisma.company.update({
      where: { id: company.id },
      data: { isActive: false },
    });

    // Revert user role to USER
    await prisma.user.update({
      where: { id: company.userId },
      data: { role: 'USER' },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Company deleted successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete company error:', error);

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
