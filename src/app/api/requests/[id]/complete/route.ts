import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { assertValidRequestTransition, InvalidTransitionError, type RequestStatus } from '@/lib/state-machine';

/**
 * PUT /api/requests/[id]/complete
 * Initiated by the Company to mark work as finished.
 * Transitions status: IN_PROGRESS -> UNDER_REVIEW
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();

        if (!session.isAuthenticated || !session.user) {
            return NextResponse.json({ error: 'unauthorized', message: 'You must be logged in.' }, { status: 401 });
        }

        const { id } = params;

        const serviceRequest = await prisma.serviceRequest.findUnique({
            where: { id },
            include: {
                projects: {
                    include: { company: true },
                },
                user: true,
            },
        });

        if (!serviceRequest) {
            return NextResponse.json({ error: 'request.notFound', message: 'Request not found.' }, { status: 404 });
        }

        const project = serviceRequest.projects[0];

        if (!project) {
            return NextResponse.json({ error: 'project.notFound', message: 'No active project found for this request.' }, { status: 404 });
        }

        const isCompany = session.user.id === project.company.userId;
        const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';

        if (!isCompany && !isAdmin) {
            return NextResponse.json({ error: 'forbidden', message: 'Only the company or an admin can mark the project as finished.' }, { status: 403 });
        }

        // If company marks as finished
        if (isCompany && !isAdmin) {
            // Guard transition: Must be in a state that can be delivered
            const currentStatus = serviceRequest.status as RequestStatus;
            if (currentStatus !== 'IN_PROGRESS' && currentStatus !== 'ACCEPTED' && currentStatus !== 'ACTIVE') {
                 return NextResponse.json({ error: 'invalid.status', message: 'This project is not in a state that can be marked as finished.' }, { status: 400 });
            }

            const reviewDeadline = new Date();
            reviewDeadline.setDate(reviewDeadline.getDate() + 10); // 10 days timeout

            await prisma.$transaction([
                prisma.project.update({
                    where: { id: project.id },
                    data: { 
                        status: 'DELIVERED', 
                        completedByCompany: true,
                        deliveredAt: new Date(),
                        reviewDeadline: reviewDeadline,
                        progress: 90 // Visual indicator it's almost done
                    },
                }),
                prisma.serviceRequest.update({
                    where: { id: serviceRequest.id },
                    data: { status: 'UNDER_REVIEW' },
                }),
            ]);

            // Notify User
            await prisma.notification.create({
                data: {
                    userId: serviceRequest.userId,
                    type: 'PROJECT_DELIVERED',
                    title: 'Project Delivered - Review Required',
                    message: `The company has marked the project "${project.title}" as finished. You have 10 days to review and confirm. After that, it will be automatically completed.`,
                    data: { 
                        projectId: project.id, 
                        requestId: id, 
                        action: 'CONFIRM_COMPLETION',
                        deadline: reviewDeadline
                    },
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Project marked as delivered. Waiting for client review.',
                data: { status: 'UNDER_REVIEW', reviewDeadline }
            });
        }

        // Admin force complete
        if (isAdmin) {
            await prisma.$transaction([
                prisma.project.update({
                    where: { id: project.id },
                    data: { 
                        status: 'COMPLETED', 
                        completedByCompany: true, 
                        completedByUser: true,
                        completedAt: new Date(),
                        progress: 100 
                    },
                }),
                prisma.serviceRequest.update({
                    where: { id: serviceRequest.id },
                    data: { status: 'COMPLETED' },
                }),
            ]);

            return NextResponse.json({
                success: true,
                message: 'Project force-completed by admin.',
                data: { status: 'COMPLETED' }
            });
        }

        return NextResponse.json({ error: 'invalid.action', message: 'Invalid completion action.' }, { status: 400 });

    } catch (error: any) {
        console.error('[PUT /api/requests/[id]/complete] ERROR:', error?.message);
        return NextResponse.json(
            { success: false, error: 'server.error', message: 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}
