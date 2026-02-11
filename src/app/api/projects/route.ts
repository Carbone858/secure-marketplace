import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  requestId: z.string().optional(),
  companyId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().min(0).optional(),
  currency: z.string().default('USD'),
});

// GET /api/projects - Get user's projects
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    let where: any = {};

    if (user.role === 'USER') {
      where.userId = user.id;
    } else if (user.role === 'COMPANY') {
      const company = await prisma.company.findUnique({
        where: { userId: user.id },
      });
      if (company) {
        where.companyId = company.id;
      }
    }

    if (status) {
      where.status = status;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          company: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
          request: true,
          milestones: true,
          _count: {
            select: {
              milestones: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;

    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    // Verify the company exists
    const company = await prisma.company.findUnique({
      where: { id: validatedData.companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        userId: user.id,
        companyId: validatedData.companyId,
        requestId: validatedData.requestId,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        budget: validatedData.budget,
        currency: validatedData.currency,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        company: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Create notification for company
    await prisma.notification.create({
      data: {
        userId: company.userId,
        type: 'PROJECT',
        title: 'New Project',
        message: `You have a new project: ${project.title}`,
        data: { projectId: project.id },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
