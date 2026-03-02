/**
 * PUT /api/admin/requests/[id]/reject
 *
 * Admin-only: Rejects a pending service request, sets status → CANCELLED,
 * writes a ProjectAuditLog entry, and sends the user a rejection email.
 */
import { NextRequest, NextResponse } from 'next/server';
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

        // Guard: only PENDING can be rejected by admin (CANCELLED = terminal)
        try {
            assertValidRequestTransition(serviceRequest.status as RequestStatus, 'CANCELLED');
        } catch (err) {
            if (err instanceof InvalidTransitionError) {
                return NextResponse.json({ error: err.message }, { status: 409 });
            }
            throw err;
        }

        // Reject
        const updated = await prisma.serviceRequest.update({
            where: { id },
            data: { status: 'CANCELLED', isActive: false },
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

        // Email notification (non-blocking)
        if (serviceRequest.user?.email) {
            const locale = serviceRequest.tags?.includes('lang:ar') ? 'ar' : 'en';
            sendRejectionNotification({
                userEmail: serviceRequest.user.email,
                userName: serviceRequest.user.name || 'User',
                requestTitle: serviceRequest.title,
                locale,
                reason,
            }).catch(() => { });

            // In-app notification
            prisma.notification.create({
                data: {
                    userId: serviceRequest.user.id,
                    type: 'SYSTEM',
                    title: locale === 'ar' ? 'لم تتم الموافقة على طلبك' : 'Project Request Not Approved',
                    message: locale === 'ar'
                        ? `لم تتم الموافقة على طلبك "${serviceRequest.title}".${reason ? ' السبب: ' + reason : ''}`
                        : `Your project "${serviceRequest.title}" was not approved.${reason ? ' Reason: ' + reason : ''}`,
                    data: { requestId: id },
                },
            }).catch(() => { });
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
