import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';
import { assertValidRequestTransition, InvalidTransitionError, type RequestStatus } from '@/lib/state-machine';

/**
 * PUT /api/requests/[id]/complete
 * Initiates or Confirms project completion.
 * Requires both User and Company to confirm.
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

        const isOwner = session.user.id === serviceRequest.userId;
        const isCompany = session.user.id === project.company.userId;
        const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';

        if (!isOwner && !isCompany && !isAdmin) {
            return NextResponse.json({ error: 'forbidden', message: 'You are not part of this project.' }, { status: 403 });
        }

        // Guard transition
        try {
            assertValidRequestTransition(serviceRequest.status as RequestStatus, 'COMPLETED');
        } catch (err) {
            if (err instanceof InvalidTransitionError) {
                return NextResponse.json({ error: err.errorCode, message: 'This project is not in a state that can be completed.' }, { status: 400 });
            }
            throw err;
        }

        // Determine flag updates
        const updateData: any = {};
        if (isOwner) updateData.completedByUser = true;
        if (isCompany) updateData.completedByCompany = true;
        if (isAdmin) {
            // Admins can force complete
            updateData.completedByUser = true;
            updateData.completedByCompany = true;
        }

        const updatedProject = await prisma.project.update({
            where: { id: project.id },
            data: updateData,
        });

        const isFullyCompleted = (updatedProject as any).completedByUser && (updatedProject as any).completedByCompany;

        if (isFullyCompleted) {
            // Transition both project and request to COMPLETED
            await prisma.$transaction([
                prisma.project.update({
                    where: { id: project.id },
                    data: { status: 'COMPLETED', progress: 100 },
                }),
                prisma.serviceRequest.update({
                    where: { id: serviceRequest.id },
                    data: { status: 'COMPLETED' },
                }),
            ]);

            // Notify both parties
            const notifyUser = prisma.notification.create({
                data: {
                    userId: project.userId,
                    type: 'SYSTEM',
                    title: 'Project Completed',
                    message: `The project "${project.title}" has been marked as completed successfully!`,
                    data: { projectId: project.id, requestId: id },
                },
            });

            const notifyCompany = prisma.notification.create({
                data: {
                    userId: project.company.userId,
                    type: 'SYSTEM',
                    title: 'Project Completed',
                    message: `The project "${project.title}" has been marked as completed successfully!`,
                    data: { projectId: project.id, requestId: id },
                },
            });

            await Promise.allSettled([notifyUser, notifyCompany]);

            return NextResponse.json({
                success: true,
                message: 'Project is now fully completed.',
                data: { project: updatedProject, status: 'COMPLETED' },
            });
        }

        // Single-sided initiation
        const waitingOn = isOwner ? 'the company' : 'the client';
        return NextResponse.json({
            success: true,
            message: `Completion initiated. Waiting for ${waitingOn} to confirm.`,
            data: { project: updatedProject, status: 'WAITING_CONFIRMATION' },
        });

    } catch (error: any) {
        console.error('[PUT /api/requests/[id]/complete] ERROR:', error?.message);
        return NextResponse.json(
            { success: false, error: 'server.error', message: 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}
