
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Service Requests ---');

    const activeRequests = await prisma.serviceRequest.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, title: true, categoryId: true, status: true, isActive: true, visibility: true },
        take: 5
    });

    console.log(`Found ${activeRequests.length} ACTIVE requests (showing first 5):`);
    activeRequests.forEach(r => console.log(`- [${r.status}] [Active:${r.isActive}] [Vis:${r.visibility}] ${r.title} (CatID: ${r.categoryId})`));

    const totalActive = await prisma.serviceRequest.count({ where: { status: 'ACTIVE' } });
    console.log(`Total ACTIVE requests: ${totalActive}`);

    console.log('\n--- Checking Categories ---');
    const categories = await prisma.category.findMany({ take: 5 });
    console.log(`Found categories (showing first 5):`);
    categories.forEach(c => console.log(`- ${c.nameEn} (ID: ${c.id})`));

    // Check if any request categoryId matches a real category ID
    if (activeRequests.length > 0 && categories.length > 0) {
        const exampleReq = activeRequests[0];
        const matchingCat = await prisma.category.findUnique({ where: { id: exampleReq.categoryId } });
        console.log(`\nVerifying Category Link for request "${exampleReq.title}":`);
        if (matchingCat) {
            console.log(`✅ Linked Correctly to Category: ${matchingCat.nameEn} (ID: ${matchingCat.id})`);
        } else {
            console.log(`❌ FAILED: Request has categoryId ${exampleReq.categoryId} which DOES NOT EXIST in Category table.`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
