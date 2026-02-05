import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample companies
  await prisma.company.createMany({
    data: [
      {
        name: 'شركة البناء الذهبي',
        slug: 'golden-construction',
        description: 'شركة متخصصة في أعمال البناء',
        location: 'دمشق - المزة',
        rating: 4.8,
      },
      {
        name: 'الكهربائي المحترف',
        slug: 'pro-electrician',
        description: 'خدمات كهربائية شاملة',
        location: 'حلب - الفرقان',
        rating: 4.5,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
