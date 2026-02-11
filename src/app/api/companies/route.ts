import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import {
  companyRegistrationSchema,
  generateSlug,
  companyWorkingHoursSchema,
  companySocialLinksSchema,
} from '@/lib/validations/company';
import { z } from 'zod';

/**
 * GET /api/companies
 * Get list of companies with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const countryId = searchParams.get('countryId');
    const cityId = searchParams.get('cityId');
    const search = searchParams.get('search');
    const verifiedOnly = searchParams.get('verified') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (verifiedOnly) {
      where.verificationStatus = 'VERIFIED';
    }

    if (countryId) {
      where.countryId = countryId;
    }

    if (cityId) {
      where.cityId = cityId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get companies
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
          services: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              services: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: [
          { isFeatured: 'desc' },
          { rating: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.company.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          companies,
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
    console.error('Get companies error:', error);

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
 * POST /api/companies
 * Register a new company
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to register a company.',
        },
        { status: 401 }
      );
    }

    // Check if user already has a company
    const existingCompany = await prisma.company.findUnique({
      where: { userId: session.user.id },
    });

    if (existingCompany) {
      return NextResponse.json(
        {
          success: false,
          error: 'company.exists',
          message: 'You already have a registered company.',
        },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = companyRegistrationSchema.safeParse(body);

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

    const {
      name,
      description,
      email,
      phone,
      website,
      countryId,
      cityId,
      address,
      services,
      workingHours,
      socialLinks,
    } = validationResult.data;

    // Generate unique slug
    let slug = generateSlug(name);
    let slugExists = await prisma.company.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${generateSlug(name)}-${counter}`;
      slugExists = await prisma.company.findUnique({ where: { slug } });
      counter++;
    }

    // Create company with related data
    const company = await prisma.$transaction(async (tx) => {
      // Create company
      const newCompany = await tx.company.create({
        data: {
          userId: session.user!.id,
          name,
          slug,
          description,
          email,
          phone,
          website,
          countryId,
          cityId,
          address,
          verificationStatus: 'PENDING',
        },
      });

      // Create services
      if (services && services.length > 0) {
        await tx.companyService.createMany({
          data: services.map((service) => ({
            companyId: newCompany.id,
            name: service.name,
            description: service.description,
            priceFrom: service.priceFrom,
            priceTo: service.priceTo,
          })),
        });
      }

      // Create working hours
      if (workingHours) {
        const validatedHours = companyWorkingHoursSchema.parse(workingHours);
        await tx.companyWorkingHours.create({
          data: {
            companyId: newCompany.id,
            ...validatedHours,
          },
        });
      }

      // Create social links
      if (socialLinks) {
        const validatedLinks = companySocialLinksSchema.parse(socialLinks);
        await tx.companySocialLinks.create({
          data: {
            companyId: newCompany.id,
            ...validatedLinks,
          },
        });
      }

      // Update user role to COMPANY
      await tx.user.update({
        where: { id: session.user!.id },
        data: { role: 'COMPANY' },
      });

      return newCompany;
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Company registered successfully. Please upload verification documents.',
        data: {
          company: {
            id: company.id,
            name: company.name,
            slug: company.slug,
            verificationStatus: company.verificationStatus,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Company registration error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'validation.failed',
          message: 'Please check your input and try again.',
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

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
