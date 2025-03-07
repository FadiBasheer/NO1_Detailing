<template>
  <div class="choose-service">
    <h1>Select Service Type</h1>

    <!-- Service Selection -->
    <div class="service-options">
      <button
        v-for="(service, key) in services"
        :key="key"
        @click="selectService(key)">
        {{ service.name,
        service.duration }}
      </button>
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

.service-options button {
  margin: 10px;
  padding: 15px 30px;
  font-size: 18px;
  cursor: pointer;
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
</style>




 // created() {
 //   //console.log("Vehicle type:", this.vehicleType);
 // },