import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const pageSchema = z.object({
  title: z.string().min(1).max(200),
  titleAr: z.string().optional(),
  slug: z.string().min(1).max(100),
  content: z.string(),
  contentAr: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  isPublished: z.boolean().default(true),
});

// GET /api/cms/pages - Get all pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const publishedOnly = searchParams.get('publishedOnly') !== 'false';

    if (slug) {
      const page = await prisma.cMSPage.findUnique({
        where: {
          slug,
          ...(publishedOnly && { isPublished: true }),
        },
      });

      if (!page) {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ page });
    }

    const pages = await prisma.cMSPage.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Get CMS pages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cms/pages - Create a new page (Admin only)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = pageSchema.parse(body);

    // Check if slug already exists
    const existingPage = await prisma.cMSPage.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    const page = await prisma.cMSPage.create({
      data: {
        ...validatedData,
        createdBy: user.id,
      },
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create CMS page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
