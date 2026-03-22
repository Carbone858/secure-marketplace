const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FULL_PERMISSIONS = {
  view_dashboard: true,
  manage_users: true,
  manage_companies: true,
  manage_verifications: true,
  manage_requests: true,
  manage_projects: true,
  manage_offers: true,
  manage_categories: true,
  manage_reviews: true,
  manage_staff: true,
  manage_cms: true,
  manage_feature_flags: true,
  manage_messages: true,
  manage_settings: true,
  view_health: true,
};

async function main() {
  console.log('--- Fixing Staff Roles Permissions ---');
  
  // 1. Update 'Admin' role
  const adminRole = await prisma.staffRole.findFirst({
    where: { name: 'Admin' }
  });
  
  if (adminRole) {
    await prisma.staffRole.update({
      where: { id: adminRole.id },
      data: { permissions: FULL_PERMISSIONS }
    });
    console.log("Updated 'Admin' role with full permissions.");
  } else {
    console.log("'Admin' role not found.");
  }

  // 2. Update 'Super Admin' role
  const superAdminRole = await prisma.staffRole.findFirst({
    where: { name: 'Super Admin' }
  });
  
  if (superAdminRole) {
    await prisma.staffRole.update({
      where: { id: superAdminRole.id },
      data: { permissions: FULL_PERMISSIONS }
    });
    console.log("Updated 'Super Admin' role with full permissions.");
  } else {
    console.log("'Super Admin' role not found.");
  }

  // 3. Just to be sure, any user with role 'ADMIN' or 'SUPER_ADMIN' 
  // currently seeing NOTHING usually means they HAVE a StaffMember record 
  // with a role that has no permissions.
  // Let's find all ADMIN/SUPER_ADMIN users and check their staff records.
  const users = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
    include: { staffMember: { include: { role: true } } }
  });

  for (const u of users) {
    if (u.staffMember && (!u.staffMember.role || Object.keys(u.staffMember.role.permissions || {}).length === 0)) {
      console.log(`User ${u.email} has a staff record but NO permissions. They might be locked out.`);
      // If they have no role, maybe assign them the 'Admin' role?
      if (!u.staffMember.roleId && adminRole) {
        await prisma.staffMember.update({
          where: { id: u.staffMember.id },
          data: { roleId: adminRole.id }
        });
        console.log(`Assigned 'Admin' role to user ${u.email}.`);
      }
    }
  }

  console.log('--- Done ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
