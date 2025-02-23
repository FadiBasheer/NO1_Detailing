<template> 
  <div class="address-selection">
    <h1>Enter Your Address</h1>
    <input
      type="text"
      ref="autocompleteInput"
      placeholder="Enter your address"
      class="address-input"
    />
    <button @click="goToBooking">Continue</button>
  </div>
</template>

<script>
export default {
  name: "AddressSelectionView",
  data() {
    return {
      address: "",
      autocomplete: null,
    };
  },
  mounted() {
    // Wait for Google Maps to be fully loaded
    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(interval);
        const input = this.$refs.autocompleteInput;
        this.autocomplete = new google.maps.places.Autocomplete(input);
        this.autocomplete.addListener("place_changed", () => {
          const place = this.autocomplete.getPlace();
          this.address = place?.formatted_address || "";
        });
      }
    }, 100);
  },
  methods: {
    goToBooking() {
      if (!this.address) {
        alert("Please enter a valid address.");
        return;
      }

      this.$router.push({
        name: "BookingView",
        query: { address: this.address },
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
  margin-top: 50px;
}
.address-input {
  width: 300px;
  padding: 10px;
  margin-bottom: 20px;
}
</style>
