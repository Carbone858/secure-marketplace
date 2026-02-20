import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const logs = await prisma.securityLog.findMany({
        where: { type: 'LOGIN_FAILED' },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log('RECENT LOGIN FAILURES:');
    console.log(JSON.stringify(logs, null, 2));
}

main().finally(() => prisma.$disconnect());
