import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function autoCompleteProjects() {
  console.log('Checking for projects awaiting auto-completion...');
  
  const now = new Date();
  
  try {
    // Find projects in DELIVERED status that have passed their review deadline
    const expiredProjects = await prisma.project.findMany({
      where: {
        status: 'DELIVERED',
        reviewDeadline: {
          lt: now,
        },
      },
      include: {
        request: true,
        company: {
          include: {
            user: true
          }
        },
      },
    });

    console.log(`Found ${expiredProjects.length} expired projects.`);

    for (const project of expiredProjects) {
      if (!project.requestId || !project.request) continue;

      console.log(`Auto-completing project: ${project.id} (Request: ${project.requestId})`);

      await prisma.$transaction([
        // 1. Update Project status
        prisma.project.update({
          where: { id: project.id },
          data: {
            status: 'COMPLETED',
            completedAt: now,
            isAutoCompleted: true,
          },
        }),
        
        // 2. Update Request status
        prisma.serviceRequest.update({
          where: { id: project.requestId },
          data: {
            status: 'COMPLETED',
            isActive: false,
          },
        }),

        // 3. Notify User
        prisma.notification.create({
          data: {
            userId: project.request.userId,
            type: 'PROJECT_AUTO_COMPLETED',
            title: 'Project Automatically Completed',
            message: `Your project "${project.request.title}" has been automatically marked as completed because the review period expired.`,
            data: {
              requestId: project.requestId,
              projectId: project.id,
            },
          },
        }),

        // 4. Notify Company
        prisma.notification.create({
          data: {
            userId: project.company.userId,
            type: 'PROJECT_AUTO_COMPLETED',
            title: 'Project Automatically Completed',
            message: `The project "${project.request.title}" has been automatically marked as completed by the system.`,
            metadata: {
              requestId: project.requestId,
              projectId: project.id,
            },
          },
        }),
      ]);
    }

    if (expiredProjects.length > 0) {
      console.log('Successfully auto-completed all expired projects.');
    } else {
      console.log('No projects required auto-completion.');
    }
  } catch (error) {
    console.error('Error during auto-completion process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

autoCompleteProjects();
