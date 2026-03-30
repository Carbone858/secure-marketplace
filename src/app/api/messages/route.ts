export const dynamic = 'force-dynamic';
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

    // Fetch all relevant projects once to provide context for conversations
    const userProjects = await prisma.project.findMany({
      where: {
        OR: [
          { userId: user.id },
          { company: { userId: user.id } }
        ]
      },
      include: {
        company: {
          select: { id: true, name: true, logo: true, userId: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

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
              image: true,
            },
          },
          recipient: {
            select: {
              name: true,
              avatar: true,
              image: true,
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

      // Find relevant project for this specific context
      const contextProject = userProjects.find(p => 
        (p.userId === user.id && p.company.userId === conversationWith) ||
        (p.userId === conversationWith && p.company.userId === user.id)
      );

      return NextResponse.json({ 
        messages,
        contextProject: contextProject ? {
            id: contextProject.id,
            title: contextProject.title,
            status: contextProject.status,
            companyName: contextProject.company.name
        } : null
      });
    }

    // Get all conversations
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: user.id }, { recipientId: user.id }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            image: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            avatar: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by conversation partner
    const conversationMap = new Map();
    messages.forEach((msg) => {
      const partnerId = msg.senderId === user.id ? msg.recipientId : msg.senderId;
      const partner = msg.senderId === user.id ? msg.recipient : msg.sender;

      // Ensure partner has an 'image' field for the frontend
      const partnerData = {
        ...partner,
        image: partner.image || partner.avatar
      };

      if (!conversationMap.has(partnerId)) {
        // Find best matching project for this partner context
        const partnerProject = userProjects.find(p => 
            (p.userId === user.id && p.company.userId === partnerId) ||
            (p.userId === partnerId && p.company.userId === user.id)
        );

        conversationMap.set(partnerId, {
          partner: partnerData,
          lastMessage: msg,
          unreadCount: msg.recipientId === user.id && !msg.isRead ? 1 : 0,
          projectContext: partnerProject ? {
            id: partnerProject.id,
            title: partnerProject.title,
            status: partnerProject.status,
            companyName: partnerProject.company.name
          } : null
        });
      } else if (msg.recipientId === user.id && !msg.isRead) {
        const conv = conversationMap.get(partnerId);
        conv.unreadCount++;
      }
    });

    const ensureUserId = searchParams.get('ensure');
    if (ensureUserId && !conversationMap.has(ensureUserId)) {
      const ensureUser = await prisma.user.findUnique({
        where: { id: ensureUserId },
        select: { id: true, name: true, avatar: true, image: true },
      });
      if (ensureUser) {
        const partnerProject = userProjects.find(p => 
            (p.userId === user.id && p.company.userId === ensureUserId) ||
            (p.userId === ensureUserId && p.company.userId === user.id)
        );

        conversationMap.set(ensureUserId, {
          partner: { ...ensureUser, image: ensureUser.image || ensureUser.avatar },
          lastMessage: { content: '', senderId: '', recipientId: '', createdAt: new Date() },
          unreadCount: 0,
          projectContext: partnerProject ? {
            id: partnerProject.id,
            title: partnerProject.title,
            status: partnerProject.status,
            companyName: partnerProject.company.name
          } : null
        });
      }
    }

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

    const recipient = await prisma.user.findUnique({
      where: { id: validatedData.recipientId },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // STRICT ENFORCEMENT: Messaging globally locked unless part of an accepted pair (ACTIVE/DELIVERED/COMPLETED project)
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
        // Allow messaging for ACTIVE, ON_HOLD, DELIVERED, and UNDER_REVIEW projects
        const hasActiveOrCompleted = projects.some(p => 
          ['ACTIVE', 'COMPLETED', 'ON_HOLD', 'DELIVERED', 'UNDER_REVIEW'].includes(p.status)
        );
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
            image: true,
          },
        },
        recipient: {
          select: {
            name: true,
            avatar: true,
            image: true,
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
