<template>
  <div class="choose-service">
    <h1>Select Service Type</h1>

    <!-- Service Selection -->
    <div class="service-options">
      <div
        class="service-card"
        :class="{ selected: selectedService === key }"
        v-for="(service, key) in services"
        :key="key"
        @click="selectService(key)"
      >
        <img :src="service.image" :alt="service.name" class="service-image" />
        <h3>{{ service.name }}</h3>
        <ul class="service-features">
          <li v-for="feature in service.features" :key="feature">{{ feature }}</li>
        </ul>
        <div class="service-meta">
          <p class="meta-duration">Duration: {{ service.duration }} min</p>
          <p class="meta-price">Price: ${{ priceFor(key) }}</p>
        </div>
      </div>
    </div>

    <!-- Add-on Options -->
    <div v-if="selectedService" class="addons-section">
      <h2>Add-on Services</h2>
      <div class="addon-option" v-for="(addon, name) in addons" :key="name">
        <label>
          <input
            type="checkbox"
            :value="name"
            v-model="selectedAddons"
          />
          {{ name }} ({{ addon.duration }} mins - ${{ addon.price }})
        </label>
      </div>

      <button @click="goToBooking">Continue to Booking</button>
    </div>
  </div>
</template>

<script>
import { services, addons, servicePricing } from "@/data/services.ts";

export default {
  name: "ChoosingServiceView",
  data() {
    return {
      vehicleType: this.$route.query.vehicle || "",
      selectedService: null,
      selectedAddons: [],
      services,
      addons,
    };
  },
  methods: {
    priceFor(serviceKey) {
      return servicePricing[this.vehicleType]?.[serviceKey] ?? "—";
    },
    selectService(serviceKey) {
      this.selectedService = serviceKey;
      this.selectedAddons = [];
    },
    goToBooking() {
      this.$router.push({
        name: "BookingView",
        query: {
          vehicle: this.vehicleType,
          service: this.selectedService,
          addons: this.selectedAddons.join(","),
        },
      });
    },
  },
};
</script>

<style scoped>

.choose-service {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  padding-bottom: 60px;
}

.addons-section {
  margin-top: 30px;
  text-align: left;
  width: 300px;
}

.addon-option {
  margin-bottom: 10px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
}

.service-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.service-card {
  width: 250px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.service-card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.service-card.selected {
  border: 2px solid #4CAF50;
  background: #f0fff0;
}

.service-features {
  list-style: none;
  padding: 0;
  margin: 12px 0;
  text-align: left;
}

.service-features li {
  font-size: 0.88rem;
  color: #444;
  padding: 4px 0;
  padding-left: 18px;
  position: relative;
}

.service-features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #16a34a;
  font-weight: 700;
}

.service-meta {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #eee;
  text-align: left;
}

.meta-duration {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.meta-price {
  font-size: 1rem;
  font-weight: 800;
  color: #1e40af;
  margin: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .choose-service {
    margin-top: 20px;
    padding: 0 10px;
  }

  .service-options {
    gap: 15px;
  }

  .service-card {
    width: 100%;
    max-width: 300px;
    padding: 10px;
  }

  .service-image {
    height: 120px;
  }

  .addons-section {
    width: 100%;
    max-width: 300px;
  }

  button {
    width: 100%;
  }
}
</style>
