import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const messageSchema = z.object({
  recipientId: z.string(),
  content: z.string().min(1).max(5000),
  projectId: z.string().optional(),
  requestId: z.string().optional(),
});

// GET /api/messages - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;
    const { searchParams } = new URL(request.url);
    const conversationWith = searchParams.get('with');

    if (conversationWith) {
      // Get conversation with specific user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: user.id, recipientId: conversationWith },
            { senderId: conversationWith, recipientId: user.id },
          ],
        },
        include: {
          sender: {
            select: {
              name: true,
              avatar: true,
            },
          },
          recipient: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          recipientId: user.id,
          senderId: conversationWith,
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({ messages });
    }

    // Get all conversations
    const conversations = await prisma.message.findMany({
      where: {
        OR: [{ senderId: user.id }, { recipientId: user.id }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by conversation partner
    const conversationMap = new Map();
    conversations.forEach((msg) => {
      const partnerId = msg.senderId === user.id ? msg.recipientId : msg.senderId;
      const partner = msg.senderId === user.id ? msg.recipient : msg.sender;

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partner,
          lastMessage: msg,
          unreadCount: msg.recipientId === user.id && !msg.isRead ? 1 : 0,
        });
      } else if (msg.recipientId === user.id && !msg.isRead) {
        const conv = conversationMap.get(partnerId);
        conv.unreadCount++;
      }
    });

    return NextResponse.json({
      conversations: Array.from(conversationMap.values()),
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;

    const body = await request.json();
    const validatedData = messageSchema.parse(body);

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // STRICT ENFORCEMENT: Messaging globally locked unless part of an accepted pair (ACTIVE/COMPLETED project)
    let validPair = false;
    let isReadOnly = false;

    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      validPair = true;
    } else {
      const projects = await prisma.project.findMany({
        where: {
          OR: [
            { userId: user.id, company: { userId: recipient.id } },
            { userId: recipient.id, company: { userId: user.id } },
          ],
        },
        include: { request: true },
      });

      if (projects.length > 0) {
        const hasActiveOrCompleted = projects.some(p => ['ACTIVE', 'COMPLETED', 'ON_HOLD'].includes(p.status));
        if (hasActiveOrCompleted) {
          validPair = true;
          // If EVERYTHING is completed, it's read-only
          const allCompleted = projects.every(p => p.status === 'COMPLETED' || p.request?.status === 'COMPLETED');
          if (allCompleted) {
            isReadOnly = true;
          }
        }
      }
    }

    if (!validPair) {
      return NextResponse.json(
        { error: 'forbidden', message: 'Messaging is only allowed between users with an accepted project together.' },
        { status: 403 }
      );
    }

    if (isReadOnly) {
      return NextResponse.json(
        { error: 'forbidden', message: 'All projects between you and this user are completed. Communication is now read-only.' },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        recipientId: validatedData.recipientId,
        content: validatedData.content,
        projectId: validatedData.projectId,
        requestId: validatedData.requestId,
      },
      include: {
        sender: {
          select: {
            name: true,
            avatar: true,
          },
        },
        recipient: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: validatedData.recipientId,
        type: 'MESSAGE',
        title: 'New Message',
        message: `You have a new message from ${user.name}`,
        data: { messageId: message.id, senderId: user.id },
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
