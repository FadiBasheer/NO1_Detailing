import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  vehicleType: String,
  service: String,
  addons: [String],
  brand: String,
  model: String
});

const BookingSchema = new mongoose.Schema({
  vehicles: [VehicleSchema],
  date: String,
  time: String,
  address: String
});

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;

