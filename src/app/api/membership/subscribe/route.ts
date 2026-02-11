import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const subscribeSchema = z.object({
  planId: z.string(),
  paymentMethod: z.enum(['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER']),
});

// POST /api/membership/subscribe - Subscribe to a plan
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;

    // Only companies can subscribe
    if (user.role !== 'COMPANY') {
      return NextResponse.json(
        { error: 'Only companies can subscribe to membership plans' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = subscribeSchema.parse(body);

    // Get the plan
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: validatedData.planId },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Get company
    const company = await prisma.company.findUnique({
      where: { userId: user.id },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Check for active subscription
    const activeSubscription = await prisma.membership.findFirst({
      where: {
        companyId: company.id,
        status: 'ACTIVE',
        endDate: { gt: new Date() },
      },
    });

    if (activeSubscription) {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    
    switch (plan.duration) {
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'QUARTERLY':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'YEARLY':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    // Create subscription (in production, process payment first)
    const membership = await prisma.membership.create({
      data: {
        companyId: company.id,
        planId: plan.id,
        startDate,
        endDate,
        status: 'ACTIVE',
        autoRenew: true,
        paymentMethod: validatedData.paymentMethod,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        membershipId: membership.id,
        companyId: company.id,
        amount: plan.price,
        currency: plan.currency,
        status: 'COMPLETED',
        paymentMethod: validatedData.paymentMethod,
        description: `Subscription to ${plan.name}`,
      },
    });

    return NextResponse.json({
      membership,
      message: 'Subscription successful',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
