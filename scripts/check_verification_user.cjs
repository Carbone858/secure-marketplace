const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findFirst({
  where: { email: 'verification@secure-marketplace.com' },
  select: { id: true, email: true, role: true, isActive: true }
}).then(u => {
  console.log('ROLE:', u.role);
  console.log('Full:', JSON.stringify(u));
}).catch(console.error).finally(() => p.$disconnect());
