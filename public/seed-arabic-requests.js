
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fetching data for Arabic requests...');
    const categories = await prisma.category.findMany();

    // Simplified user fetch - no filters
    let userIds = [];
    try {
        const users = await prisma.user.findMany({ select: { id: true }, take: 20 });
        userIds = users.map(u => u.id);
        console.log(`Fetched ${userIds.length} users.`);
    } catch (e) {
        console.error('Failed to fetch users:', e);
        return;
    }

    if (userIds.length === 0) { console.error('No users found'); return; }

    // Fetch locations
    const cities = await prisma.city.findMany({ select: { id: true, countryId: true } });

    console.log(`Generating Arabic requests for ${categories.length} categories...`);

    let count = 0;

    for (const cat of categories) {
        // Generate 2 Arabic requests per category
        for (let i = 0; i < 2; i++) {
            const userId = userIds[Math.floor(Math.random() * userIds.length)];
            const city = cities.length > 0 ? cities[Math.floor(Math.random() * cities.length)] : null;

            const budgetMin = Math.floor(Math.random() * 500) + 100;
            const budgetMax = budgetMin + Math.floor(Math.random() * 1000);

            const action = ['مطلوب', 'ابحث عن', 'احتاج الى'][Math.floor(Math.random() * 3)];
            const title = `${action} خدمة ${cat.nameAr} بشكل عاجل`;
            const desc = `نبحث عن مقدم خدمة موثوق ومتخصص في ${cat.nameAr}. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.`;

            await prisma.serviceRequest.create({
                data: {
                    title: title,
                    description: desc,
                    categoryId: cat.id,
                    userId: userId,
                    budgetMin: budgetMin,
                    budgetMax: budgetMax,
                    currency: 'SAR',
                    status: 'ACTIVE',
                    isActive: true,
                    visibility: 'PUBLIC',
                    urgency: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
                    cityId: city?.id,
                    countryId: city?.countryId,
                    allowRemote: Math.random() > 0.5,
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
                }
            });
            count++;
            process.stdout.write('.');
        }
    }

    console.log(`\nSuccess! Created ${count} Arabic service requests.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
