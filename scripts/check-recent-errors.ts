import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const recentErrors = await (prisma as any).healthLog.findMany({
    where: {
      status: 'CRITICAL',
    },
    orderBy: {
      testedAt: 'desc',
    },
    take: 10,
  });

  console.log('Recent CRITICAL errors:');
  recentErrors.forEach((log: any) => {
    console.log(`[${log.testedAt.toISOString()}] ${log.service} - ${log.errorMessage || log.message}`);
    if (log.details) console.log('Details:', log.details);
    console.log('---');
  });

  const recentWarnings = await (prisma as any).healthLog.findMany({
    where: {
      status: 'WARNING',
    },
    orderBy: {
      testedAt: 'desc',
    },
    take: 10,
  });

  console.log('\nRecent WARNINGs:');
  recentWarnings.forEach((log: any) => {
    console.log(`[${log.testedAt.toISOString()}] ${log.service} - ${log.errorMessage || log.message}`);
    console.log('---');
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
