import express from 'express';
import prisma from '../prisma/client.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 attempts per IP
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // max 5 registrations per IP
  message: { message: 'Too many accounts created from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper functions for tokens
const generateAccessToken = (user) => jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (user) => jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

// Generate a short unique referral code
const generateReferralCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

// Auth routes
router.post('/register', registerLimiter, async (req, res) => {
  const { email, password, promoCode, referralCode } = req.body;
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

    // If a referral code was provided, find the referrer
    let referrer = null;
    if (referralCode) {
      referrer = await prisma.user.findUnique({ where: { referralCode: referralCode.toUpperCase() } });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a unique referral code for the new user
    let newReferralCode;
    do {
      newReferralCode = generateReferralCode();
    } while (await prisma.user.findUnique({ where: { referralCode: newReferralCode } }));

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
        referralCode: newReferralCode,
        ...(promoCode ? { promoCode: promoCode.toUpperCase() } : {})
      }
    });

    // Link the referral if a valid referrer was found
    if (referrer) {
      await prisma.referral.create({
        data: { referrerId: referrer.id, refereeId: user.id }
      });
    }

    res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: 'Registration failed' });
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await prisma.user.findUnique({ where: { email } });
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

    // Auto-generate a referral code for legacy users who don't have one
    if (!user.referralCode) {
      let newReferralCode;
      do {
        newReferralCode = generateReferralCode();
      } while (await prisma.user.findUnique({ where: { referralCode: newReferralCode } }));
      user = await prisma.user.update({
        where: { id: user.id },
        data: { referralCode: newReferralCode }
      });
    }

    // Check if this user has an unused referral discount
    const pendingReferral = await prisma.referral.findUnique({
      where: { refereeId: user.id },
      select: { discountUsed: true }
    });
    const referralDiscountPending = !!(pendingReferral && !pendingReferral.discountUsed);

    res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, promoCode: user.promoCode, promoUsed: user.promoUsed, completedBookingsCount: user.completedBookingsCount, referralCode: user.referralCode, referralDiscountPending } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: 'Login failed' });
  }
});

router.post('/refresh', async (req, res) => {
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

router.post('/logout', async (req, res) => {
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

export default router;