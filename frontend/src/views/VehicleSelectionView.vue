<template>
  <div class="vehicle-selection">
    <h1>Select Your Vehicle Type</h1>

    <div class="vehicle-grid">
      <button
        v-for="vehicle in vehicles"
        :key="vehicle.name"
        class="vehicle-button"
        :class="{ selected: selectedVehicle === vehicle.name }"
        @click="selectVehicle(vehicle.name)"
      >
        <img :src="vehicle.image" :alt="vehicle.name" />
        <span>{{ vehicle.name }}</span>
      </button>
    </div>

    <div class="form-section">
      <input
        type="text"
        v-model="brand"
        placeholder="Car Brand (e.g. Toyota)"
      />
      <input
        type="text"
        v-model="model"
        placeholder="Car Model (e.g. Camry)"
      />
      <button @click="goToNextPage" :disabled="!canProceed">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vehicles: [
        { name: "Sedan/Coupe", image: "/images/sedan.png" },
        { name: "Small SUV", image: "/images/small-suv.png" },
        { name: "Mid-size SUV", image: "/images/mid-suv.png" },
        { name: "SUV 7 seats", image: "/images/suv-7.png" },
        { name: "Mini Van", image: "/images/minivan.png" },
        { name: "Small Truck", image: "/images/small-truck.png" },
        { name: "Big Truck", image: "/images/big-truck.png" },
        { name: "Commercial Van", image: "/images/van.png" },
        { name: "Motorcycle", image: "/images/minivan.png" },
        { name: "RV/Trailer", image: "/images/minivan.png" },
        { name: "Boats", image: "/images/minivan.png" }
      ],
      selectedVehicle: null,
      brand: '',
      model: ''
    };
  },
  computed: {
    canProceed() {
      return this.selectedVehicle && this.brand && this.model;
    }
  },
  methods: {
    selectVehicle(name) {
      this.selectedVehicle = name;
    },
    goToNextPage() {
      if (this.canProceed) {
        // Pass data via query params or route params
        this.$router.push({
          path: `/booking/${this.selectedVehicle}`,
          query: {
            brand: this.brand,
            model: this.model
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.vehicle-selection {
  text-align: center;
  margin: 40px auto;
  padding: 0 20px;
}

.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.vehicle-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  border: 2px solid #ddd;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.vehicle-button.selected {
  border-color: #007bff;
  background-color: #eef5ff;
}

.vehicle-button img {
  max-width: 100px;
  height: auto;
  margin-bottom: 10px;
}

.vehicle-button span {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.form-section {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.form-section input {
  padding: 10px 12px;
  width: 250px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.form-section button {
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.form-section button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.form-section button:hover:enabled {
  background-color: #0056b3;
}
</style>
