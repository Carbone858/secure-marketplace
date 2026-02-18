import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        where: { parentId: null, isFeatured: true },
        select: { id: true, nameEn: true, iconName: true, icon: true }
    });

    console.log('Featured Categories in DB:');
    console.log(JSON.stringify(categories, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
