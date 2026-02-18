
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const arabicRegex = /[\u0600-\u06FF]/;

async function main() {
    console.log('Fetching all requests to tag languages...');
    const requests = await prisma.serviceRequest.findMany();
    console.log(`Processing ${requests.length} requests...`);

    let arCount = 0;
    let enCount = 0;

    for (const req of requests) {
        let tags = req.tags || [];
        // Remove old lang tags
        tags = tags.filter(t => !t.startsWith('lang:'));

        if (arabicRegex.test(req.title) || arabicRegex.test(req.description)) {
            tags.push('lang:ar');
            arCount++;
        } else {
            tags.push('lang:en');
            enCount++;
        }

        await prisma.serviceRequest.update({
            where: { id: req.id },
            data: { tags: tags }
        });

        if ((arCount + enCount) % 50 === 0) process.stdout.write('.');
    }

    console.log(`\n\n✅ Completed!`);
    console.log(`Total Arabic (lang:ar): ${arCount} (Tagged)`);
    console.log(`Total English (lang:en): ${enCount} (Tagged)`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
