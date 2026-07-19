import { prisma } from '../src/lib/db/client';

async function pruneExpiredRecords() {
  console.log('[Maintenance] Starting database cleanups...');
  const now = new Date();
  
  try {
    // Delete expired refresh tokens
    const deletedTokens = await prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: now } }
    });
    console.log(`[Maintenance] Pruned ${deletedTokens.count} expired refresh tokens.`);
    
    // Delete expired password reset tokens
    const deletedResets = await prisma.passwordResetToken.deleteMany({
      where: { expires: { lt: now } }
    });
    console.log(`[Maintenance] Pruned ${deletedResets.count} expired reset tokens.`);
    
    console.log('[Maintenance] Database cleanups completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[Maintenance] Cleanup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

pruneExpiredRecords();
