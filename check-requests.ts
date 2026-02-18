
import { prisma } from './src/lib/db/client';

async function main() {
    console.log('Checking service request statuses in database...');

    const counts = await prisma.serviceRequest.groupBy({
        by: ['status'],
        _count: true,
    });

    console.log('Request Status Counts:', counts);

    if (counts.length === 0) {
        console.log('No service requests found in database.');
    }

    const active = await prisma.serviceRequest.count({ where: { status: 'ACTIVE' } });
    console.log(`Verified ACTIVE count via prisma directly: ${active}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
