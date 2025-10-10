import express from 'express';
import prisma from '../prisma/client.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

const helcimToken = process.env.HELCIM_API_TOKEN;

// Reserve a slot temporarily (status: "PENDING")
router.post('/reserve-slot', authMiddleware, async (req, res) => {
  try {
    const { vehicles, date, time } = req.body;

    // Validate input
    if (!date || !time || !vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
      return res.status(400).json({
        message: 'Missing required fields: vehicles (array), date, time'
      });
    }

    // Parse date and time
    const bookingDate = new Date(`${date}T${time}:00`);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date or time format' });
    }

    // Check for overlapping confirmed bookings at this time
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        status: 'CONFIRMED',
        OR: [{ date: { lte: bookingDate }, endTime: { gte: bookingDate } }]
      }
    });

    if (overlappingBooking) {
      return res.status(409).json({
        message: 'This time slot conflicts with an existing booking. Please select a different time.'
      });
    }

    // Create one booking per vehicle in the cart
    const bookings = [];
    let currentStart = bookingDate;

    for (const v of vehicles) {
      // Find or create the Vehicle record for this user
      let vehicle = await prisma.vehicle.findFirst({
        where: {
          userId: req.user.id,
          type: v.vehicleType,
          brand: v.brand || null,
          model: v.model || null,
        }
      });

      if (!vehicle) {
        vehicle = await prisma.vehicle.create({
          data: {
            userId: req.user.id,
            type: v.vehicleType,
            brand: v.brand || null,
            model: v.model || null,
          }
        });
      }

      // Look up service by name, create if missing
      let service = await prisma.service.findFirst({ where: { name: v.service } });
      if (!service) {
        service = await prisma.service.create({
          data: { name: v.service, price: 0, durationMinutes: 60 }
        });
      }

      // Look up addons by name, create if missing
      const addonRecords = [];
      for (const addonName of (v.addons || [])) {
        let addon = await prisma.addon.findFirst({ where: { name: addonName } });
        if (!addon) {
          addon = await prisma.addon.create({
            data: { name: addonName, price: 0, durationMinutes: 30 }
          });
        }
        addonRecords.push(addon);
      }

      const totalDuration = service.durationMinutes +
        addonRecords.reduce((sum, a) => sum + a.durationMinutes, 0);
      const endTime = new Date(currentStart.getTime() + totalDuration * 60000);

      const booking = await prisma.booking.create({
        data: {
          customerId: req.user.id,
          vehicleId: vehicle.id,
          date: currentStart,
          endTime: endTime,
          address: 'TBD',
          status: 'PENDING',
          services: { create: [{ serviceId: service.id }] },
          addons: { create: addonRecords.map(a => ({ addonId: a.id })) }
        }
      });

      bookings.push(booking);
      currentStart = endTime; // next vehicle starts where this one ends
    }

    const primaryBooking = bookings[0];

    res.status(201).json({
      message: 'Slot reserved. Proceed to payment.',
      bookingId: primaryBooking.id,
    });
  } catch (error) {
    console.error('Error reserving slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Generate Helcim payment form details
router.post('/payment-link', authMiddleware, async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Validate booking exists and belongs to this user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        services: { include: { service: true } },
        addons: { include: { addon: true } }
      }
    });

    if (!booking || booking.status !== 'PENDING') {
      return res.status(400).json({ message: 'Invalid or expired booking.' });
    }

    if (booking.customerId !== req.user.id) {
      return res.status(403).json({ message: 'This booking does not belong to you.' });
    }

    // Calculate total server-side from actual service/addon prices
    const serviceTotal = booking.services.reduce((sum, bs) => sum + bs.service.price, 0);
    const addonTotal = booking.addons.reduce((sum, ba) => sum + ba.addon.price, 0);
    let totalAmount = serviceTotal + addonTotal;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    let discountAmount = 0;

    // Apply promo discount — free exterior wash ($80) on first booking
    const PROMO_DISCOUNT = 80;
    if (user.promoCode && !user.promoUsed) {
      discountAmount = Math.min(PROMO_DISCOUNT, totalAmount);
      totalAmount = Math.max(0, totalAmount - PROMO_DISCOUNT);
    }

    // Apply referral discount — 10% off (only if no promo discount already applied)
    if (discountAmount === 0) {
      const pendingReferral = await prisma.referral.findUnique({
        where: { refereeId: req.user.id },
        select: { id: true, discountUsed: true }
      });
      if (pendingReferral && !pendingReferral.discountUsed) {
        discountAmount = Math.round(totalAmount * 0.10 * 100) / 100;
        totalAmount = Math.round((totalAmount - discountAmount) * 100) / 100;
      }
    }

    // Record the discount on this booking
    if (discountAmount > 0) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { discountAmount }
      });
    }

    const helcimUrl = `https://yumeeco.myhelcim.com/hosted/?token=${helcimToken}`;

    res.json({
      action: helcimUrl,
      amount: totalAmount,
      discountApplied: discountAmount > 0,
      discountAmount
    });
  } catch (error) {
    console.error('Error generating payment link:', error);
    res.status(500).json({ message: 'Error generating payment link.' });
  }
});

