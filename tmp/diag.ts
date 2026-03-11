
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.ygdofukyrvrlgdabvttu:QFU5VC%2F3tnU%3FR%215@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function main() {
  console.log('--- SYSTEM CHECK ---');
  
  const autoApproveFlag = await prisma.featureFlag.findUnique({
    where: { key: 'isRequestAutoApproveEnabled' }
  });
  console.log('Auto-Approve Flag:', autoApproveFlag?.value ?? 'MISSING (defaults to false)');

  const latest = await prisma.serviceRequest.findFirst({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      isActive: true,
      tags: true,
      createdAt: true
    }
  });

  console.log('\n--- LATEST REQUEST ---');
  console.log(JSON.stringify(latest, null, 2));

  const activeCount = await prisma.serviceRequest.count({
    where: { isActive: true, status: 'ACTIVE' }
  });
  const pendingCount = await prisma.serviceRequest.count({
    where: { status: 'PENDING' }
  });

  console.log(`\nStats: ${activeCount} ACTIVE, ${pendingCount} PENDING`);
}

main().finally(() => prisma.$disconnect());
