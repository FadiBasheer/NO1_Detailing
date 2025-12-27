import express from 'express';
import prisma from '../prisma/client.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, phone: true, defaultAddress: true, role: true }
    });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/', authMiddleware, async (req, res) => {
  try {
    const { name, phone, defaultAddress } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name !== undefined && { name: name.trim() || null }),
        ...(phone !== undefined && { phone: phone.trim() || null }),
        ...(defaultAddress !== undefined && { defaultAddress: defaultAddress.trim() || null }),
      },
      select: { id: true, email: true, name: true, phone: true, defaultAddress: true, role: true }
    });

    res.json({ message: 'Profile updated.', user: updated });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
