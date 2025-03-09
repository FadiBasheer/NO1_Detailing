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
        <p>{{ service.description }}</p>
        <p><strong>Duration:</strong> {{ service.duration }} mins</p>
        <p><strong>Price:</strong> ${{ service.price }}</p>
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
import { services, addons } from "@/data/services.js";

export default {
  name: "ChoosingServiceView",
  data() {
    return {
      vehicleType: this.$route.query.vehicle || "",
      selectedService: null,
      selectedAddons: [],
      services,
      addons
    };
  },
  methods: {
    selectService(serviceKey) {
      this.selectedService = serviceKey;
      this.selectedAddons = []; // reset addons
    },
    goToBooking() {
      this.$router.push({
        name: "BookingView",
        query: {
          vehicle: this.vehicleType,
          service: this.selectedService,
          addons: this.selectedAddons.join(",") // send as comma-separated
        }
      });
    }
  }
};
</script>

<style scoped>

.choose-service {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
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


</style>




 // created() {
 //   //console.log("Vehicle type:", this.vehicleType);
 // },