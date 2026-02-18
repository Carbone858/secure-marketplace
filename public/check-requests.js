
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking service request statuses...');

    const requests = await prisma.serviceRequest.groupBy({
        by: ['status'],
        _count: {
            _all: true
        }
    });

    console.log('Request Status Counts:', requests);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
