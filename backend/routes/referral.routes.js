import express from 'express';
import prisma from '../prisma/client.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get current user's referral info
router.get('/my-info', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        referralCode: true,
        referralsSent: {
          select: { discountUsed: true }
        }
      }
    });

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
