
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const latestRequest = await prisma.serviceRequest.findFirst({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      country: true,
      city: true,
    },
  });

  const autoApproveFlag = await prisma.featureFlag.findUnique({
    where: { key: 'isRequestAutoApproveEnabled' }
  });

  console.log('--- LATEST REQUEST ---');
  console.log(JSON.stringify(latestRequest, null, 2));
  console.log('\n--- AUTO-APPROVE FLAG ---');
  console.log(JSON.stringify(autoApproveFlag, null, 2));

  const allRequests = await prisma.serviceRequest.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, status: true, isActive: true, tags: true }
  });

  console.log('\n--- RECENT REQUESTS SUMMARY ---');
  console.table(allRequests);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
