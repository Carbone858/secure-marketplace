import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const verificationSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  notes: z.string().optional(),
});

// GET /api/admin/verifications - Get pending verifications
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: {
          verificationStatus: status as any,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              createdAt: true,
            },
          },
          country: true,
          city: true,
          documents: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.company.count({
        where: {
          verificationStatus: status as any,
        },
      }),
    ]);

    return NextResponse.json({
      companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get verifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/verifications - Update verification status
// Accepts `id` in request body since this is not a dynamic [id] route
export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const id = body.id;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const validatedData = verificationSchema.parse(body);

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        verificationStatus: validatedData.status,
        verifiedAt: validatedData.status === 'VERIFIED' ? new Date() : null,
        verifiedBy: validatedData.status === 'VERIFIED' ? user.id : null,
      },
    });

    // Create notification for company owner
    await prisma.notification.create({
      data: {
        userId: company.userId,
        type: 'SYSTEM',
        title: `Verification ${validatedData.status}`,
        message:
          validatedData.status === 'VERIFIED'
            ? 'Your company has been verified successfully!'
            : `Your company verification was rejected. ${validatedData.notes || ''}`,
        data: { companyId: company.id },
      },
    });

    return NextResponse.json({ company: updatedCompany });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Update verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
