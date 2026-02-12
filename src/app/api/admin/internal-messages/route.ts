import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const createInternalMessageSchema = z.object({
  recipientId: z.string().optional(),
  departmentId: z.string().optional(),
  subject: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
});

// GET /api/admin/internal-messages - List internal messages for current admin
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
    const filter = searchParams.get('filter'); // 'inbox', 'sent', 'department'
    const departmentId = searchParams.get('departmentId');

    const skip = (page - 1) * limit;

    let where: any = {};

    if (filter === 'sent') {
      where.senderId = auth.user.id;
    } else if (filter === 'department' && departmentId) {
      where.departmentId = departmentId;
    } else {
      // Default: inbox (messages received by this user or to their department)
      const staffMember = await prisma.staffMember.findUnique({
        where: { userId: auth.user.id },
        select: { departmentId: true },
      });

      where.OR = [
        { recipientId: auth.user.id },
        ...(staffMember?.departmentId
          ? [{ departmentId: staffMember.departmentId, recipientId: null }]
          : []),
      ];
    }

    const [messages, total] = await Promise.all([
      prisma.internalMessage.findMany({
        where,
        include: {
          sender: { select: { id: true, name: true, email: true, avatar: true } },
          recipient: { select: { id: true, name: true, email: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.internalMessage.count({ where }),
    ]);

    // Get unread count
    const unreadWhere = {
      OR: [{ recipientId: auth.user.id }],
      isRead: false,
    };
    const unreadCount = await prisma.internalMessage.count({ where: unreadWhere as any });

    return NextResponse.json({
      messages,
      unreadCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get internal messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/internal-messages - Send internal message
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createInternalMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    // Must have either recipientId or departmentId
    if (!parsed.data.recipientId && !parsed.data.departmentId) {
      return NextResponse.json(
        { error: 'Either recipientId or departmentId is required' },
        { status: 400 }
      );
    }

    // Validate recipient exists if provided
    if (parsed.data.recipientId) {
      const recipient = await prisma.user.findUnique({
        where: { id: parsed.data.recipientId },
        select: { id: true },
      });
      if (!recipient) {
        return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
      }
    }

    // Validate department exists if provided
    if (parsed.data.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: parsed.data.departmentId },
        select: { id: true },
      });
      if (!department) {
        return NextResponse.json({ error: 'Department not found' }, { status: 404 });
      }
    }

    const message = await prisma.internalMessage.create({
      data: {
        senderId: auth.user.id,
        recipientId: parsed.data.recipientId || null,
        departmentId: parsed.data.departmentId || null,
        subject: parsed.data.subject,
        content: parsed.data.content,
        priority: parsed.data.priority,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        recipient: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Send internal message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/internal-messages - Mark messages as read
export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { ids, markAll } = body;

    if (markAll) {
      await prisma.internalMessage.updateMany({
        where: { recipientId: auth.user.id, isRead: false },
        data: { isRead: true },
      });
    } else if (Array.isArray(ids) && ids.length > 0) {
      await prisma.internalMessage.updateMany({
        where: {
          id: { in: ids },
          recipientId: auth.user.id,
        },
        data: { isRead: true },
      });
    } else {
      return NextResponse.json({ error: 'Provide ids array or markAll: true' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark internal messages read error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/internal-messages?id=xxx - Delete internal message
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
      return NextResponse.json({ error: 'id query param required' }, { status: 400 });
    }

    // Only sender can delete their own message
    const message = await prisma.internalMessage.findUnique({ where: { id } });
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    if (message.senderId !== auth.user.id && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only sender or SUPER_ADMIN can delete' }, { status: 403 });
    }

    await prisma.internalMessage.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete internal message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
