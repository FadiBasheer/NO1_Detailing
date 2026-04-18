import express from 'express';
import prisma from '../prisma/client.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

const isTest = process.env.NODE_ENV !== 'production';
const apiToken = isTest
  ? process.env.HELCIM_API_TOKEN_TEST
  : process.env.HELCIM_API_TOKEN;

// Monthly price per vehicle type per tier (CAD)
const MEMBERSHIP_PRICING = {
  'Sedan/Coupe':    { TIER1: 40,  TIER2: 75,  TIER3: 110 },
  'Small SUV':      { TIER1: 45,  TIER2: 80,  TIER3: 120 },
  'Mid-size SUV':   { TIER1: 45,  TIER2: 80,  TIER3: 120 },
  'SUV 7 seats':    { TIER1: 50,  TIER2: 90,  TIER3: 130 },
  'Mini Van':       { TIER1: 50,  TIER2: 90,  TIER3: 130 },
  'Small Truck':    { TIER1: 50,  TIER2: 85,  TIER3: 125 },
  'Big Truck':      { TIER1: 56,  TIER2: 100, TIER3: 145 },
  'Commercial Van': { TIER1: 60,  TIER2: 112, TIER3: 160 },
};

// GET /api/membership/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const membership = await prisma.membership.findUnique({
      where: { userId: req.user.id },
    });
    res.json({ membership: membership || null });
  } catch (err) {
    console.error('Get membership error:', err);
    res.status(500).json({ message: 'Failed to load membership' });
  }
});

// GET /api/membership/pricing?vehicleType=Sedan%2FCoupe
router.get('/pricing', async (req, res) => {
  const { vehicleType } = req.query;
  const pricing = MEMBERSHIP_PRICING[vehicleType];
  if (!pricing) return res.status(400).json({ message: 'Unknown vehicle type' });
  res.json({ pricing });
});

// POST /api/membership/checkout-token
// Returns a Helcim verify checkout token to capture card + create customer (no charge)
router.post('/checkout-token', authMiddleware, async (req, res) => {
  try {
    const { vehicleType, tier } = req.body;
    const pricing = MEMBERSHIP_PRICING[vehicleType];
    if (!pricing || !pricing[tier]) {
      return res.status(400).json({ message: 'Invalid vehicle type or tier' });
    }

    const existing = await prisma.membership.findUnique({ where: { userId: req.user.id } });
    if (existing?.status === 'ACTIVE') {
      return res.status(409).json({ message: 'You already have an active membership' });
    }

    // Use 'verify' to capture card info and create Helcim customer (no charge)
    // The subscription API then handles all billing
    const helcimRes = await fetch('https://api.helcim.com/v2/helcim-pay/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'api-token': apiToken,
      },
      body: JSON.stringify({
        paymentType: 'verify',
        amount: 0,
        currency: 'CAD',
      }),
    });

    const rawBody = await helcimRes.text();
    let parsedBody;
    try { parsedBody = JSON.parse(rawBody); } catch { parsedBody = { raw: rawBody }; }

    if (!helcimRes.ok) {
      console.error('[Helcim] Membership checkout error:', helcimRes.status, parsedBody);
      const helcimMsg = parsedBody?.errors?.[0]?.message || parsedBody?.message || JSON.stringify(parsedBody);
      return res.status(502).json({ message: `Payment provider error: ${helcimMsg}` });
    }

    const { checkoutToken } = parsedBody;
    if (!checkoutToken) {
      return res.status(502).json({ message: 'Payment provider did not return a checkout token.' });
    }

    const amount = pricing[tier];
    res.json({ checkoutToken, amount });
  } catch (err) {
    console.error('Membership checkout-token error:', err);
    res.status(500).json({ message: 'Failed to initialize payment' });
  }
});

// POST /api/membership/activate
// Called after Helcim Pay.js reports SUCCESS
router.post('/activate', authMiddleware, async (req, res) => {
  try {
    const { vehicleType, tier, customerCode } = req.body;

    const pricing = MEMBERSHIP_PRICING[vehicleType];
    if (!pricing?.[tier]) return res.status(400).json({ message: 'Invalid membership data' });

    if (!customerCode) {
      return res.status(400).json({ message: 'Missing Helcim customer code from card verification.' });
    }

    const amount = pricing[tier];

    // Set up Helcim recurring subscription using the Recurring API.
    // Requires a payment plan to exist in the Helcim dashboard.
    // planId is read from env vars per tier: HELCIM_PLAN_ID_TIER1, HELCIM_PLAN_ID_TIER2, HELCIM_PLAN_ID_TIER3
    const planId = process.env[`HELCIM_PLAN_ID_${tier}`] || null;
    let helcimSubscriptionId = null;

    if (planId) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const subRes = await fetch('https://api.helcim.com/v2/recurring/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'api-token': apiToken,
          },
          body: JSON.stringify({
            planId,
            customerCode,
            amount,
            currency: 'CAD',
            activationDate: today,
          }),
        });
        const subText = await subRes.text();
        let subData = {};
        try { subData = JSON.parse(subText); } catch {}
        if (subRes.ok) {
          helcimSubscriptionId = subData.id || subData.subscriptionId || null;
          console.log('[Helcim] Subscription created:', helcimSubscriptionId);
        } else {
          console.warn('[Helcim] Recurring setup failed:', helcimRes.status, subText);
        }
      } catch (err) {
        // Don't fail activation if subscription setup fails — can be configured manually
        console.error('[Helcim] Recurring setup error:', err.message);
      }
    } else {
      console.warn(`[Helcim] No HELCIM_PLAN_ID_${tier} env var set — skipping subscription creation`);
    }

    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const membership = await prisma.membership.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        vehicleType,
        tier,
        status: 'ACTIVE',
        monthlyPrice: amount,
        nextBillingDate,
        helcimSubscriptionId,
        helcimCustomerCode: customerCode || null,
        detailCreditUsed: false,
        washCreditUsed: false,
      },
      update: {
        vehicleType,
        tier,
        status: 'ACTIVE',
        monthlyPrice: amount,
        nextBillingDate,
        helcimSubscriptionId,
        helcimCustomerCode: customerCode || null,
        detailCreditUsed: false,
        washCreditUsed: false,
      },
    });

    res.json({ membership });
  } catch (err) {
    console.error('Membership activation error:', err);
    res.status(500).json({ message: 'Failed to activate membership' });
  }
});

// DELETE /api/membership/cancel
router.delete('/cancel', authMiddleware, async (req, res) => {
  try {
    const membership = await prisma.membership.findUnique({ where: { userId: req.user.id } });
    if (!membership || membership.status !== 'ACTIVE') {
      return res.status(404).json({ message: 'No active membership found' });
    }

    // Cancel Helcim recurring subscription if one was created
    // NOTE: Verify exact cancel endpoint at https://devdocs.helcim.com/
    if (membership.helcimSubscriptionId) {
      try {
        await fetch(
          `https://api.helcim.com/v2/subscriptions/${membership.helcimSubscriptionId}`,
          { method: 'DELETE', headers: { 'api-token': apiToken, 'accept': 'application/json' } }
        );
      } catch (err) {
        console.error('[Helcim] Cancel subscription error:', err.message);
      }
    }

    const updated = await prisma.membership.update({
      where: { userId: req.user.id },
      data: { status: 'CANCELLED', helcimSubscriptionId: null },
    });

    res.json({ membership: updated });
  } catch (err) {
    console.error('Cancel membership error:', err);
    res.status(500).json({ message: 'Failed to cancel membership' });
  }
});

export default router;
