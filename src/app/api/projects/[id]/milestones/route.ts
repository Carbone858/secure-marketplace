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

async function isMilestoneEnabled() {
  const flag = await prisma.featureFlag.findUnique({ where: { key: 'isMilestoneEnabled' } });
  return flag?.value === true;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const project = await checkProjectAccess(params.id, auth.user.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    const milestones = await prisma.projectMilestone.findMany({
      where: { projectId: params.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ milestones });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const createMilestoneSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

const updateMilestoneSchema = z.object({
  milestoneId: z.string(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const enabled = await isMilestoneEnabled();
    if (!enabled) {
      return NextResponse.json({ error: 'Milestone feature is not enabled' }, { status: 403 });
    }

    const project = await checkProjectAccess(params.id, auth.user.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createMilestoneSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    const milestone = await prisma.projectMilestone.create({
      data: {
        ...parsed.data,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
        projectId: params.id,
      },
    });

    return NextResponse.json({ milestone }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/projects/[id]/milestones - Update a milestone
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const project = await checkProjectAccess(params.id, auth.user.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateMilestoneSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    // Verify milestone belongs to this project
    const existing = await prisma.projectMilestone.findFirst({
      where: { id: parsed.data.milestoneId, projectId: params.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    const { milestoneId, ...updateData } = parsed.data;
    const milestone = await prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        ...updateData,
        dueDate: updateData.dueDate ? new Date(updateData.dueDate) : undefined,
      },
    });

    return NextResponse.json({ milestone });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/milestones?milestoneId=xxx - Delete a milestone
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const project = await checkProjectAccess(params.id, auth.user.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const milestoneId = searchParams.get('milestoneId');
    if (!milestoneId) {
      return NextResponse.json({ error: 'milestoneId query param required' }, { status: 400 });
    }

    // Verify milestone belongs to this project
    const existing = await prisma.projectMilestone.findFirst({
      where: { id: milestoneId, projectId: params.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    await prisma.projectMilestone.delete({ where: { id: milestoneId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
