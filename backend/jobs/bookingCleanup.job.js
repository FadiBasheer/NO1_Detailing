import prisma from '../prisma/client.js';
import cron from 'node-cron';

// Auto-delete expired pending bookings every minute
export function startBookingCleanupJob() {
  cron.schedule('* * * * *', async () => {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const deletedBookings = await prisma.booking.deleteMany({
        where: {
          status: 'PENDING',
          createdAt: {
            lt: tenMinutesAgo
          }
        }
      });
      if (deletedBookings.count > 0) {
        console.log(`Deleted ${deletedBookings.count} expired pending bookings`);
      }
    } catch (error) {
      console.error('Error cleaning up expired bookings:', error);
    }
  });
}