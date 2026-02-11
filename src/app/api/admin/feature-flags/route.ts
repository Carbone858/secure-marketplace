import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = category ? { category } : {};
    const flags = await prisma.featureFlag.findMany({ where, orderBy: { category: 'asc' } });
    return NextResponse.json({ flags });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const updateFlagSchema = z.object({
  id: z.string(),
  value: z.boolean(),
  description: z.string().optional(),
});

const createFlagSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.boolean(),
  description: z.string().optional(),
  category: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateFlagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    const flag = await prisma.featureFlag.update({
      where: { id: parsed.data.id },
      data: {
        value: parsed.data.value,
        ...(parsed.data.description && { description: parsed.data.description }),
      },
    });
    return NextResponse.json({ flag });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createFlagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.featureFlag.findUnique({ where: { key: parsed.data.key } });
    if (existing) {
      return NextResponse.json({ error: 'Feature flag key already exists' }, { status: 409 });
    }

    const flag = await prisma.featureFlag.create({ data: parsed.data });
    return NextResponse.json({ flag }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
