import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cron from 'node-cron';
import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { startBookingCleanupJob } from './jobs/bookingCleanup.job.js';
import { startTokenCleanupJob } from './jobs/tokenCleanup.job.js';
import { setupGracefulShutdown } from './jobs/shutdown.js';

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

// Start the booking cleanup job
startBookingCleanupJob();
// Start the token cleanup job
startTokenCleanupJob();

setupGracefulShutdown();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
