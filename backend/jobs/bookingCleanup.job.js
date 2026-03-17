import prisma from '../prisma/client.js';
import cron from 'node-cron';

// Auto-delete unpaid (PENDING) bookings every minute.
// Removes a booking if EITHER:
//   - it was created more than 7 days ago (never going to pay), OR
//   - the actual booking date is within the next hour (too late to pay and still make it)
export function startBookingCleanupJob() {
  cron.schedule('* * * * *', async () => {
    try {
      const sevenDaysAgo  = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

      const deleted = await prisma.booking.deleteMany({
        where: {
          status: 'PENDING',
          OR: [
            { createdAt: { lt: sevenDaysAgo } },   // unpaid for 7+ days
            { date:      { lt: oneHourFromNow } },  // booking is within 1 hour or already past
          ],
        },
      });

      if (deleted.count > 0) {
        console.log(`Deleted ${deleted.count} expired pending bookings`);
      }
    } catch (error) {
      console.error('Error cleaning up expired bookings:', error);
    }
  });
}