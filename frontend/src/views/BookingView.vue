
<template>
  <div class="booking-container">
    <h2>Book Your Appointment</h2>

    <form @submit.prevent="submitBooking">
      <label for="date">Select Date:</label>
      <input
        type="date"
        id="date"
        v-model="date"
        :min="todayDate"
        @change="fetchBookedTimes"
        required
      />

      <label for="time">Select Time:</label>
      <select id="time" v-model="time" required>
        <option disabled value="">Choose a time</option>
        <option v-for="slot in availableTimeSlots" :key="slot" :value="slot" :disabled="isTimeBooked(slot)">
          {{ slot }}
        </option>
      </select>

      <button type="submit">Confirm Booking</button>

      <button type="button" @click="addAnotherVehicle" style="margin-top: 10px;">
        Add Another Vehicle Before Your Appointment
      </button>


      <p v-if="message" class="message">{{ message }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { services, addons } from '@/data/services';

export default {

  data() {
    return {
      date: '',
      time: '',
      address: '',
      vehicles: [
        {
          vehicleType: this.$route.query.vehicle || "",
          service: this.$route.query.service || "",
          addons: this.$route.query.addons || "",
          brand: this.$route.query.brand || "",
          model: this.$route.query.model || ""
        }
      ],
      message: '',
      bookedTimes: [],
    };
  },


  created() {
    const savedVehicles = JSON.parse(localStorage.getItem('vehicles')) || [];

    if (this.vehicleType) {
      savedVehicles.push({
        vehicleType: this.vehicleType,
        service: this.service,
        addons: this.addons,
        brand: this.brand,
        model: this.model
      });
    }
    this.vehicles = savedVehicles;


    console.log("Vehicle type:", this.vehicleType);
    console.log("Addons:", this.addons);

    console.log("Selected Add-ons:");
    this.selectedAddons.forEach((addon, index) => {
      console.log(
        `#${index + 1} - Name: ${addon.name}, Duration: ${addon.duration} mins, Price: $${addon.price}`
      );
    });

    if (this.vehicles.length > 0) {
      const firstVehicle = this.vehicles[0];
      const selectedService = services[firstVehicle.service];
    
      if (selectedService) {
        console.log("Service name:", selectedService.name);
        console.log("Service duration:", selectedService.duration);
      }
    }

  },

  computed: {

    availableTimeSlots() {
      return this.generateTimeSlots("08:00", "20:00", 30, this.totalDuration);
    },

    todayDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },

    totalDuration() {
      let total = 0;
      if (this.selectedService) {
        total += this.selectedService.duration;
      }
      this.selectedAddons.forEach(addon => {
        total += addon.duration;
      });
      return total;
    },

    selectedService() {
      return services[this.service]; // This gives you the full object
    },

    selectedAddons() {
      if (!this.addons) return [];

      const addonKeys = this.addons.split(",");
      return addonKeys.map(key => addons[key]).filter(Boolean);
    }
  },

  methods: {

    addAnotherVehicle() {
      // Save current vehicle info to localStorage or a global store if using Vuex/Pinia
      const existingVehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
      existingVehicles.push({
        vehicleType: this.vehicleType,
        service: this.service,
        addons: this.addons,
        brand: this.brand,
        model: this.model
      });
      localStorage.setItem('vehicles', JSON.stringify(existingVehicles));

      // Redirect to vehicle selection view
      this.$router.push({ name: 'VehicleSelection' }); // adjust route name if needed
    },

    generateTimeSlots(startTime, endTime, intervalMinutes, jobDuration = 0) {
      const slots = [];
      const pad = n => (n < 10 ? "0" + n : n);

      let [startHour, startMin] = startTime.split(":").map(Number);
      let [endHour, endMin] = endTime.split(":").map(Number);

      let current = new Date();
      current.setHours(startHour, startMin, 0, 0);
      const end = new Date();
      end.setHours(endHour, endMin, 0, 0);

      const endMinutes = endHour * 60 + endMin;

      while (true) {
        const slotMinutes = current.getHours() * 60 + current.getMinutes();
        const jobEnd = slotMinutes + jobDuration;

        if (jobEnd > endMinutes) break;

        const hour = current.getHours();
        const minute = current.getMinutes();
        const formatted = `${pad(hour % 12 || 12)}:${pad(minute)} ${hour < 12 ? "AM" : "PM"}`;
        slots.push(formatted);

        current.setMinutes(current.getMinutes() + intervalMinutes);
      }
      return slots;
    },


    timeStringToMinutes(timeStr) {
      const [time, period] = timeStr.split(" ");
      let [hour, minute] = time.split(":").map(Number);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return hour * 60 + minute;
    },

    isTimeBooked(slot) {
      const slotStart = this.timeStringToMinutes(slot);
      const slotEnd = slotStart + this.totalDuration;

      return this.bookedTimes.some(booked => {
        const bookedStart = this.timeStringToMinutes(booked);
        const bookedEnd = bookedStart + 60; // Assuming each existing booking lasts 1 hour (you can store actual duration later)
        return (
          (slotStart < bookedEnd && slotEnd > bookedStart) // overlap check
        );
      });
    },

    async fetchBookedTimes() {
      if (!this.date) return;

      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        this.bookedTimes = response.data.filter(booking => booking.date === this.date).map(booking => booking.time);
      } catch (error) {
        console.error('Error fetching booked times:', error);
      }
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
