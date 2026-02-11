import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';

// GET /api/membership/plans - Get all membership plans
export async function GET(request: NextRequest) {
  try {
    const plans = await prisma.membershipPlan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: 'asc',
      },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Get membership plans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/membership/plans - Create a membership plan (Admin only)
export async function POST(request: NextRequest) {
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

    const plan = await prisma.membershipPlan.create({
      data: body,
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('Create membership plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
