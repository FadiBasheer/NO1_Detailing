<template>
  <div id="app">
    <header>
      <h1>Welcome to Our Mobile Detailing Service</h1>
      <p>Your car, our service – whenever you need it!</p>
    </header>

    <main>
      <section class="services">
        <h2>Our Services</h2>
        <ul>
          <li><strong>Basic Service:</strong> A quick wash and exterior cleaning.</li>
          <li><strong>Silver Service:</strong> Basic service + interior cleaning.</li>
          <li><strong>Gold Service:</strong> Complete detailing including engine cleaning.</li>
        </ul>
      </section>

      <section class="reservation">
        <h2>Book a Reservation</h2>
        <button @click="bookReservation">Reserve Now</button>
      </section>

      <section class="message">
        <h2>Message from Backend</h2>
        <p>{{ message }}</p>
      </section>
    </main>

    <footer>
      <p>&copy; 2025 Mobile Detailing Service | All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import axios from './axios';

export default {
  data() {
    return {
      message: '',
    };
  },
  mounted() {
    this.getMessage();
  },
  methods: {
    async getMessage() {
      try {
        const response = await axios.get('/');
        this.message = response.data;  // The data from backend (e.g., "Mobile Detailing Backend is running")
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    bookReservation() {
      // Add your reservation system functionality here
      alert('You can now reserve a time slot!');
    },
  },
};
</script>

<style scoped>
#app {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  color: #333;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

.services {
  margin-bottom: 30px;
}

.services ul {
  list-style: none;
  padding: 0;
}

.services li {
  margin: 10px 0;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

footer {
  text-align: center;
  margin-top: 30px;
}
</style>
