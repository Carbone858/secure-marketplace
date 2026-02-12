const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  // Verify test user email
  await prisma.user.update({
    where: { email: 'test@example.com' },
    data: { emailVerified: new Date() }
  });

  // Create admin user
  const adminHash = await argon2.hash('AdminPass123!@#', { type: 2, memoryCost: 65536, timeCost: 3, parallelism: 1 });
  const adminEmailHash = crypto.createHash('sha256').update('admin@example.com').digest('hex');

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      emailHash: adminEmailHash,
      password: adminHash,
      name: 'Admin User',
      phone: '+1234567891',
      role: 'SUPER_ADMIN',
      emailVerified: new Date(),
      isActive: true,
    }
  });

  // Create company user
  const companyHash = await argon2.hash('CompanyPass123!@#', { type: 2, memoryCost: 65536, timeCost: 3, parallelism: 1 });
  const companyEmailHash = crypto.createHash('sha256').update('company@example.com').digest('hex');

  const companyUser = await prisma.user.create({
    data: {
      email: 'company@example.com',
      emailHash: companyEmailHash,
      password: companyHash,
      name: 'Company Owner',
      phone: '+1234567892',
      role: 'COMPANY',
      emailVerified: new Date(),
      isActive: true,
    }
  });

  const city = await prisma.city.findFirst();
  const country = await prisma.country.findFirst();

  await prisma.company.create({
    data: {
      userId: companyUser.id,
      name: 'Test Company LLC',
      slug: 'test-company-llc',
      description: 'A test company for QA',
      email: 'company@example.com',
      phone: '+1234567892',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
      isActive: true,
      isFeatured: true,
      rating: 4.5,
      reviewCount: 10,
      countryId: country?.id,
      cityId: city?.id,
    }
  });

  // Seed feature flags
  const flags = [
    { key: 'isMilestoneEnabled', value: false, description: 'Enable project milestones', category: 'projects' },
    { key: 'isRequestLimitEnabled', value: false, description: 'Enable request limits for free users', category: 'monetization' },
    { key: 'isCompanyPaidPlanActive', value: false, description: 'Enable paid plans for companies', category: 'monetization' },
    { key: 'isYellowPagesFeatured', value: false, description: 'Enable featured companies in Yellow Pages', category: 'companies' },
    { key: 'isSmartMatchingEnabled', value: true, description: 'Enable smart matching algorithm', category: 'matching' },
  ];

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: flag,
      create: flag,
    });
  }

  console.log('Done! Test accounts created.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
