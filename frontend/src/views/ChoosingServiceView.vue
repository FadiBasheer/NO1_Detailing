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
      address: this.$route.query.address || "",
    };
  },
  methods: {
    selectService(serviceType) {
      this.$router.push({
        name: "BookingView",
        query: {
          address: this.address,
          service: serviceType,
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
