import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const company = await prisma.company.findFirst({
      where: { userId: auth.user.id },
      include: { matchingPreference: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ preferences: company.matchingPreference });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const preferencesSchema = z.object({
  categoryIds: z.array(z.string()).optional(),
  cityIds: z.array(z.string()).optional(),
  budgetMin: z.number().min(0).optional().nullable(),
  budgetMax: z.number().min(0).optional().nullable(),
  urgencyLevels: z.array(z.string()).optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    // Check smart matching feature flag
    const flag = await prisma.featureFlag.findUnique({ where: { key: 'isSmartMatchingEnabled' } });
    if (flag?.value !== true) {
      return NextResponse.json({ error: 'Smart matching is not enabled' }, { status: 403 });
    }

    const company = await prisma.company.findFirst({ where: { userId: auth.user.id } });
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = preferencesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    const prefs = await prisma.companyMatchingPreference.upsert({
      where: { companyId: company.id },
      update: parsed.data,
      create: {
        ...parsed.data,
        companyId: company.id,
      },
    });

    return NextResponse.json({ preferences: prefs });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
