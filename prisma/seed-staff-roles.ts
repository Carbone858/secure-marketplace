/**
 * Seed default staff roles and departments.
 * Run with: npx ts-node --project tsconfig.json prisma/seed-staff-roles.ts
 * Or via: npx tsx prisma/seed-staff-roles.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultRoles = [
    {
        name: 'Super Admin',
        nameAr: 'مدير عام',
        description: 'Full access to all platform features and settings',
    },
    {
        name: 'Admin',
        nameAr: 'مدير',
        description: 'Access to most admin features, cannot change system settings',
    },
    {
        name: 'Department Admin',
        nameAr: 'مدير قسم',
        description: 'Manages a specific department and its members',
    },
    {
        name: 'Support Agent',
        nameAr: 'موظف دعم',
        description: 'Handles user support tickets and inquiries',
    },
    {
        name: 'Content Manager',
        nameAr: 'مدير المحتوى',
        description: 'Manages CMS pages, sections, and categories',
    },
    {
        name: 'Verification Officer',
        nameAr: 'موظف التحقق',
        description: 'Reviews and approves company verification requests',
    },
    {
        name: 'Employee',
        nameAr: 'موظف',
        description: 'General staff member with basic access',
    },
];

const defaultDepartments = [
    {
        name: 'Management',
        nameAr: 'الإدارة',
        description: 'Executive and senior management team',
    },
    {
        name: 'Customer Support',
        nameAr: 'دعم العملاء',
        description: 'Handles customer inquiries and support requests',
    },
    {
        name: 'Operations',
        nameAr: 'العمليات',
        description: 'Day-to-day platform operations',
    },
    {
        name: 'Content & Marketing',
        nameAr: 'المحتوى والتسويق',
        description: 'Manages content, marketing, and communications',
    },
    {
        name: 'Technical',
        nameAr: 'التقني',
        description: 'Technical team and development',
    },
];

async function main() {
    console.log('🌱 Seeding default staff roles and departments...\n');

    // Seed roles
    let rolesCreated = 0;
    let rolesSkipped = 0;
    for (const role of defaultRoles) {
        const existing = await prisma.staffRole.findUnique({ where: { name: role.name } });
        if (existing) {
            console.log(`  ⏭  Role already exists: ${role.name}`);
            rolesSkipped++;
        } else {
            await prisma.staffRole.create({ data: role });
            console.log(`  ✅ Created role: ${role.name}`);
            rolesCreated++;
        }
    }

    console.log('');

    // Seed departments
    let deptsCreated = 0;
    let deptsSkipped = 0;
    for (const dept of defaultDepartments) {
        const existing = await prisma.department.findUnique({ where: { name: dept.name } });
        if (existing) {
            console.log(`  ⏭  Department already exists: ${dept.name}`);
            deptsSkipped++;
        } else {
            await prisma.department.create({ data: dept });
            console.log(`  ✅ Created department: ${dept.name}`);
            deptsCreated++;
        }
    }

    console.log(`\n✨ Done!`);
    console.log(`   Roles: ${rolesCreated} created, ${rolesSkipped} skipped`);
    console.log(`   Departments: ${deptsCreated} created, ${deptsSkipped} skipped`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
