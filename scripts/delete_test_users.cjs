const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Fetching all user emails you manually tested with...');
    
    // Find users to delete that ARE NOT generated demo/admin domains
    const usersToDelete = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { email: { endsWith: '@example.com' } } },
          { NOT: { email: { endsWith: '@test.com' } } },
          { NOT: { email: { endsWith: '@demo.marketplace.com' } } },
          { NOT: { email: { endsWith: '@admin.com' } } },
          { NOT: { email: { startsWith: 'admin' } } }
        ]
      },
      select: { id: true, email: true }
    });

    if (usersToDelete.length === 0) {
      console.log('No manual test user accounts found. Safe to proceed!');
      return;
    }

    console.log(`Found ${usersToDelete.length} personal test accounts to delete:`);
    usersToDelete.forEach(u => console.log(`- ${u.email}`));

    for (const user of usersToDelete) {
      console.log(`Completely erasing ${user.email} from DB...`);
      
      // Delete VerificationTokens by email
      await prisma.verificationToken.deleteMany({
        where: { email: user.email }
      });
      
      // Delete Companies attached to user
      await prisma.company.deleteMany({
        where: { userId: user.id }
      });

      // Finally delete the user
      await prisma.user.delete({
        where: { id: user.id }
      });
    }

    console.log('Cleanup complete! You can re-register those exact emails now.');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
