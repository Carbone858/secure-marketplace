import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkRecentReviews() {
  console.log('Checking reviews created in the last 30 minutes...');
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
  
  try {
    const reviews = await prisma.review.findMany({
      where: {
        createdAt: {
          gte: thirtyMinutesAgo
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        company: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    console.log(`Found ${reviews.length} recent reviews.`);
    reviews.forEach(r => {
      console.log(`- ID: ${r.id}`);
      console.log(`  Comment: ${r.comment}`);
      console.log(`  Approved: ${r.isApproved}`);
      console.log(`  Company: ${r.company?.name} (${r.company?.slug})`);
      console.log(`  Created: ${r.createdAt.toISOString()}`);
      console.log('---');
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentReviews();
