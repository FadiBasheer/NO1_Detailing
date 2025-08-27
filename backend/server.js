import dotenv from "dotenv";
dotenv.config();

import express from "express";
import prisma from "./prisma/client.js";
import cors from "cors";
import cron from 'node-cron';
import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://yumeeco.ca'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Auto-delete expired pending bookings every minute
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

// Gracefully shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
