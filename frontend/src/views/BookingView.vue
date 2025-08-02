<template>
  <div class="booking-page" style="display: flex; gap: 20px;">
    <!-- Main booking form -->
    <div class="booking-form" style="flex: 2;">
      <h2>Book Your Appointment</h2>

      <!-- Date -->
      <div>
        <label>Select Date:</label>
        <input
          type="date"
          v-model="date"
          :min="todayDate"
          @change="onDateChange"
        />
      </div>

      <!-- Time -->
      <div>
        <label>Select Time:</label>
        <select v-model="time">
          <option value="">-- Select a time --</option>
          <option
            v-for="slot in availableTimeSlots"
            :key="slot"
            :value="slot"
            :disabled="isTimeBooked(slot)"
          >
            {{ slot }}
          </option>
        </select>
      </div>

      <!-- Submit -->
      <div>
        <button @click="submitBooking">Pay to Book</button>
      </div>

      <p v-if="message" style="margin-top: 10px; color: green;">{{ message }}</p>
    </div>

    <!-- Cart Sidebar -->
    <div class="cart" style="flex: 1; border: 1px solid #ccc; padding: 10px;">
      <h3>Your Booking Cart</h3>

      <div v-if="vehicles.length === 0">
        <p>No vehicles added yet.</p>
      </div>

      <div
        v-for="(vehicle, vIndex) in vehicles"
        :key="vIndex"
        style="border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 8px;"
      >
        <strong>{{ vehicle.vehicleType }} - {{ getServiceName(vehicle.service) }}</strong>
        <button @click="removeVehicle(vIndex)" style="margin-left: 5px; color: red;">X</button>

        <!-- Add-ons list -->
        <ul v-if="vehicle.addons.length > 0">
          <li
            v-for="(addon, aIndex) in vehicle.addons"
            :key="aIndex"
            style="display: flex; justify-content: space-between; align-items: center;"
          >
            {{ getAddonName(addon) }}
            <button @click="removeAddon(vIndex, aIndex)" style="color: red;">X</button>
          </li>
        </ul>
      </div>

      <!-- Add Another Vehicle -->
      <button @click="addAnotherVehicle">+ Add Another Vehicle</button>
      <br />
      <button @click="clearLocalStorage" style="margin-top: 5px;">Clear Cart</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import API_BASE_URL from '../config.js';
import { services, addons } from "@/data/services";

