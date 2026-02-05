import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Syria
  const syria = await prisma.country.create({
    data: {
      code: 'SY',
      nameAr: 'سوريا',
      nameEn: 'Syria',
    },
  });

  // Create cities
  await
