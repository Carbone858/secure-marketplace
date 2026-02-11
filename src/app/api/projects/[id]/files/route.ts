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

    const files = await prisma.projectFile.findMany({
      where: { projectId: params.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const uploadFileSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().url(),
  type: z.string().optional(),
  size: z.number().optional(),
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
    const parsed = uploadFileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    const file = await prisma.projectFile.create({
      data: {
        ...parsed.data,
        projectId: params.id,
        uploadedBy: auth.user.id,
      },
    });

    return NextResponse.json({ file }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    const file = await prisma.projectFile.findFirst({
      where: { id: fileId, projectId: params.id },
    });
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Only uploader or project owner can delete
    if (file.uploadedBy !== auth.user.id) {
      const project = await checkProjectAccess(params.id, auth.user.id);
      if (!project) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    await prisma.projectFile.delete({ where: { id: fileId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
