import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const flags = [
    {
      key: 'isReviewModerationEnabled',
      value: false,
      nameEn: 'Review Moderation',
      nameAr: 'مراجعة التقييمات',
      description: 'New reviews must be approved by an admin before becoming public.',
      descriptionAr: 'يجب الموافقة على التقييمات الجديدة بواسطة المسؤول قبل أن تصبح عامة.',
      category: 'safety'
    }
  ];

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: flag,
      create: flag,
    });
    console.log(`Synced flag: ${flag.key}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
