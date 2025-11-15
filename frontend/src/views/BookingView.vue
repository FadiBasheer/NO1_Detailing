<template>
  <div class="booking-wrapper">
  <div class="booking-page">
    <!-- Main booking form -->
    <div class="booking-form">
      <h2>Book Your Appointment</h2>

      <!-- Date -->
      <div class="form-group">
        <label>Select Date:</label>
        <input
          type="date"
          v-model="date"
          :min="todayDate"
          @change="onDateChange"
        />
      </div>

      <!-- Time -->
      <div class="form-group">
        <label>Select Time:</label>
        <select v-model="time">
          <option value="">-- Select a time --</option>
          <option
            v-for="slot in availableTimeSlots"
            :key="slot.time"
            :value="slot.time"
          >
            {{ formatTime(slot.time) }}
          </option>
        </select>
      </div>

      <!-- Submit -->
      <div class="form-group">
        <button @click="submitBooking" class="submit-btn">Pay to Book</button>
      </div>

      <p v-if="message" class="message">{{ message }}</p>
    </div>

    <!-- Cart Sidebar -->
    <div class="cart">
      <h3>Your Booking Cart</h3>

      <div v-if="vehicles.length === 0" class="empty-cart">
        <p>No vehicles added yet.</p>
      </div>

      <div
        v-for="(vehicle, vIndex) in vehicles"
        :key="vIndex"
        class="vehicle-item"
      >
        <div class="vehicle-header">
          <strong>{{ vehicle.vehicleType }} - {{ getServiceName(vehicle.service) }}</strong>
          <span class="item-price">${{ getServicePrice(vehicle.service) }}</span>
        </div>
        <button @click="removeVehicle(vIndex)" class="remove-btn">X</button>

        <!-- Add-ons list -->
        <ul v-if="vehicle.addons.length > 0" class="addons-list">
          <li
            v-for="(addon, aIndex) in vehicle.addons"
            :key="aIndex"
            class="addon-item"
          >
            <span>{{ getAddonName(addon) }}</span>
            <span class="addon-right">
              +${{ getAddonPrice(addon) }}
              <button @click="removeAddon(vIndex, aIndex)" class="remove-btn">X</button>
            </span>
          </li>
        </ul>
      </div>

      <!-- Promo banner -->
      <div v-if="hasActivePromo" class="promo-banner">
        🎉 Free exterior wash applied! (-$80)
      </div>

      <!-- Referral discount banner -->
      <div v-if="hasReferralDiscount" class="referral-banner">
        🎁 Referral discount applied! (10% off)
      </div>

      <!-- Total -->
      <div v-if="vehicles.length > 0" class="cart-total">
        <template v-if="hasActivePromo">
          <div class="total-row original">
            <span>Subtotal</span><span>${{ subtotal }}</span>
          </div>
          <div class="total-row discount">
            <span>Promo discount</span><span>-$80</span>
          </div>
        </template>
        <template v-else-if="hasReferralDiscount">
          <div class="total-row original">
            <span>Subtotal</span><span>${{ subtotal }}</span>
          </div>
          <div class="total-row discount">
            <span>Referral discount (10%)</span><span>-${{ referralDiscountAmount }}</span>
          </div>
        </template>
        <div class="total-row final">
          <span>Total</span><span>${{ totalAmount }}</span>
        </div>
      </div>

      <!-- Add Another Vehicle -->
      <button @click="addAnotherVehicle" class="add-btn">+ Add Another Vehicle</button>
      <br />
      <button @click="clearLocalStorage" class="clear-btn">Clear Cart</button>
    </div>
  </div>
  </div>
</template>

<script>
import axios from "../axios.ts";
import { services, addons } from "@/data/services.ts";
import { useAuthStore } from "@/stores/auth.ts";

