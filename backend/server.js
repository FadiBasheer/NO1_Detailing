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

app.post('/api/bookings', async (req, res) => {
  try {
    const { vehicleType, date, time, address } = req.body;

    // Check if the time slot is already booked
    const existingBooking = await Booking.findOne({ date, time });
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked. Please choose another time.' });
    }

    // Save the new booking
    const newBooking = new Booking({ vehicleType, date, time, address });
    await newBooking.save();

    res.status(201).json({ message: 'Booking confirmed!', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
