import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth-session/session';

/**
 * POST /api/requests/[id]/confirm
 * Handled by the User (Client) to approve or reject the company's work.
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();

        if (!session.isAuthenticated || !session.user) {
            return NextResponse.json({ error: 'unauthorized', message: 'You must be logged in.' }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();
        const { action, rating, review, feedback } = body;

        const serviceRequest = await prisma.serviceRequest.findUnique({
            where: { id },
            include: {
                projects: {
                    include: { company: true },
                },
            },
        });

        if (!serviceRequest) {
            return NextResponse.json({ error: 'request.notFound', message: 'Request not found.' }, { status: 404 });
        }

        const project = serviceRequest.projects[0];

        if (!project) {
            return NextResponse.json({ error: 'project.notFound', message: 'No active project found.' }, { status: 404 });
        }

        const isOwner = session.user.id === serviceRequest.userId;
        const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: 'forbidden', message: 'Only the client can confirm this work.' }, { status: 403 });
        }

        if (serviceRequest.status !== 'UNDER_REVIEW') {
            return NextResponse.json({ error: 'invalid.status', message: 'This project is not awaiting review.' }, { status: 400 });
        }

        if (action === 'APPROVE') {
            if (!rating || rating < 1 || rating > 5) {
                return NextResponse.json({ error: 'rating.required', message: 'A valid rating (1-5) is required.' }, { status: 400 });
            }
            // If rating <= 2, review is required (Updated to match frontend)
            if (rating <= 2 && (!review || review.trim().length < 5)) {
                return NextResponse.json({ error: 'review.required', message: 'Please provide a reason for the lower rating.' }, { status: 400 });
            }

            await prisma.$transaction([
                prisma.project.update({
                    where: { id: project.id },
                    data: {
                        status: 'COMPLETED',
                        completedByUser: true,
                        completedAt: new Date(),
                        rating: rating,
                        review: review,
                        progress: 100
                    },
                }),
                prisma.serviceRequest.update({
                    where: { id: serviceRequest.id },
                    data: { status: 'COMPLETED' },
                }),
                // Optionally update company rating here or via an async hook
                prisma.review.create({
                    data: {
                        companyId: project.companyId,
                        userId: serviceRequest.userId,
                        projectId: project.id,
                        rating: rating,
                        comment: review || '',
                    }
                })
            ]);

            // Notify Company
            await prisma.notification.create({
                data: {
                    userId: project.company.userId,
                    type: 'PROJECT_COMPLETED',
                    title: 'Project Completed & Rated',
                    message: `The client has approved your work for "${project.title}" and left a ${rating}-star review.`,
                    data: { projectId: project.id, requestId: id },
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Project successfully completed!',
                data: { status: 'COMPLETED' }
            });
        } 
        
        if (action === 'REJECT') {
            if (!feedback || feedback.trim().length < 5) {
                return NextResponse.json({ error: 'feedback.required', message: 'Please provide feedback for the company.' }, { status: 400 });
            }

            await prisma.$transaction([
                prisma.project.update({
                    where: { id: project.id },
                    data: {
                        status: 'ACTIVE',
                        completedByCompany: false,
                        progress: 75 // Show it's back in work
                    },
                }),
                prisma.serviceRequest.update({
                    where: { id: serviceRequest.id },
                    data: { status: 'IN_PROGRESS' },
                }),
            ]);

            // Notify Company
            await prisma.notification.create({
                data: {
                    userId: project.company.userId,
                    type: 'PROJECT_CHANGES_REQUESTED',
                    title: 'Changes Requested',
                    message: `The client has reviewed your work and requested changes: "${feedback}"`,
                    metadata: { projectId: project.id, requestId: id },
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Changes requested. The project is back in progress.',
                data: { status: 'IN_PROGRESS' }
            });
        }

        return NextResponse.json({ error: 'invalid.action', message: 'Invalid confirmation action.' }, { status: 400 });

    } catch (error: any) {
        console.error('[PUT /api/requests/[id]/confirm] ERROR:', error?.message);
        return NextResponse.json(
            { success: false, error: 'server.error', message: 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}
