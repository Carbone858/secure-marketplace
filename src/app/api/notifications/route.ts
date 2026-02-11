import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    const where: any = {
      userId: user.id,
    };

    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId: user.id } }),
      prisma.notification.count({
        where: { userId: user.id, isRead: false },
      }),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;
    const body = await request.json();
    const { ids, markAll } = body;

    if (markAll) {
      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          isRead: false,
        },
        data: { isRead: true },
      });
    } else if (ids && Array.isArray(ids)) {
      await prisma.notification.updateMany({
        where: {
          id: { in: ids },
          userId: user.id,
        },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const deleteAll = searchParams.get('all') === 'true';

    if (deleteAll) {
      await prisma.notification.deleteMany({
        where: { userId: user.id },
      });
      return NextResponse.json({ message: 'All notifications deleted' });
    }

    if (id) {
      await prisma.notification.deleteMany({
        where: {
          id,
          userId: user.id,
        },
      });
      return NextResponse.json({ message: 'Notification deleted' });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Delete notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
