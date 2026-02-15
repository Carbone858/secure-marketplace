import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Map category slugs or names to the correct iconName for SVG display
const iconNameMap: Record<string, string> = {
  'it': 'it',
  'plumbing': 'plumbing',
  'moving': 'moving',
  'cleaning': 'cleaning',
  'construction': 'construction',
  'interior-design': 'interior-design',
  'electrical': 'electrical',
};

async function main() {
  for (const [slugOrName, iconName] of Object.entries(iconNameMap)) {
    // Try to update by slug first, fallback to name if needed
    const updated = await prisma.category.updateMany({
      where: {
        OR: [
          { slug: slugOrName },
          { name: { equals: slugOrName, mode: 'insensitive' } },
          { nameEn: { equals: slugOrName, mode: 'insensitive' } },
        ],
      },
      data: { iconName },
    });
    console.log(`Updated ${updated.count} categories for '${slugOrName}' → iconName: '${iconName}'`);
  }
  console.log('✅ Category iconName fields updated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
