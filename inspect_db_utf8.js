const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  let output = '--- ALL USERS WITH ADMIN/SUPER_ADMIN ROLES ---\n';
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
    output += `User: ${u.email}\n`;
    output += `  ID: ${u.id}\n`;
    output += `  Role in User table: ${u.role}\n`;
    output += `  Has StaffMember record: ${!!u.staffMember}\n`;
    if (u.staffMember) {
      output += `  Staff Role: ${u.staffMember.role?.name || 'No Role'}\n`;
      output += `  Permissions: ${JSON.stringify(u.staffMember.role?.permissions || {})}\n`;
    }
    output += '---\n';
  });

  output += '\n--- ALL STAFF ROLES ---\n';
  const roles = await prisma.staffRole.findMany();
  roles.forEach(r => {
    output += `Role: ${r.name} (ID: ${r.id})\n`;
    output += `  Permissions: ${JSON.stringify(r.permissions || {})}\n`;
  });

  fs.writeFileSync('inspect_utf8.txt', output, 'utf8');
  console.log('Output written to inspect_utf8.txt');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
