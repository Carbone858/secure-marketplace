
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        select: { id: true, nameEn: true, slug: true }
    });

    console.log('Available Categories:');
    categories.forEach(c => console.log(`"${c.nameEn}" (slug: ${c.slug}) -> ${c.id}`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
