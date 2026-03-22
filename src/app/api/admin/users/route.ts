export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, requirePermission } from '@/lib/auth-middleware';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.enum(['USER', 'COMPANY', 'ADMIN', 'SUPER_ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/admin/users - Get all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    // Check permission
    const forbidden = requirePermission(auth.user, 'manage_users');
    if (forbidden) return forbidden;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              requests: true,
              projects: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users - Update user (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    // Check permission
    const forbidden = requirePermission(auth.user, 'manage_users');
    if (forbidden) return forbidden;

    const body = await request.json();
    const id = body.id;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // --- FINE-GRAINED RBAC CHECKS ---
    // 1. If modifying the role, the current user MUST have `manage_staff` permission
    if (parsed.data.role && parsed.data.role !== auth.user.role) {
      const staffForbidden = requirePermission(auth.user, 'manage_staff');
      if (staffForbidden) {
        return NextResponse.json(
          { error: 'Missing permission: manage_staff. Only Staff Managers can modify roles.' },
          { status: 403 }
        );
      }
    }

    // Prevent non-SUPER_ADMIN from assigning SUPER_ADMIN role
    if (parsed.data.role === 'SUPER_ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Only SUPER_ADMIN can assign SUPER_ADMIN role' },
        { status: 403 }
      );
    }

    // 2. Fetch target user to prevent banning other Admins unless authorized
    const targetUser = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (
      parsed.data.isActive !== undefined && 
      (targetUser.role === 'ADMIN' || targetUser.role === 'SUPER_ADMIN')
    ) {
      const staffForbidden = requirePermission(auth.user, 'manage_staff');
      if (staffForbidden) {
        return NextResponse.json(
          { error: 'Missing permission: manage_staff. Cannot modify active status of Admin/Super Admin.' },
          { status: 403 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

