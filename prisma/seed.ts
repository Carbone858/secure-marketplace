import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a sample user
  const user = await prisma.user.create({
    data: {
      email: 'companyowner@example.com',
      emailHash: 'companyowner@example.com',
      password: 'Test123456!@',
      name: 'مالك الشركة',
      role: 'COMPANY',
    },
  });

  // Create sample companies linked to the user
  await prisma.company.createMany({
    data: [
      {
        userId: user.id,
        name: 'شركة البناء الذهبي',
        slug: 'golden-construction',
        description: 'شركة متخصصة في أعمال البناء',
        address: 'دمشق - المزة',
        rating: 4.8,
      },
      {
        userId: user.id,
        name: 'الكهربائي المحترف',
        slug: 'pro-electrician',
        description: 'خدمات كهربائية شاملة',
        address: 'حلب - الفرقان',
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
