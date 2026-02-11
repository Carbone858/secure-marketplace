import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

async function checkProjectAccess(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { company: { select: { userId: true } } },
  });
  if (!project) return null;
  if (project.userId !== userId && project.company?.userId !== userId) return null;
  return project;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const project = await checkProjectAccess(params.id, auth.user.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { projectId: params.id },
        include: { sender: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.message.count({ where: { projectId: params.id } }),
    ]);

    return NextResponse.json({
      messages,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const project = await checkProjectAccess(params.id, auth.user.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    // Determine recipient: if sender is project owner, recipient is company owner; otherwise vice versa
    const recipientId = auth.user.id === project.userId 
      ? project.company?.userId || project.userId
      : project.userId;

    const message = await prisma.message.create({
      data: {
        content: parsed.data.content,
        projectId: params.id,
        senderId: auth.user.id,
        recipientId,
      },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
