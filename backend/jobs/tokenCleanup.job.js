import prisma from '../prisma/client.js';
import cron from 'node-cron';

export function startTokenCleanupJob() {
// Clean up expired refresh tokens daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  try {
    const now = new Date();
    const deletedTokens = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    });
    if (deletedTokens.count > 0) {
      console.log(`Deleted ${deletedTokens.count} expired refresh tokens`);
    }
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
});
}