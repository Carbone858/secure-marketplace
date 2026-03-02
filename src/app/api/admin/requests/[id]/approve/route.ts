/**
 * PUT /api/admin/requests/[id]/approve
 *
 * Admin-only: Approves a pending service request, sets status → ACTIVE,
 * writes a ProjectAuditLog entry, and sends the user an approval email.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { sendApprovalNotification } from '@/lib/requests/approval-notifications';
import { invalidateFlagCache } from '@/lib/feature-flags';
import {
    assertValidRequestTransition,
    InvalidTransitionError,
    type RequestStatus,
} from '@/lib/state-machine';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();

        if (!session.isAuthenticated || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const role = session.user.role;
        if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden. Admins only.' }, { status: 403 });
        }

        const { id } = params;

        // Fetch the request + owner
        const serviceRequest = await prisma.serviceRequest.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });

        if (!serviceRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Guard transition via state machine
        try {
            assertValidRequestTransition(serviceRequest.status as RequestStatus, 'ACTIVE');
        } catch (err) {
            if (err instanceof InvalidTransitionError) {
                return NextResponse.json({ error: err.message }, { status: 409 });
            }
            throw err;
        }

        // Approve
        const updated = await prisma.serviceRequest.update({
            where: { id },
            data: { status: 'ACTIVE', isActive: true },
        });

        // Audit log
        await (prisma as any).projectAuditLog.create({
            data: {
                requestId: id,
                adminId: session.user.id,
                action: 'APPROVED',
            },
        });

        // Email notification (non-blocking)
        if (serviceRequest.user?.email) {
            const locale = serviceRequest.tags?.includes('lang:ar') ? 'ar' : 'en';
            sendApprovalNotification({
                userEmail: serviceRequest.user.email,
                userName: serviceRequest.user.name || 'User',
                requestTitle: serviceRequest.title,
                locale,
            }).catch(() => { });

            // In-app notification (Bug fix - add missing notification)
            prisma.notification.create({
                data: {
                    userId: serviceRequest.user.id,
                    type: 'SYSTEM',
                    title: locale === 'ar' ? 'تمت الموافقة على طلبك' : 'Project Request Approved',
                    message: locale === 'ar'
                        ? `تمت الموافقة على طلبك "${serviceRequest.title}". يمكنك الآن استقبال العروض من الشركات.`
                        : `Your project "${serviceRequest.title}" has been approved. You can now receive offers from companies.`,
                    data: { requestId: id },
                },
            }).catch(() => { });
        }

        return NextResponse.json({
            success: true,
            message: 'Request approved successfully.',
            request: updated,
        });
    } catch (error: any) {
        console.error('[ADMIN APPROVE] ERROR:', error?.message, error?.stack);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
