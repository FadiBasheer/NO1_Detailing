<template>
  <div class="vehicle-selection">
    <h1>Select Your Vehicle Type</h1>
    <div class="vehicle-list">
      <button v-for="vehicle in vehicles" :key="vehicle" @click="selectVehicle(vehicle)">
        {{ vehicle }}
      </button>
    </div>

    <button id="next">
    Next
    </button>

  </div>
</template>

<script>
export default {
  data() {
    return {
      vehicles: ["Sedan", "Small SUV", "Mid-size SUV", "SUV 7 seats", "Small Truck", "Big Truck", "Mini Van", "Commercial Van"]
    };
  },
  methods: {
    selectVehicle(vehicle) {
      this.$router.push(`/booking/${vehicle}`);
    }
  }
};
</script>

<style scoped>
.vehicle-selection {
  text-align: center;
  margin-top: 50px;
}
.vehicle-list button {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
}

#next{
  background-color: #007BFF;
  color: white;
  padding: 10px 15px;
  text-decoration: none;
  border-radius: 5px;
  
}
</style>
