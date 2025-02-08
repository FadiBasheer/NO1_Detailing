import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  vehicleType: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
});

export default mongoose.model('Booking', bookingSchema);
