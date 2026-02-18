
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getRandomUserId() {
    const user = await prisma.user.findFirst({
        where: { role: 'CLIENT' }, // Use valid client users
        orderBy: { createdAt: 'desc' }, // pick recent ones or random
        take: 1
        // Prisma doesn't support random natively easily, so just pick first for now or improve
    });
    // Better: fetch IDs and pick random
    if (!global.userIds) {
        const users = await prisma.user.findMany({ where: { role: 'CLIENT' }, select: { id: true } });
        global.userIds = users.map(u => u.id);
    }
    return global.userIds[Math.floor(Math.random() * global.userIds.length)];
}

async function getRandomCityId() {
    if (!global.cityIds) {
        const cities = await prisma.city.findMany({ select: { id: true, countryId: true } });
        global.cityIds = cities;
    }
    const city = global.cityIds[Math.floor(Math.random() * global.cityIds.length)];
    return city;
}

async function main() {
    console.log('Fetching categories and their request counts...');
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { requests: true }
            }
        }
    });

    console.log(`Found ${categories.length} categories.`);
    let addedCount = 0;

    // Pre-fetch IDs to avoid hammering DB
    let userIds = [];
    try {
        console.log('Fetching users...');
        const users = await prisma.user.findMany({
            select: { id: true },
            take: 50
        });
        userIds = users.map(u => u.id);
        console.log(`Fetched ${userIds.length} users.`);
    } catch (e) {
        console.error('Error fetching users:', e);
        return;
    }

    if (userIds.length === 0) {
        console.error('No users found to create requests!');
        return;
    }

    const cities = await prisma.city.findMany({ select: { id: true, countryId: true } });

    for (const cat of categories) {
        // If category has less than 2 requests, add more to ensure robust browsing
        const targetCount = 2;
        const currentCount = cat._count.requests;

        if (currentCount >= targetCount) continue;

        const needed = targetCount - currentCount;
        // console.log(`Category "${cat.nameEn}" has ${currentCount} requests. Adding ${needed}...`);

        for (let i = 0; i < needed; i++) {
            const userId = userIds[Math.floor(Math.random() * userIds.length)];
            const city = cities.length > 0 ? cities[Math.floor(Math.random() * cities.length)] : null;

            await prisma.serviceRequest.create({
                data: {
                    title: `${cat.nameEn} Service Required`, // e.g. "Web Development Service Required"
                    description: `We are looking for a professional provider for ${cat.nameEn}. Please review the project requirements and submit a competitive proposal.`,
                    budgetMin: Math.floor(Math.random() * 500) + 100,
                    budgetMax: Math.floor(Math.random() * 1500) + 600,
                    currency: 'USD',
                    status: 'ACTIVE',
                    isActive: true,
                    visibility: 'PUBLIC',
                    urgency: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
                    categoryId: cat.id,
                    userId: userId,
                    // Optional: set location
                    cityId: city?.id,
                    countryId: city?.countryId,
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000))
                }
            });
            addedCount++;
            process.stdout.write('.');
        }
    }

    console.log(`\nSuccessfully added ${addedCount} new requests to ensure full category coverage!`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
