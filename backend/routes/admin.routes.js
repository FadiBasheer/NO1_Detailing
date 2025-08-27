import express from 'express';
import prisma from '../prisma/client.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Get all bookings (Admin only)
router.get('/bookings', async (req, res) => {
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

// Update booking status (Admin only)
router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be one of: PENDING, CONFIRMED, CANCELLED, COMPLETED' });
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
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

    // Format response similar to GET /api/bookings
    const formattedBooking = {
      id: updatedBooking.id,
      customerId: updatedBooking.customerId,
      customer: updatedBooking.customer,
      vehicleId: updatedBooking.vehicleId,
      vehicle: updatedBooking.vehicle,
      date: updatedBooking.date,
      endTime: updatedBooking.endTime,
      address: updatedBooking.address,
      status: updatedBooking.status,
      createdAt: updatedBooking.createdAt,
      updatedAt: updatedBooking.updatedAt,
      services: updatedBooking.services.map(bs => ({
        serviceId: bs.service.id,
        name: bs.service.name,
        price: bs.service.price,
        durationMinutes: bs.service.durationMinutes
      })),
      addons: updatedBooking.addons.map(ba => ({
        addonId: ba.addon.id,
        name: ba.addon.name,
        price: ba.addon.price,
        durationMinutes: ba.addon.durationMinutes
      }))
    };

    res.json(formattedBooking);
  } catch (error) {
    if (error.code === 'P2025') {
      // Prisma error for record not found
      return res.status(404).json({ message: 'Booking not found' });
    }
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;