import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testPostReview() {
  console.log('Fetching valid IDs...');
  const company = await prisma.company.findFirst();
  const user = await prisma.user.findFirst();

  if (!company || !user) {
    console.error('No company or user found!');
    return;
  }

  const companyId = company.id;
  const userId = user.id;
  const isModerationEnabled = false; // Simulating OFF

  console.log(`Using Company: ${companyId}, User: ${userId}`);
  console.log('Testing review creation with moderation OFF...');
  
  try {
    const review = await prisma.review.create({
      data: {
        rating: 5,
        comment: 'Test review moderation OFF - dynamic script simulation',
        companyId,
        userId,
        isApproved: !isModerationEnabled,
      },
    });
    console.log('Review created successfully:', review.id);

    // If moderation is disabled, recalculate company rating and reviewCount immediately
    if (!isModerationEnabled) {
      console.log('Recalculating stats...');
      const stats = await prisma.review.aggregate({
        where: { 
          companyId,
          isApproved: true 
        },
        _avg: { rating: true },
        _count: { rating: true },
      });
      console.log('Stats:', stats);

      await prisma.company.update({
        where: { id: companyId },
        data: {
          rating: stats._avg?.rating ? Math.round(stats._avg.rating * 100) / 100 : 0,
          reviewCount: stats._count?.rating || 0,
        },
      });
      console.log('Company stats updated');
    }
  } catch (err) {
    console.error('FAILED:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testPostReview();
