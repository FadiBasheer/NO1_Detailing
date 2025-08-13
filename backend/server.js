import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import Booking from './models/Booking.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const app = express();
const port = 5000;

const helcimToken = process.env.HELCIM_API_TOKEN;

// Simple in-memory refresh token store (replace with Redis/DB in production)
const refreshTokens = new Set();

// Helper functions for tokens
const generateAccessToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

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
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));



// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = new User({ email, password, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.add(refreshToken);
  res.json({ accessToken, refreshToken, user: { id: user._id, email: user.email, role: user.role } });
});

app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens.delete(refreshToken);
  res.json({ message: 'Logged out' });
});

app.get('/', (req, res) => {
  res.send('Mobile Detailing Backend is running');
});


// Reserve a slot temporarily (status: "pending")
app.post('/api/reserve-slot', authMiddleware, async (req, res) => {
  try {
    const { vehicles, date, time, address } = req.body;

    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({ date, time });
    if (existingBooking) {
      return res.status(400).json({ message: 'Slot already booked.' });
    }

    // Create a pending booking
    const pendingBooking = new Booking({
      vehicles,
      date,
      time,
      address,
      status: 'pending',
      userId: req.user.id,
    });
    await pendingBooking.save();

    // Auto-cancel after 10 minutes if not confirmed
    setTimeout(async () => {
      const stillPending = await Booking.findById(pendingBooking._id);
      if (stillPending && stillPending.status === 'pending') {
        await Booking.findByIdAndDelete(pendingBooking._id);
        console.log(`Pending booking expired for ${date} at ${time}`);
      }
    }, 10 * 60 * 1000);

    res.json({
      message: 'Slot reserved for 10 minutes. Proceed to payment.',
      bookingId: pendingBooking._id,
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
    const booking = await Booking.findById(bookingId);
    console.log("booking:",booking);
    if (!booking || booking.status !== 'pending') {
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
      await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });
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
    const bookings = await Booking.find();
    res.json(bookings);
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

  // Simulate loading booked slots from DB
  const bookings = await Booking.find({ date });

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
