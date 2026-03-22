const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function fixRoles() {
  const staffEmails = [
    'admin-ops@secure-marketplace.com',
    'finance@secure-marketplace.com',
    'support@secure-marketplace.com',
    'content-manager@secure-marketplace.com',
    'verification@secure-marketplace.com',
  ];

  for (const email of staffEmails) {
    const user = await p.user.updateMany({
      where: { email },
      data: { role: 'ADMIN' }
    });
    console.log(`Updated ${email}: ${user.count} row(s)`);
  }
}

fixRoles().catch(console.error).finally(() => p.$disconnect());