export default {
  data() {
    return {
      date: "",
      time: "",
      address: "",
      vehicles: [],
      message: "",
      availableTimeSlots: [],
      helcimMessageHandler: null,
      activeCheckoutToken: null,
    };
  },

  beforeUnmount() {
    if (this.helcimMessageHandler) {
      window.removeEventListener('message', this.helcimMessageHandler);
    }
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

    subtotal() {
      return this.vehicles.reduce((total, vehicle) => {
        const service = services[vehicle.service];
        if (service) total += service.price;
        vehicle.addons.forEach((addonKey) => {
          const addon = addons[addonKey];
          if (addon) total += addon.price;
        });
        return total;
      }, 0);
    },

    hasActivePromo() {
      const auth = useAuthStore();
      return !!(auth.user?.promoCode && !auth.user?.promoUsed);
    },

    hasReferralDiscount() {
      const auth = useAuthStore();
      return !this.hasActivePromo && !!(auth.user?.referralDiscountPending);
    },

    referralDiscountAmount() {
      return (Math.round(this.subtotal * 0.10 * 100) / 100).toFixed(2);
    },

    totalAmount() {
      if (this.hasActivePromo) {
        return Math.max(0, this.subtotal - 80);
      }
      if (this.hasReferralDiscount) {
        return Math.round((this.subtotal - this.subtotal * 0.10) * 100) / 100;
      }
      return this.subtotal;
    },
  },

  methods: {
    getServiceName(key) {
      return services[key]?.name || "Unknown Service";
    },

    getServicePrice(key) {
      return services[key]?.price ?? 0;
    },

    getAddonName(key) {
      return addons[key]?.name || "Unknown Add-on";
    },

    getAddonPrice(key) {
      return addons[key]?.price ?? 0;
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

    formatTime(time24) {
      const [hourStr, minute] = time24.split(":");
      let hour = parseInt(hourStr, 10);
      const period = hour < 12 ? "AM" : "PM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${period}`;
    },

    async fetchBookedTimes() {
      if (!this.date) return;
      try {
        const response = await axios.get(
          `/api/available-times`,
          {
            params: { date: this.date, duration: this.totalDuration },
          }
        );

        this.availableTimeSlots = response.data.availableSlots;
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
        const reserveRes = await axios.post(
          `/api/reserve-slot`,
          bookingData
          );

        const bookingId = reserveRes.data.bookingId;

        this.message = "Opening secure payment...";

        // 2️⃣ Get payment URL from your server
        const paymentRes = await axios.post(
          `/api/payment-link`,
          { bookingId }
        );

        const { checkoutToken } = paymentRes.data;

        if (!checkoutToken) {
          this.message = 'Payment session could not be created. Please try again.';
          return;
        }

        // 3️⃣ Launch HelcimPay.js modal (communicates via postMessage)
        localStorage.setItem('pendingBookingId', bookingId);
        this.message = '';
        this.launchHelcimPay(checkoutToken);

      } catch (error) {
        console.error("Error starting payment:", error);
        this.message = error.response?.data?.message || "Error starting payment. Please try again.";
      }
    },

    launchHelcimPay(checkoutToken) {
      const openModal = () => window.appendHelcimPayIframe(checkoutToken);

      if (!document.querySelector('script[src="https://secure.helcim.app/helcim-pay/services/start.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://secure.helcim.app/helcim-pay/services/start.js';
        script.onload = openModal;
        document.head.appendChild(script);
      } else {
        openModal();
      }

      this.helcimMessageHandler = (event) => {
        if (event.data?.eventStatus === 'SUCCESS') {
          window.removeEventListener('message', this.helcimMessageHandler);
          this.helcimMessageHandler = null;
          const transactionId = event.data.eventMessage?.data?.transactionId;
          if (transactionId) {
            this.$router.push(`/thank-you?transactionId=${transactionId}`);
          }
        } else if (event.data?.eventStatus === 'ABORTED') {
          window.removeEventListener('message', this.helcimMessageHandler);
          this.helcimMessageHandler = null;
          localStorage.removeItem('pendingBookingId');
          this.message = 'Payment was cancelled. Please try again.';
        }
      };
      window.addEventListener('message', this.helcimMessageHandler);
    },
  },
};
</script>

<style scoped>
.booking-wrapper {
  background: #f9fafb;
  padding: 40px 20px 30px;
  min-height: 100%;
  box-sizing: border-box;
}

.booking-page {
  display: flex;
  gap: 28px;
  max-width: 1100px;
  margin: 0 auto;
  align-items: flex-start;
}

.booking-form {
  flex: 2;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
}

.booking-form h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0a0a0a;
  margin: 0 0 24px;
}

.cart {
  flex: 1;
  background: white;
  border: none;
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  position: sticky;
  top: 20px;
}

.cart h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #111827;
  background: #f9fafb;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #1e40af;
  background: white;
}

.submit-btn {
  background-color: #1e40af;
  color: white;
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #1e3a8a;
}

.message {
  margin-top: 12px;
  color: #16a34a;
  font-size: 0.9rem;
}

.empty-cart {
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
  padding: 20px 0;
}

.vehicle-item {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #374151;
}

.vehicle-item strong {
  display: block;
  color: #111827;
  margin-bottom: 4px;
}

.remove-btn {
  margin-left: 6px;
  color: #ef4444;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
}

.addons-list {
  list-style: none;
  padding: 0;
  margin: 6px 0 0 0;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.item-price {
  font-weight: 600;
  color: #1e40af;
  white-space: nowrap;
  font-size: 0.9rem;
}

.addon-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.addon-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.promo-banner {
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.85rem;
  color: #166534;
  font-weight: 600;
  margin: 12px 0 4px;
}

.referral-banner {
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.85rem;
  color: #065f46;
  font-weight: 600;
  margin: 12px 0 4px;
}

.cart-total {
  border-top: 2px solid #e5e7eb;
  margin-top: 12px;
  padding-top: 12px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  padding: 3px 0;
  color: #374151;
}

.total-row.original {
  color: #9ca3af;
  font-size: 0.85rem;
}

.total-row.discount {
  color: #16a34a;
  font-size: 0.85rem;
}

.total-row.final {
  font-weight: 700;
  font-size: 1rem;
  color: #111827;
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid #e5e7eb;
}

.add-btn,
.clear-btn {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  transition: background-color 0.15s;
}

.add-btn:hover,
.clear-btn:hover {
  background: #e5e7eb;
}

.clear-btn {
  margin-top: 8px;
  color: #ef4444;
  border-color: #fca5a5;
}

.clear-btn:hover {
  background: #fef2f2;
}

@media (max-width: 768px) {
  .booking-wrapper {
    padding: 20px 12px 40px;
  }

  .booking-page {
    flex-direction: column;
    gap: 20px;
  }

  .booking-form,
  .cart {
    flex: none;
  }

  .cart {
    order: -1;
    position: static;
  }

  .booking-form {
    padding: 20px;
  }
}
</style>
