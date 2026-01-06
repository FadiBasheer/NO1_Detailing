<template>
  <div class="address-selection">
    <h1>Where Should We Come?</h1>
    <p class="subtitle">We'll come to you — enter the address where you'd like the service performed.</p>

    <!-- Selection summary -->
    <div class="summary-card">
      <div class="summary-row">
        <span class="summary-label">Vehicle</span>
        <span class="summary-value">{{ vehicle }}<span v-if="brand"> &mdash; {{ brand }} {{ model }}</span></span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Service</span>
        <span class="summary-value">{{ serviceName }}</span>
      </div>
      <div class="summary-row" v-if="addonList.length > 0">
        <span class="summary-label">Add-ons</span>
        <span class="summary-value">{{ addonList.join(", ") }}</span>
      </div>
    </div>

    <!-- Address input -->
    <div class="address-field">
      <label for="address-input">Service Address</label>
      <input
        id="address-input"
        type="text"
        ref="autocompleteInput"
        v-model="address"
        placeholder="Start typing your address…"
        class="address-input"
        autocomplete="off"
      />
      <p class="field-hint">We service the Calgary area. Please confirm the address is correct before continuing.</p>
    </div>

    <button class="continue-btn" @click="goToBooking" :disabled="!address.trim()">
      Continue to Booking
    </button>
  </div>
</template>

<script>
import { services } from "@/data/services.ts";
import { useAuthStore } from "@/stores/auth.ts";

export default {
  name: "AddressSelectionView",
  data() {
    return {
      vehicle: this.$route.query.vehicle || "",
      brand: this.$route.query.brand || "",
      model: this.$route.query.model || "",
      service: this.$route.query.service || "",
      addons: this.$route.query.addons || "",
      address: "",
      autocomplete: null,
    };
  },
  computed: {
    serviceName() {
      return services[this.service]?.name || this.service || "—";
    },
    addonList() {
      return this.addons ? this.addons.split(",").filter(Boolean) : [];
    },
  },
  mounted() {
    const savedAddress = localStorage.getItem("bookingAddress");
    if (savedAddress) this.address = savedAddress;

    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(interval);
        const input = this.$refs.autocompleteInput;
        this.autocomplete = new google.maps.places.Autocomplete(input, {
          componentRestrictions: { country: "ca" },
          fields: ["formatted_address"],
        });
        this.autocomplete.addListener("place_changed", () => {
          const place = this.autocomplete.getPlace();
          if (place?.formatted_address) {
            this.address = place.formatted_address;
          }
        });
      }
    }, 100);
  },
  methods: {
    goToBooking() {
      if (!this.address.trim()) {
        alert("Please enter a valid address.");
        return;
      }
      localStorage.setItem("bookingAddress", this.address);
      this.$router.push({
        name: "BookingView",
        query: {
          vehicle: this.vehicle,
          brand: this.brand,
          model: this.model,
          service: this.service,
          addons: this.addons,
          address: this.address,
        },
      });
    },
  },
};
</script>

<style scoped>
.address-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px 80px;
  max-width: 540px;
  margin: 0 auto;
}

h1 {
  font-size: 1.7rem;
  font-weight: 800;
  color: #0a0a0a;
  margin: 0 0 8px;
  text-align: center;
}

.subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  text-align: center;
  margin: 0 0 28px;
}

.summary-card {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 28px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding: 5px 0;
  font-size: 0.9rem;
}

.summary-row + .summary-row {
  border-top: 1px solid #e5e7eb;
}

.summary-label {
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
}

.summary-value {
  color: #111827;
  text-align: right;
}

.address-field {
  width: 100%;
  margin-bottom: 24px;
}

.address-field label {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 6px;
}

.address-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #111827;
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.address-input:focus {
  outline: none;
  border-color: #1e40af;
}

.field-hint {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 6px 0 0;
}

.continue-btn {
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 13px 32px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.continue-btn:hover:enabled {
  background: #1e3a8a;
}

.continue-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .address-selection {
    padding: 30px 16px 60px;
  }

  h1 {
    font-size: 1.4rem;
  }
}
</style>
