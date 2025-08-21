import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cron from 'node-cron';

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

const helcimToken = process.env.HELCIM_API_TOKEN;

// Helper functions for tokens
const generateAccessToken = (user) => jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (user) => jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://yumeeco.ca'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access token required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }
    res.status(401).json({ message: 'Invalid access token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// Database connection test
prisma.$connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch((err) => console.error('❌ Database connection error:', err));



// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role === 'admin' ? 'ADMIN' : 'USER'
      }
    });

    res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt
      }
    });

    res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: 'Login failed' });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token required' });
    }

    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!storedToken || new Date() > storedToken.expiresAt) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  const { refreshToken } = req.body;
  try {
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.json({ message: 'Logged out' });
  } catch (error) {
    res.status(400).json({ message: 'Logout failed' });
  }
});

app.get('/', (req, res) => {
  res.send('Mobile Detailing Backend is running');
});


// Reserve a slot temporarily (status: "PENDING")
app.post('/api/reserve-slot', authMiddleware, async (req, res) => {
  try {
    const { vehicleId, date, time, serviceIds, addonIds, address } = req.body;

    // Validate input
    if (!vehicleId || !date || !time || !address || !serviceIds || !Array.isArray(serviceIds)) {
      return res.status(400).json({ 
        message: 'Missing or invalid required fields: vehicleId, date, time, address, serviceIds (array)' 
      });
    }

    if (serviceIds.length === 0) {
      return res.status(400).json({ message: 'At least one service must be selected' });
    }

    // Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    // Fetch service durations to calculate endTime
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, durationMinutes: true, price: true }
    });

    if (services.length !== serviceIds.length) {
      return res.status(400).json({ message: 'One or more service IDs are invalid' });
    }

    // Fetch addon durations if provided
    let addons = [];
    if (addonIds && Array.isArray(addonIds) && addonIds.length > 0) {
      addons = await prisma.addon.findMany({
        where: { id: { in: addonIds } },
        select: { id: true, durationMinutes: true, price: true }
      });

      if (addons.length !== addonIds.length) {
        return res.status(400).json({ message: 'One or more addon IDs are invalid' });
      }
    }

    // Parse date and time to create DateTime
    const bookingDate = new Date(`${date}T${time}:00`);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date or time format' });
    }

    // Calculate total duration in minutes
    const totalDurationMinutes = services.reduce((sum, s) => sum + s.durationMinutes, 0) +
                                  addons.reduce((sum, a) => sum + a.durationMinutes, 0);

    // Calculate end time
    const endTime = new Date(bookingDate.getTime() + totalDurationMinutes * 60000);

    // Check for overlapping confirmed bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        status: 'CONFIRMED',
        address: address,
        OR: [
          {
            // New booking starts before existing booking ends
            date: { lte: endTime },
            endTime: { gte: bookingDate }
          }
        ]
      }
    });

    if (overlappingBooking) {
      return res.status(409).json({ 
        message: 'This time slot conflicts with an existing booking. Please select a different time.' 
      });
    }

    // Create booking with nested writes for services and addons
    const booking = await prisma.booking.create({
      data: {
        customerId: req.user.id,
        vehicleId: vehicleId,
        date: bookingDate,
        endTime: endTime,
        address: address,
        status: 'PENDING',
        services: {
          create: serviceIds.map(serviceId => ({
            serviceId: serviceId
          }))
        },
        addons: {
          create: (addonIds || []).map(addonId => ({
            addonId: addonId
          }))
        }
      },
      include: {
        services: { include: { serviceId: true } },
        addons: { include: { addonId: true } },
        vehicle: true
      }
    });

    res.status(201).json({
      message: 'Slot reserved for 10 minutes. Proceed to payment.',
      bookingId: booking.id,
      booking: {
        id: booking.id,
        date: booking.date,
        endTime: booking.endTime,
        address: booking.address,
        vehicleId: booking.vehicleId,
        totalDuration: totalDurationMinutes
      }
    });
  } catch (error) {
    console.error('Error reserving slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Generate Helcim payment form details
app.post('/api/payment-link', async (req, res) => {
  try {
    const { bookingId, totalAmount } = req.body;

    // Validate booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.status !== 'PENDING') {
      return res.status(400).json({ message: 'Invalid or expired booking.' });
    }

    const helcimUrl = `https://yumeeco.myhelcim.com/hosted/?token=${helcimToken}`;

    res.json({
      action: helcimUrl,
      amount: totalAmount
    });
  } catch (error) {
    console.error('Error generating payment link:', error);
    res.status(500).json({ message: 'Error generating payment link.' });
  }
});

// Helcim webhook - payment confirmation
app.post('/api/payment-success', async (req, res) => {
  try {
    const { bookingId, paymentStatus } = req.body;

    if (paymentStatus === 'approved') {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' }
      });
      console.log(`Booking ${bookingId} confirmed and paid.`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.sendStatus(500);
  }
});

app.get('/api/bookings', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: {
          select: { id: true, email: true, role: true }
        },
        vehicle: true,
        services: {
          include: {
            service: {
              select: { id: true, name: true, price: true, durationMinutes: true }
            }
          }
        },
        addons: {
          include: {
            addon: {
              select: { id: true, name: true, price: true, durationMinutes: true }
            }
          }
        }
      }
    });

    // Format response
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      customerId: booking.customerId,
      customer: booking.customer,
      vehicleId: booking.vehicleId,
      vehicle: booking.vehicle,
      date: booking.date,
      endTime: booking.endTime,
      address: booking.address,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      services: booking.services.map(bs => ({
        serviceId: bs.service.id,
        name: bs.service.name,
        price: bs.service.price,
        durationMinutes: bs.service.durationMinutes
      })),
      addons: booking.addons.map(ba => ({
        addonId: ba.addon.id,
        name: ba.addon.name,
        price: ba.addon.price,
        durationMinutes: ba.addon.durationMinutes
      }))
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/available-times', async (req, res) => {
  const { date, duration } = req.query;
  const jobDuration = parseInt(duration); // in minutes

  const openTime = 8 * 60; // 8:00 AM in minutes
  const closeTime = 20 * 60; // 8:00 PM in minutes
  const interval = 30; // 30-minute slots

  // Load booked slots from database
  const bookings = await prisma.booking.findMany({
    where: {
      date,
      status: 'CONFIRMED'
    }
  });

  // Convert to minutes
  const bookedMinutes = bookings.map(b => timeToMinutes(b.time));

  const availableSlots = [];
  for (let minutes = openTime; minutes + jobDuration <= closeTime; minutes += interval) {
    const overlaps = bookedMinutes.some(bm => {
      const end = minutes + jobDuration;
      const bookedEnd = bm + 60; // assuming existing jobs are 60 min
      return (minutes < bookedEnd && end > bm);
    });

    if (!overlaps) {
      availableSlots.push(minutesToTime(minutes));
    }
  }

  res.json(availableSlots); // e.g., ["08:00 AM", "08:30 AM", ...]
});

function timeToMinutes(timeStr) {
  const [time, period] = timeStr.split(' ');
  let [hour, minute] = time.split(':').map(Number);
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hour12 = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

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
