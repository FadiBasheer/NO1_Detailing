<template>
  <div class="choose-service">
    <h1>Select Service Type</h1>
    <div class="service-options">
      <button @click="selectService('Interior')">Interior</button>
      <button @click="selectService('Exterior')">Exterior</button>
      <button @click="selectService('Both')">Both</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChoosingServiceView",
  data() {
    return {
      vehicleType: this.$route.query.vehicle || "",
    };
  },

  created() {
    //console.log("Vehicle type:", this.vehicleType);
  },

  methods: {
    selectService(serviceType) {
      this.$router.push({
        name: "BookingView",
        query: {
          service: serviceType,
          vehicle: this.vehicleType
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
}

.service-options button {
  margin: 10px;
  padding: 15px 30px;
  font-size: 18px;
  cursor: pointer;
}
</style>
