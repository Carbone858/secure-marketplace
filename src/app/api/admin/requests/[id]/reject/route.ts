/**
 * PUT /api/admin/requests/[id]/reject
 *
 * Admin-only: Rejects a pending service request, sets status → REJECTED,
 * stores the rejection reason, writes a ProjectAuditLog entry,
 * and sends the user a rejection notification + email.
 */
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { sendRejectionNotification } from '@/lib/requests/approval-notifications';
import { z } from 'zod';
import {
    assertValidRequestTransition,
    InvalidTransitionError,
    type RequestStatus,
} from '@/lib/state-machine';

const rejectSchema = z.object({
    reason: z.string().max(1000).optional(),
});

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

        // Parse optional reason body
        let reason: string | undefined;
        try {
            const body = await request.json();
            const parsed = rejectSchema.safeParse(body);
            if (parsed.success) reason = parsed.data.reason;
        } catch {
            // Body is optional
        }

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

        // Guard: only PENDING can be rejected by admin
        try {
            assertValidRequestTransition(serviceRequest.status as RequestStatus, 'REJECTED');
        } catch (err) {
            if (err instanceof InvalidTransitionError) {
                return NextResponse.json({ error: err.message }, { status: 409 });
            }
            throw err;
        }

        // Reject — keep isActive true so the owner can still see and edit it
        const updated = await prisma.serviceRequest.update({
            where: { id },
            data: {
                status: 'REJECTED',
                isActive: true,
                rejectionReason: reason ?? null,
                rejectedAt: new Date(),
            },
        });

        // Audit log
        await (prisma as any).projectAuditLog.create({
            data: {
                requestId: id,
                adminId: session.user.id,
                action: 'REJECTED',
                reason: reason ?? null,
            },
        });

        // In-app notification (non-blocking)
        if (serviceRequest.user) {
            const locale = serviceRequest.tags?.includes('lang:ar') ? 'ar' : 'en';

            prisma.notification.create({
                data: {
                    userId: serviceRequest.user.id,
                    type: 'SYSTEM',
                    title: locale === 'ar' ? 'تم رفض طلبك' : 'Your Request Was Rejected',
                    message: locale === 'ar'
                        ? `تم رفض طلبك "${serviceRequest.title}".${reason ? ' السبب: ' + reason : ' يمكنك تعديله وإعادة تقديمه.'}`
                        : `Your request "${serviceRequest.title}" was rejected.${reason ? ' Reason: ' + reason : ' You can edit and resubmit it.'}`,
                    data: { requestId: id },
                },
            }).catch(() => { });

            // Email notification (non-blocking)
            if (serviceRequest.user.email) {
                sendRejectionNotification({
                    userEmail: serviceRequest.user.email,
                    userName: serviceRequest.user.name || 'User',
                    requestTitle: serviceRequest.title,
                    locale,
                    reason,
                }).catch(() => { });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Request rejected successfully.',
            request: updated,
        });
    } catch (error: any) {
        console.error('[ADMIN REJECT] ERROR:', error?.message, error?.stack);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
