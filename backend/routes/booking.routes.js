import express from 'express';
import prisma from '../prisma/client.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

const helcimToken = process.env.HELCIM_API_TOKEN;

// Reserve a slot temporarily (status: "PENDING")
router.post('/reserve-slot', authMiddleware, async (req, res) => {
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
router.post('/payment-link', async (req, res) => {
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
      select: { id: true, status: true, customerId: true, date: true, address: true }
    });

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