// Helcim payment confirmation
// Called by the frontend after Helcim redirects back with a transactionId.
// We verify the transaction directly with Helcim's API — never trust the client's status claim.
router.post('/payment-success', authMiddleware, async (req, res) => {
  try {
    const { bookingId, transactionId } = req.body;

    if (!bookingId || !transactionId) {
      return res.status(400).json({ message: 'Missing required fields: bookingId, transactionId' });
    }

    // Verify the transaction with Helcim's API
    let helcimTransaction;
    try {
      const helcimRes = await fetch(
        `https://api.helcim.com/v2/transactions/${encodeURIComponent(transactionId)}`,
        {
          method: 'GET',
          headers: {
            'api-token': helcimToken,
            'accept': 'application/json',
          },
        }
      );

      if (!helcimRes.ok) {
        console.error(`Helcim verification failed — HTTP ${helcimRes.status}`);
        return res.status(402).json({ message: 'Payment could not be verified with Helcim.' });
      }

      helcimTransaction = await helcimRes.json();
    } catch (fetchError) {
      console.error('Error contacting Helcim API:', fetchError);
      return res.status(502).json({ message: 'Unable to reach payment provider. Please contact support.' });
    }

    // Helcim returns status as 'APPROVED' for successful transactions
    if (helcimTransaction.status?.toUpperCase() !== 'APPROVED') {
      console.warn(`Transaction ${transactionId} not approved — status: ${helcimTransaction.status}`);
      return res.status(402).json({ message: 'Payment was not approved.' });
    }

    // Fetch the booking and make sure it belongs to the authenticated user
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.customerId !== req.user.id) {
      return res.status(403).json({ message: 'This booking does not belong to you.' });
    }

    if (booking.status !== 'PENDING') {
      return res.status(409).json({
        message: `Booking is already ${booking.status}.`
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      select: { id: true, status: true, customerId: true, date: true, address: true, discountAmount: true }
    });

    // Mark promo/referral as used if a discount was applied on this booking
    if (updatedBooking.discountAmount > 0) {
      const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { promoCode: true, promoUsed: true } });
      if (user.promoCode && !user.promoUsed) {
        await prisma.user.update({ where: { id: req.user.id }, data: { promoUsed: true } });
      } else {
        // Mark referral discount as used
        await prisma.referral.updateMany({
          where: { refereeId: req.user.id, discountUsed: false },
          data: { discountUsed: true }
        });
      }
    }

    console.log(`Booking ${bookingId} confirmed via verified Helcim transaction ${transactionId}.`);

    res.status(200).json({
      message: 'Payment verified. Booking confirmed.',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user's bookings
router.get('/bookings/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { customerId: req.user.id },
      orderBy: { date: 'desc' },
      include: {
        vehicle: true,
        services: {
          include: { service: { select: { id: true, name: true, price: true, durationMinutes: true } } }
        },
        addons: {
          include: { addon: { select: { id: true, name: true, price: true, durationMinutes: true } } }
        }
      }
    });

    const formatted = bookings.map(b => ({
      id: b.id,
      date: b.date,
      endTime: b.endTime,
      address: b.address,
      status: b.status,
      createdAt: b.createdAt,
      vehicle: b.vehicle,
      services: b.services.map(bs => ({
        serviceId: bs.service.id,
        name: bs.service.name,
        price: bs.service.price,
        durationMinutes: bs.service.durationMinutes,
      })),
      addons: b.addons.map(ba => ({
        addonId: ba.addon.id,
        name: ba.addon.name,
        price: ba.addon.price,
        durationMinutes: ba.addon.durationMinutes,
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cancel a booking (customer-initiated)
router.patch('/bookings/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.customerId !== req.user.id) {
      return res.status(403).json({ message: 'This booking does not belong to you.' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(409).json({ message: 'Booking is already cancelled.' });
    }

    if (booking.status === 'COMPLETED') {
      return res.status(409).json({ message: 'Completed bookings cannot be cancelled.' });
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
      select: { id: true, status: true }
    });

    res.json({ message: 'Booking cancelled.', booking: updated });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/available-times', async (req, res) => {
  try {
    const { date, duration } = req.query;

    // Validate input
    if (!date || !duration) {
      return res.status(400).json({
        message: 'Missing required query parameters: date (ISO string), duration (minutes)'
      });
    }

    const jobDuration = parseInt(duration);
    if (isNaN(jobDuration) || jobDuration <= 0) {
      return res.status(400).json({ message: 'Duration must be a positive number' });
    }

    // Parse the date parameter (ISO format: YYYY-MM-DD)
    const selectedDate = new Date(`${date}T00:00:00Z`);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use ISO format (YYYY-MM-DD)' });
    }

    // Define business hours
    const openTime = 8 * 60; // 8:00 AM in minutes
    const closeTime = 20 * 60; // 8:00 PM in minutes
    const interval = 30; // 30-minute slot intervals

    // Get the next day for the date range query
    const dayStart = new Date(`${date}T00:00:00Z`);
    const dayEnd = new Date(`${date}T23:59:59Z`);

    // Fetch confirmed bookings for this date
    const bookings = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        date: {
          gte: dayStart,
          lte: dayEnd
        }
      },
      select: {
        date: true,
        endTime: true
      }
    });

    // Generate available time slots
    const availableSlots = [];

    for (let minutes = openTime; minutes + jobDuration <= closeTime; minutes += interval) {
      // Calculate slot start and end times
      const slotStartDate = new Date(dayStart);
      slotStartDate.setHours(0, minutes, 0, 0);

      const slotEndDate = new Date(slotStartDate);
      slotEndDate.setMinutes(slotEndDate.getMinutes() + jobDuration);

      // Check for overlaps with confirmed bookings
      const hasOverlap = bookings.some(booking => {
        // Overlap occurs if: slotStart < bookingEnd AND slotEnd > bookingStart
        return slotStartDate < booking.endTime && slotEndDate > booking.date;
      });

      if (!hasOverlap) {
        // Format time slot as HH:MM
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

        availableSlots.push({
          time: timeString,
          startDateTime: slotStartDate.toISOString(),
          endDateTime: slotEndDate.toISOString()
        });
      }
    }

    res.json({
      date: date,
      duration: jobDuration,
      businessHours: {
        open: '08:00',
        close: '20:00'
      },
      slotInterval: `${interval} minutes`,
      availableSlots: availableSlots,
      totalAvailable: availableSlots.length
    });
  } catch (error) {
    console.error('Error fetching available times:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;