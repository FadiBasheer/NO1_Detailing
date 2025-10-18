import express from 'express';
import prisma from '../prisma/client.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

const generateReferralCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

// Get current user's referral info
router.get('/my-info', authMiddleware, async (req, res) => {
  try {
    let user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        referralCode: true,
        referralsSent: {
          select: { discountUsed: true }
        }
      }
    });

    // Auto-generate referral code for users who don't have one yet
    if (!user.referralCode) {
      let newCode;
      do {
        newCode = generateReferralCode();
      } while (await prisma.user.findUnique({ where: { referralCode: newCode } }));

      user = await prisma.user.update({
        where: { id: req.user.id },
        data: { referralCode: newCode },
        select: {
          referralCode: true,
          referralsSent: { select: { discountUsed: true } }
        }
      });
    }

    res.json({
      referralCode: user.referralCode,
      totalReferrals: user.referralsSent.length,
      usedReferrals: user.referralsSent.filter(r => r.discountUsed).length
    });
  } catch (error) {
    console.error('Error fetching referral info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
