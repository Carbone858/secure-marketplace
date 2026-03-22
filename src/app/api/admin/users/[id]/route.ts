export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, requirePermission } from '@/lib/auth-middleware';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;

    const forbidden = requirePermission(auth.user, 'manage_users');
    if (forbidden) return forbidden;

    const userDetails = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        staffMember: {
          include: {
            role: true,
            department: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            verificationStatus: true
          }
        },
        _count: {
          select: {
            requests: true,
            projects: true,
            reviews: true,
            messagesSent: true
          }
        }
      }
    });

    if (!userDetails) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user recent activity (requests)
    const recentRequests = await prisma.serviceRequest.findMany({
      where: { userId: params.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json({ user: userDetails, recentRequests });
  } catch (error) {
    console.error('User details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
