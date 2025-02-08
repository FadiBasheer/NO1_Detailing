<template>
  <div class="booking">
    <h1>Book Your {{ vehicleType }}</h1>
    
    <label for="date">Select Date:</label>
    <input type="date" id="date" v-model="selectedDate" />

    <label for="time">Select Time:</label>
    <select id="time" v-model="selectedTime">
      <option v-for="time in availableTimes" :key="time" :value="time">
        {{ time }}
      </option>
    </select>

    <label for="address">Enter Your Address:</label>
    <input type="text" id="address" v-model="address" placeholder="Your Address" />

    <button @click="submitBooking">Submit Booking</button>
  </div>
</template>

<script>
export default {
  props: ["vehicleType"],
  data() {
    return {
      selectedDate: "",
      selectedTime: "",
      address: "",
      availableTimes: [
        "08:00 AM - 09:00 AM",
        "09:00 AM - 10:00 AM",
        "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM",
        "12:00 PM - 01:00 PM",
        "01:00 PM - 02:00 PM",
        "02:00 PM - 03:00 PM",
        "03:00 PM - 04:00 PM",
        "04:00 PM - 05:00 PM",
      ]
    };
  },
  methods: {
    submitBooking() {
      if (!this.selectedDate || !this.selectedTime || !this.address) {
        alert("Please fill in all fields.");
        return;
      }
      alert(`Booking confirmed for ${this.vehicleType} on ${this.selectedDate} at ${this.selectedTime}.\nAddress: ${this.address}`);
    }
  }
};
</script>

<style scoped>
.booking {
  text-align: center;
  margin: 50px auto;
  max-width: 400px;
}
label {
  display: block;
  margin-top: 15px;
}
input, select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}
button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
</style>
