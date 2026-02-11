import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const updatePageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  titleAr: z.string().optional(),
  content: z.string().optional(),
  contentAr: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  isPublished: z.boolean().optional(),
});

// GET /api/cms/pages/[id] - Get page by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const page = await prisma.cmsPage.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Get CMS page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/cms/pages/[id] - Update page (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = params;

    const page = await prisma.cmsPage.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updatePageSchema.parse(body);

    const updatedPage = await prisma.cmsPage.update({
      where: { id },
      data: {
        ...validatedData,
        updatedBy: user.id,
      },
    });

    return NextResponse.json({ page: updatedPage });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Update CMS page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/pages/[id] - Delete page (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = params;

    const page = await prisma.cmsPage.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    await prisma.cmsPage.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete CMS page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
