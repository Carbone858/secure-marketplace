import { prisma } from '../src/lib/prisma';

async function main() {
  const categories = await prisma.category.findMany({
    take: 8,
    orderBy: { sortOrder: 'asc' },
  });
  for (const cat of categories) {
    await prisma.category.update({
      where: { id: cat.id },
      data: { isFeatured: true },
    });
    console.log(`Category ${cat.nameEn || cat.name} marked as featured.`);
  }
  console.log('Done updating featured categories.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
