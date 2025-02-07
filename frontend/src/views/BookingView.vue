<template>
  <div class="booking-container">
    <h2>Book Your Appointment</h2>

    <form @submit.prevent="submitBooking">
      <label for="vehicle">Select Vehicle Type:</label>
      <select id="vehicle" v-model="vehicleType" required>
        <option disabled value="">Choose your vehicle</option>
        <option v-for="type in vehicleTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>

      <label for="date">Select Date:</label>
      <input type="date" id="date" v-model="date" @change="fetchBookedTimes" required />

      <label for="time">Select Time:</label>
      <select id="time" v-model="time" required>
        <option disabled value="">Choose a time</option>
        <option v-for="slot in availableTimeSlots" :key="slot" :value="slot" :disabled="isTimeBooked(slot)">
          {{ slot }}
        </option>
      </select>

      <label for="address">Enter Address:</label>
      <input type="text" id="address" v-model="address" required />

      <button type="submit">Confirm Booking</button>

      <p v-if="message" class="message">{{ message }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      vehicleType: '',
      date: '',
      time: '',
      address: '',
      message: '',
      bookedTimes: [],
      vehicleTypes: [
        'Sedan', 'Small SUV', 'Mid-size SUV', 'SUV 7 seats',
        'Small Truck', 'Big Truck', 'Mini Van', 'Commercial Van'
      ],
      timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
                  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
    };
  },
  computed: {
    availableTimeSlots() {
      return this.timeSlots;
    }
  },
  methods: {
    async fetchBookedTimes() {
      if (!this.date) return;

      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        this.bookedTimes = response.data.filter(booking => booking.date === this.date).map(booking => booking.time);
      } catch (error) {
        console.error('Error fetching booked times:', error);
      }
    },
    isTimeBooked(slot) {
      return this.bookedTimes.includes(slot);
    },
    async submitBooking() {
      try {
        const bookingData = {
          vehicleType: this.vehicleType,
          date: this.date,
          time: this.time,
          address: this.address
        };

        const response = await axios.post('http://localhost:5000/api/bookings', bookingData);
        this.message = response.data.message;
        
        // Clear form after successful booking
        this.vehicleType = '';
        this.date = '';
        this.time = '';
        this.address = '';

        // Refresh booked times to disable selected slot
        this.fetchBookedTimes();
      } catch (error) {
        this.message = error.response?.data?.message || 'Error submitting booking.';
      }
    }
  }
};
</script>

<style scoped>
.booking-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

label {
  display: block;
  margin-top: 10px;
}

input, select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background: #45a049;
}

.message {
  margin-top: 10px;
  font-weight: bold;
}
</style>
