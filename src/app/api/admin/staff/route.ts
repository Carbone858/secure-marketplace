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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const departmentId = searchParams.get('departmentId');

    const where: any = {};
    if (departmentId) where.departmentId = departmentId;

    const [staff, total] = await Promise.all([
      prisma.staffMember.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          role: { select: { id: true, name: true, nameAr: true } },
          department: { select: { id: true, name: true, nameAr: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.staffMember.count({ where }),
    ]);

    return NextResponse.json({
      staff,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const assignStaffSchema = z.object({
  userId: z.string(),
  roleId: z.string(),
  departmentId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = assignStaffSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    // Verify user exists and is ADMIN
    const user = await prisma.user.findUnique({ where: { id: parsed.data.userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already a staff member
    const existing = await prisma.staffMember.findUnique({ where: { userId: parsed.data.userId } });
    if (existing) {
      return NextResponse.json({ error: 'User is already a staff member' }, { status: 409 });
    }

    const member = await prisma.staffMember.create({
      data: parsed.data,
      include: {
        user: { select: { id: true, name: true, email: true } },
        role: true,
        department: true,
      },
    });

    // Promote user to ADMIN if not already
    if (user.role === 'USER' || user.role === 'COMPANY') {
      await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
    }

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: 'Staff member ID required' }, { status: 400 });
    }

    const updateStaffSchema = z.object({
      roleId: z.string().optional(),
      departmentId: z.string().optional(),
      isActive: z.boolean().optional(),
    });

    const parsed = updateStaffSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    const member = await prisma.staffMember.update({
      where: { id },
      data: parsed.data,
      include: {
        user: { select: { id: true, name: true, email: true } },
        role: true,
        department: true,
      },
    });
    return NextResponse.json({ member });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Staff member ID required' }, { status: 400 });
    }

    await prisma.staffMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
