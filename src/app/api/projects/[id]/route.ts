import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const updateProjectSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(20).max(5000).optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().min(0).optional(),
  progress: z.number().min(0).max(100).optional(),
});

// Valid status transitions for project lifecycle
const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  'PENDING': ['ACTIVE', 'CANCELLED'],
  'ACTIVE': ['ON_HOLD', 'COMPLETED', 'CANCELLED'],
  'ON_HOLD': ['ACTIVE', 'CANCELLED'],
  'COMPLETED': [], // Terminal state
  'CANCELLED': [], // Terminal state
};

// GET /api/projects/[id] - Get project details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;
    const { id } = params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
        company: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        request: true,
        milestones: {
          orderBy: { dueDate: 'asc' },
        },
        files: true,
        messages: {
          include: {
            sender: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
          take: 50,
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check access
    const company = await prisma.company.findUnique({
      where: { userId: user.id },
    });

    if (
      project.userId !== user.id &&
      project.companyId !== company?.id &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;
    const { id } = params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check access
    const company = await prisma.company.findUnique({
      where: { userId: user.id },
    });

    if (
      project.userId !== user.id &&
      project.companyId !== company?.id &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);

    // Validate status transitions
    if (validatedData.status) {
      const currentStatus = project.status;
      const allowed = VALID_STATUS_TRANSITIONS[currentStatus] || [];
      if (!allowed.includes(validatedData.status)) {
        return NextResponse.json(
          { error: `Cannot transition from ${currentStatus} to ${validatedData.status}` },
          { status: 400 }
        );
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...validatedData,
        startDate: validatedData.startDate
          ? new Date(validatedData.startDate)
          : undefined,
        endDate: validatedData.endDate
          ? new Date(validatedData.endDate)
          : undefined,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        company: true,
      },
    });

    // If completed, also update the linked service request
    if (validatedData.status === 'COMPLETED' && project.requestId) {
      await prisma.serviceRequest.update({
        where: { id: project.requestId },
        data: { status: 'COMPLETED' },
      });
    }

    // If cancelled, reopen the request
    if (validatedData.status === 'CANCELLED' && project.requestId) {
      await prisma.serviceRequest.update({
        where: { id: project.requestId },
        data: { status: 'CANCELLED' },
      });
    }

    // Notify the other party about status change
    if (validatedData.status) {
      const notifyUserId =
        project.userId === user.id ? project.companyId : project.userId;
      const companyUser = await prisma.company.findUnique({
        where: { id: notifyUserId },
      });

      await prisma.notification.create({
        data: {
          userId: companyUser?.userId || notifyUserId,
          type: 'PROJECT',
          title: 'Project Update',
          message: `Project "${project.title}" status changed to ${validatedData.status}`,
          data: { projectId: project.id },
        },
      });
    }

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;
    const { id } = params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Only admin or project owner can delete
    if (
      project.userId !== user.id &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
