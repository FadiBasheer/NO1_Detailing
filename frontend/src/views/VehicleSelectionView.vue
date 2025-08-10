<template>
  <div class="vehicle-selection">
    <h1>Select Your Vehicle Type</h1>

    <!-- Vehicle type grid -->
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

    <!-- Brand + Model dropdowns -->
    <div class="form-section">
      <label for="brand">Car Brand:</label>
      <select id="brand" v-model="brand" @change="resetModel">
        <option disabled value="">Choose a brand</option>
        <option v-for="(models, brandName) in brands" :key="brandName" :value="brandName">
          {{ brandName }}
        </option>
      </select>

      <label for="model">Car Model:</label>
      <select id="model" v-model="model" :disabled="!brand">
        <option disabled value="">Choose a model</option>
        <option v-for="m in brands[brand] || []" :key="m" :value="m">
          {{ m }}
        </option>
      </select>

      <button @click="goToServiceSelection" :disabled="!canProceed">Next</button>
    </div>
  </div>
</template>

<script>
import brands from "@/data/vehicles.js"; // ✅ import your brand/model list

import sedan from "@/assets/sedan.jpg";
import smallSUV from "@/assets/small-suv.jpg";
import midSuv from "@/assets/mid-suv.jpg";
import suv7 from "@/assets/suv-7.jpg";
import minivan from "@/assets/minivan.jpg";
import smallTruck from "@/assets/small-truck.jpg";
import bigTruck from "@/assets/big-truck.jpg";
import commercialVan from "@/assets/commercial-van.jpg";
import motorcycle from "@/assets/motorcycle.jpg";
import rvTrailer from "@/assets/rv-trailer.jpg";
import boats from "@/assets/boats.jpg";

export default {
  data() {
    return {
      vehicles: [
        { name: "Sedan/Coupe", image: sedan },
        { name: "Small SUV", image: smallSUV },
        { name: "Mid-size SUV", image: midSuv },
        { name: "SUV 7 seats", image: suv7 },
        { name: "Mini Van", image: minivan },
        { name: "Small Truck", image: smallTruck },
        { name: "Big Truck", image: bigTruck },
        { name: "Commercial Van", image: commercialVan },
        { name: "Motorcycle", image: motorcycle },
        { name: "RV/Trailer", image: rvTrailer },
        { name: "Boats", image: boats }
      ],

      selectedVehicle: null,
      brand: "",
      model: "",
      brands // ✅ imported car brands/models
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
    resetModel() {
      this.model = "";
    },
    goToServiceSelection() {
      if (this.canProceed) {
        this.$router.push({
          name: "ChoosingServiceView", // must exist in your router
          query: {
            vehicle: this.selectedVehicle,
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

.form-section label {
  font-weight: bold;
}

.form-section select,
.form-section button {
  padding: 10px 12px;
  width: 250px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.form-section button {
  background-color: #007bff;
  border: none;
  color: white;
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
