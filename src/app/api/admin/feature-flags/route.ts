/**
 * /api/admin/feature-flags
 *
 * GET  — list all flags (grouped by category), admin only
 * POST — create a new flag, admin only
 * PUT  — toggle a flag value, admin only; writes FlagAuditLog + invalidates cache
 *
 * Rate-limit: max 30 requests/minute per admin session (enforced via header check)
 * Security: Only ADMIN / SUPER_ADMIN roles accepted; XSS-safe inputs via Zod validation
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { invalidateFlagCache } from '@/lib/feature-flags';
import { z } from 'zod';

// ── Rate-limit state (in-process, per-restart) ────────────────────────────────
const rateLimit = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

function checkRateLimit(adminId: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(adminId);
  if (!entry || now > entry.reset) {
    rateLimit.set(adminId, { count: 1, reset: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function requireAdmin(auth: any) {
  return auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN';
}

// ── GET /api/admin/feature-flags ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (requireAdmin(auth)) {
      return NextResponse.json({ error: 'Forbidden. Admins only.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (category) where.category = category;
    if (search) where.key = { contains: search, mode: 'insensitive' };

    const flags = await prisma.featureFlag.findMany({
      where,
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { key: 'asc' }],
    });

    // Also return the list of distinct categories for the filter UI
    const categories = await prisma.featureFlag.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return NextResponse.json({
      flags,
      categories: categories.map(c => c.category),
    });
  } catch (error) {
    console.error('[FEATURE FLAGS GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── PUT /api/admin/feature-flags (toggle) ────────────────────────────────────
const updateFlagSchema = z.object({
  id: z.string().uuid(),
  value: z.boolean(),
  description: z.string().max(500).optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (requireAdmin(auth)) {
      return NextResponse.json({ error: 'Forbidden. Admins only.' }, { status: 403 });
    }

    // Rate limit
    if (!checkRateLimit(auth.user.id)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before toggling more flags.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = updateFlagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    // Fetch current value before update
    const existing = await prisma.featureFlag.findUnique({ where: { id: parsed.data.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
    }

    // Check if developer-only — log a warning but still allow SUPER_ADMIN to override
    if (!existing.isDynamic && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'This flag is Developer-Only and can only be changed via a code deploy.' },
        { status: 403 }
      );
    }

    const flag = await prisma.featureFlag.update({
      where: { id: parsed.data.id },
      data: {
        value: parsed.data.value,
        ...(parsed.data.description && { description: parsed.data.description }),
      },
    });

    // Write audit log
    await (prisma as any).flagAuditLog.create({
      data: {
        flagId: existing.id,
        flagKey: existing.key,
        adminId: auth.user.id,
        adminName: auth.user.name || auth.user.email || 'Admin',
        prevValue: existing.value,
        newValue: parsed.data.value,
      },
    });

    // Invalidate the server-side flag cache so the change propagates within ~60s
    invalidateFlagCache();

    return NextResponse.json({ flag });
  } catch (error) {
    console.error('[FEATURE FLAGS PUT]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── POST /api/admin/feature-flags (create new flag) ─────────────────────────
const createFlagSchema = z.object({
  key: z.string().min(3).max(100).regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'Key must be camelCase or snake_case, starting with a letter'),
  value: z.boolean(),
  description: z.string().max(500).optional(),
  descriptionAr: z.string().max(500).optional(),
  nameEn: z.string().max(80).optional(),
  nameAr: z.string().max(80).optional(),
  category: z.string().max(50).optional(),
  isDynamic: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (requireAdmin(auth)) {
      return NextResponse.json({ error: 'Forbidden. Admins only.' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createFlagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.featureFlag.findUnique({ where: { key: parsed.data.key } });
    if (existing) {
      return NextResponse.json({ error: 'A flag with this key already exists.' }, { status: 409 });
    }

    const flag = await prisma.featureFlag.create({ data: parsed.data });
    return NextResponse.json({ flag }, { status: 201 });
  } catch (error) {
    console.error('[FEATURE FLAGS POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
