const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- ALL USERS WITH ADMIN/SUPER_ADMIN ROLES ---');
  const users = await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'SUPER_ADMIN'] }
    },
    include: {
      staffMember: {
        include: {
          role: true
        }
      }
    }
  });

  users.forEach(u => {
    console.log(`User: ${u.email}`);
    console.log(`  ID: ${u.id}`);
    console.log(`  Role in User table: ${u.role}`);
    console.log(`  Has StaffMember record: ${!!u.staffMember}`);
    if (u.staffMember) {
      console.log(`  Staff Role: ${u.staffMember.role?.name || 'No Role'}`);
      console.log(`  Permissions: ${JSON.stringify(u.staffMember.role?.permissions || {})}`);
    }
    console.log('---');
  });

  console.log('\n--- ALL STAFF ROLES ---');
  const roles = await prisma.staffRole.findMany();
  roles.forEach(r => {
    console.log(`Role: ${r.name} (ID: ${r.id})`);
    console.log(`  Permissions: ${JSON.stringify(r.permissions || {})}`);
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
