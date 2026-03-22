const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultDepartments = [
  {
    name: 'Executive Management',
    nameAr: 'الإدارة التنفيذية',
    description: 'Executive and senior management team',
  },
  {
    name: 'Operations',
    nameAr: 'العمليات',
    description: 'General platform operations and oversight',
  },
  {
    name: 'Finance',
    nameAr: 'المالية',
    description: 'Handles platform transactions, offers, pricing, and project financials',
  },
  {
    name: 'Customer Support',
    nameAr: 'دعم العملاء',
    description: 'Handles user inquiries, tickets, reviews, and messaging',
  },
  {
    name: 'Content & Marketing',
    nameAr: 'المحتوى والتسويق',
    description: 'Manages CMS pages, categories, and communications',
  },
];

const defaultRoles = [
  {
    name: 'Super Admin',
    nameAr: 'مدير عام',
    description: 'Full access to all platform features and settings',
    permissions: {
      view_dashboard: true, manage_users: true, manage_companies: true,
      manage_verifications: true, manage_requests: true, manage_projects: true,
      manage_offers: true, manage_categories: true, manage_reviews: true,
      manage_staff: true, manage_cms: true, manage_feature_flags: true,
      manage_messages: true, manage_settings: true, view_health: true,
    },
  },
  {
    name: 'Admin (Operations)',
    nameAr: 'مدير (العمليات)',
    description: 'Access to most admin features, cannot change system settings or feature flags',
    permissions: {
      view_dashboard: true, manage_users: true, manage_companies: true,
      manage_verifications: true, manage_requests: true, manage_projects: true,
      manage_offers: true, manage_categories: true, manage_reviews: true,
      manage_staff: true, manage_cms: true, manage_messages: true,
      view_health: true,
      manage_settings: false, manage_feature_flags: false,
    },
  },
  {
    name: 'Financial Officer',
    nameAr: 'مسؤول مالي',
    description: 'Focused access strictly on offers, projects, and dashboard',
    permissions: {
      view_dashboard: true,
      manage_offers: true,
      manage_projects: true,
    },
  },
  {
    name: 'Customer Support Agent',
    nameAr: 'موظف دعم العملاء',
    description: 'Focused access on users, messages, reviews, and companies',
    permissions: {
      view_dashboard: true,
      manage_users: true,
      manage_messages: true,
      manage_reviews: true,
      manage_companies: true,
    },
  },
  {
    name: 'Content Manager',
    nameAr: 'مدير المحتوى',
    description: 'Focused access strictly on CMS pages and categories',
    permissions: {
      view_dashboard: true,
      manage_cms: true,
      manage_categories: true,
    },
  },
  {
    name: 'Verification Officer',
    nameAr: 'مسؤول التحقق',
    description: 'Focused access strictly on company registrations and verifications',
    permissions: {
      view_dashboard: true,
      manage_verifications: true,
      manage_companies: true,
    },
  },
  {
    name: 'Employee',
    nameAr: 'موظف',
    description: 'General staff member with basic access',
    permissions: {
      view_dashboard: true,
    },
  },
];

async function main() {
  console.log('Applying Professional RBAC Defaults...');

  // Upsert Departments
  for (const dept of defaultDepartments) {
    const existing = await prisma.department.findFirst({
      where: { name: dept.name }
    });
    
    if (existing) {
      await prisma.department.update({
        where: { id: existing.id },
        data: dept
      });
      console.log(`Updated Department: ${dept.name}`);
    } else {
      await prisma.department.create({ data: dept });
      console.log(`Created Department: ${dept.name}`);
    }
  }

  // Upsert Roles
  for (const role of defaultRoles) {
    const existing = await prisma.staffRole.findFirst({
      where: { name: role.name }
    });
    
    // Default any unset permissions to false
    const fullPermissions = {
      view_dashboard: false, manage_users: false, manage_companies: false,
      manage_verifications: false, manage_requests: false, manage_projects: false,
      manage_offers: false, manage_categories: false, manage_reviews: false,
      manage_staff: false, manage_cms: false, manage_feature_flags: false,
      manage_messages: false, manage_settings: false, view_health: false,
      ...role.permissions
    };

    const roleData = {
      name: role.name,
      nameAr: role.nameAr,
      description: role.description,
      permissions: fullPermissions,
    };

    if (existing) {
      await prisma.staffRole.update({
        where: { id: existing.id },
        data: roleData
      });
      console.log(`Updated Role: ${role.name}`);
    } else {
      await prisma.staffRole.create({ data: roleData });
      console.log(`Created Role: ${role.name}`);
    }
  }

  // Handle Legacy Admin role to Admin (Operations) 
  // We'll rename the existing "Admin" role if it exists and there's no Admin (Operations) yet
  const legacyAdmin = await prisma.staffRole.findFirst({
    where: { name: 'Admin' }
  });

  if (legacyAdmin) {
      console.log(`Updating Legacy Admin role permissions...`);
      const adminOps = defaultRoles.find(r => r.name === 'Admin (Operations)');
      const fullPermissions = { ...adminOps.permissions };
      
      await prisma.staffRole.update({
          where: { id: legacyAdmin.id },
          data: {
              permissions: fullPermissions
          }
      });
  }

  console.log('Professional RBAC initialization complete!');
}

main()
  .catch((e) => {
    console.error('Initialization failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
