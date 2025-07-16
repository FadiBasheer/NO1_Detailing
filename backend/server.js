import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Booking from './models/Booking.js';


const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mobile-detailing')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));


// Routes
app.get('/', (req, res) => {
  res.send('Mobile Detailing Backend is running');
});


// Reserve a slot temporarily (status: "pending")
app.post('/api/reserve-slot', async (req, res) => {
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



app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/bookings', async (req, res) => {
  try {
    const { vehicles, date, time, address } = req.body;

    // Check if the time slot is already booked
    const existingBooking = await Booking.findOne({ date, time });
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked. Please choose another time.' });
    }

    // Create and save the booking with all vehicles
    const newBooking = new Booking({ vehicles, date, time, address });
    await newBooking.save();

    res.status(201).json({ message: 'Booking confirmed!', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
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
