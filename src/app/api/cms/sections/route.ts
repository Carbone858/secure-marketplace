import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { z } from 'zod';

const createSectionSchema = z.object({
  name: z.string().min(1).max(100),
  identifier: z.string().min(1).max(100).regex(/^[a-z0-9_-]+$/),
  page: z.string().min(1).max(50).default('home'),
  content: z.record(z.any()),
  isActive: z.boolean().default(true),
});

const updateSectionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  content: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/cms/sections - Get CMS sections (public for active, all for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page'); // filter by page (e.g., 'home', 'about')
    const identifier = searchParams.get('identifier'); // Get single section

    // Check if admin for showing inactive
    let showAll = false;
    try {
      const auth = await authenticateRequest(request);
      if (!(auth instanceof NextResponse) && (auth.user.role === 'ADMIN' || auth.user.role === 'SUPER_ADMIN')) {
        showAll = true;
      }
    } catch { /* public access */ }

    if (identifier) {
      const section = await prisma.cMSSection.findUnique({
        where: { identifier },
      });
      if (!section || (!section.isActive && !showAll)) {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 });
      }
      return NextResponse.json({ section });
    }

    const where: any = {};
    if (!showAll) where.isActive = true;
    if (page) where.page = page;

    const sections = await prisma.cMSSection.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Get CMS sections error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/cms/sections - Create section (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createSectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    // Check unique identifier
    const existing = await prisma.cMSSection.findUnique({
      where: { identifier: parsed.data.identifier },
    });
    if (existing) {
      return NextResponse.json({ error: 'Identifier already exists' }, { status: 409 });
    }

    const section = await prisma.cMSSection.create({
      data: parsed.data,
    });

    return NextResponse.json({ section }, { status: 201 });
  } catch (error) {
    console.error('Create CMS section error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
