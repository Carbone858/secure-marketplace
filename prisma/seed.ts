import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 MASTER SEED STARTING...');

  const scripts = [
    'seed-syria.ts',
    'clean-and-seed-categories.ts',
    'seed-staff-roles.ts',
    'create-test-users.ts'
  ];

  for (const script of scripts) {
    console.log(`\n-----------------------------------------------------------`);
    console.log(`📦 Running ${script}...`);
    try {
      // Use npx tsx to execute the modular scripts
      const scriptPath = path.join(process.cwd(), 'prisma', script);
      execSync(`npx tsx "${scriptPath}"`, { stdio: 'inherit' });
      console.log(`✅ ${script} completed successfully.`);
    } catch (error: any) {
      console.error(`❌ Error running ${script}:`, error.message);
      // We continue to other scripts even if one fails
    }
  }

  console.log('\n-----------------------------------------------------------');
  console.log('✨ ALL SEED SCRIPTS COMPLETED!');
  console.log('🔑 You can now use the credentials in MANUAL_TEST_PLAN.md');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
