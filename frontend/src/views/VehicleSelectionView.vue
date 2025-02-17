<template>
  <div class="vehicle-selection">
    <h1>Select Your Vehicle Type</h1>

    <div class="vehicle-list">
      <button v-for="vehicle in vehicles" :key="vehicle" @click="selectedVehicle = vehicle" 
      :class="{ selected: selectedVehicle === vehicle }">
        {{ vehicle }}
      </button>
    </div>

    <div v-if="selectedVehicle" class="vehicle-details">
      <input
        v-model="brand"
        type="text"
        placeholder="Car Brand (e.g. Toyota)"
      />
      <input
        v-model="model"
        type="text"
        placeholder="Car Model (e.g. Corolla)"
      />
    </div>

    <button
      id="next"
      :disabled="!selectedVehicle || !brand || !model"
      @click="goToBooking"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vehicles: [
        "Sedan/Coupe", "Small SUV", "Mid-size SUV", "SUV 7 seats",
        "Small Truck", "Big Truck", "Mini Van", "Commercial Van", "Small size Truck", "Full size Truck", "Motorcycles", "RVs", "Trailer", "Boats"
      ],
      selectedVehicle: null,
      brand: '',
      model: ''
    };
  },
  methods: {
    goToBooking() {
      const vehicle = this.selectedVehicle;
      const brand = encodeURIComponent(this.brand);
      const model = encodeURIComponent(this.model);
      this.$router.push(`/booking/${vehicle}?brand=${brand}&model=${model}`);
    }
  }
};
</script>

<style scoped>
.vehicle-details input {
  display: block;
  margin: 10px auto;
  padding: 8px;
  width: 200px;
  font-size: 16px;
}

.selected {
  background-color: #007BFF;
  color: white;
  font-weight: bold;
}

#next {
  background-color: #007BFF;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  margin-top: 20px;
  cursor: pointer;
}

#next:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>