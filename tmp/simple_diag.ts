
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const latest = await prisma.serviceRequest.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, status: true, isActive: true, tags: true }
    });
    console.log('LATEST_REQUEST_JSON:' + JSON.stringify(latest));
    
    const flags = await prisma.featureFlag.findMany();
    console.log('FLAGS_JSON:' + JSON.stringify(flags));
  } finally {
    await prisma.$disconnect();
  }
}

main();