export default {
  data() {
    return {
      date: "",
      time: "",
      address: "",
      vehicles: [],
      message: "",
      bookedTimes: [],
      availableTimeSlots: [],
    };
  },

  created() {
    const savedVehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

    if (this.$route.query.vehicle) {
      const vehicleFromRoute = {
        vehicleType: this.$route.query.vehicle || "",
        service: this.$route.query.service || "",
        addons: this.$route.query.addons
          ? this.$route.query.addons.split(",")
          : [],
        brand: this.$route.query.brand || "",
        model: this.$route.query.model || "",
      };

      // Check for duplicates based only on vehicle type, service, brand, and model
      const isDuplicate = savedVehicles.some(
        (v) =>
          v.vehicleType === vehicleFromRoute.vehicleType &&
          v.service === vehicleFromRoute.service &&
          v.brand === vehicleFromRoute.brand &&
          v.model === vehicleFromRoute.model
      );

      if (!isDuplicate) {
        savedVehicles.push(vehicleFromRoute);
        localStorage.setItem("vehicles", JSON.stringify(savedVehicles));
      }
    }
      this.vehicles = savedVehicles;
  },

  computed: {
    todayDate() {
      const today = new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(today.getDate()).padStart(2, "0")}`;
    },

    totalDuration() {
      return this.vehicles.reduce((total, vehicle) => {
        const service = services[vehicle.service];
        if (service) total += service.duration;

        vehicle.addons.forEach((addonKey) => {
          const addon = addons[addonKey];
          if (addon) total += addon.duration;
        });

        return total;
      }, 0);
    },
  },

  methods: {
    getServiceName(key) {
      return services[key]?.name || "Unknown Service";
    },

    getAddonName(key) {
      return addons[key]?.name || "Unknown Add-on";
    },

    removeVehicle(index) {
      this.vehicles.splice(index, 1);
      localStorage.setItem("vehicles", JSON.stringify(this.vehicles));
    },

    removeAddon(vehicleIndex, addonIndex) {
      this.vehicles[vehicleIndex].addons.splice(addonIndex, 1);
      localStorage.setItem("vehicles", JSON.stringify(this.vehicles));
    },

    onDateChange() {
      this.time = "";
      this.fetchBookedTimes();
    },

    clearLocalStorage() {
      localStorage.removeItem("vehicles");
      this.vehicles = [];
    },

    addAnotherVehicle() {
      this.$router.push({ name: "vehicles" });
    },

    generateTimeSlots(startTime, endTime, intervalMinutes, jobDuration = 0) {
      const slots = [];
      const pad = (n) => (n < 10 ? "0" + n : n);

      let [startHour, startMin] = startTime.split(":").map(Number);
      let [endHour, endMin] = endTime.split(":").map(Number);

      let current = new Date();
      current.setHours(startHour, startMin, 0, 0);

      const end = new Date();
      end.setHours(endHour, endMin, 0, 0);

      const endMinutes = endHour * 60 + endMin;
      while (true) {
        const slotMinutes =
          current.getHours() * 60 + current.getMinutes();
        const jobEnd = slotMinutes + jobDuration;
        if (jobEnd > endMinutes) break;

        const hour = current.getHours();
        const minute = current.getMinutes();
        slots.push(
          `${pad(hour % 12 || 12)}:${pad(minute)} ${
            hour < 12 ? "AM" : "PM"
          }`
        );

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

      return this.bookedTimes.some((booked) => {
        const bookedStart = this.timeStringToMinutes(booked);
        const bookedEnd = bookedStart + 60;
        return slotStart < bookedEnd && slotEnd > bookedStart;
      });
    },

    async fetchBookedTimes() {
      if (!this.date) return;
      try {
        const response = await axios.get(
          "http://localhost:5000/api/available-times",
          {
            params: { date: this.date, duration: this.totalDuration },
          }
        );
        this.availableTimeSlots = response.data;
      } catch (error) {
        console.error("Error fetching available times:", error);
      }
    },

    async submitBooking() {
      if (!this.date || !this.time) {
        alert("Please fill in date and time before proceeding.");
        return;
      }

      try {
        this.message = "Reserving your slot...";
        const bookingData = {
          vehicles: this.vehicles,
          date: this.date,
          time: this.time,
        };

        // 1️⃣ Reserve the slot temporarily (pending)
        const reserveRes = await axios.post("http://localhost:5000/api/reserve-slot", bookingData);
        const bookingId = reserveRes.data.bookingId;

        this.message = "Redirecting to secure payment...";

        // 2️⃣ Get payment form data from your server
        const totalAmount = 50.0; // ⚙️ Replace with dynamic total if needed
        const paymentRes = await axios.post("http://localhost:5000/api/payment-link", {
          bookingId,
          totalAmount,
        });

        const { action, amount } = paymentRes.data;

        // 3️⃣ Build Helcim payment form dynamically and auto-submit
        const form = document.createElement("form");
        form.method = "POST";
        form.action = action;
        form.target = "_self"; // same tab

        const fields = [
          { name: "amount", value: amount },
          // Optional: include booking ID so you can match it later if Helcim redirects back
          { name: "bookingId", value: bookingId },
        ];

        fields.forEach((f) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = f.name;
          input.value = f.value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();

      } catch (error) {
        console.error("Error starting payment:", error);
        this.message = error.response?.data?.message || "Error starting payment. Please try again.";
      }
    },
  },
};
</script>
