const { PrismaClient } = require('@prisma/client');
const { hash } = require('argon2');
const crypto = require('crypto');
const prisma = new PrismaClient();

const testAccounts = [
  { email: 'admin-ops@secure-marketplace.com', name: 'Ops Admin', roleName: 'Admin (Operations)', deptName: 'Operations' },
  { email: 'finance@secure-marketplace.com', name: 'Finance Officer', roleName: 'Financial Officer', deptName: 'Finance' },
  { email: 'support@secure-marketplace.com', name: 'Support Agent', roleName: 'Customer Support Agent', deptName: 'Customer Support' },
  { email: 'content-manager@secure-marketplace.com', name: 'Content Manager', roleName: 'Content Manager', deptName: 'Content & Marketing' },
  { email: 'verification@secure-marketplace.com', name: 'Verification Officer', roleName: 'Verification Officer', deptName: 'Operations' },
];

async function main() {
  console.log('--- CREATING TEST STAFF ACCOUNTS ---');
  
  const password = 'Test123456!@';
  const hashedPassword = await hash(password, { type: 2, memoryCost: 65536, timeCost: 3, parallelism: 4 });

  for (const account of testAccounts) {
    const emailHash = crypto.createHash('sha256').update(account.email.toLowerCase().trim()).digest('hex');
    
    // Create/Upsert User
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: { emailHash, password: hashedPassword, role: 'ADMIN', isActive: true, emailVerified: new Date() },
      create: { email: account.email, emailHash, name: account.name, password: hashedPassword, role: 'ADMIN', isActive: true, emailVerified: new Date() }
    });

    // Find Role & Dept
    const staffRole = await prisma.staffRole.findFirst({ where: { name: account.roleName } });
    const department = await prisma.department.findFirst({ where: { name: account.deptName } });

    if (!staffRole || !department) {
      console.error(`Role (${account.roleName}) or Department (${account.deptName}) not found for ${account.email}`);
      continue;
    }

    // Upsert StaffMember
    await prisma.staffMember.upsert({
      where: { userId: user.id },
      update: { roleId: staffRole.id, departmentId: department.id },
      create: { userId: user.id, roleId: staffRole.id, departmentId: department.id }
    });
    
    console.log(`Created test account: ${account.email} -> ${account.roleName}`);
  }
}

main()
  .catch(e => {
    console.error('ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
