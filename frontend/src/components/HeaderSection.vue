<template>
  <header class="header">
    <router-link to="/" class="logo">Star Detailing</router-link>
    <nav>
      <ul>
        <li><a href="#">Car Services</a></li>
        
        <div class="dropdown" @click="toggle">
          <button class="dropdown-btn">Business Programs</button>
          <ul v-if="isOpen" class="dropdown-menu">
            <li><a href="#">An item</a></li>
            <li><a href="#">Another item</a></li>
            <li><a href="#">Another item</a></li>
            <li><a href="#">Another item</a></li>
          </ul>
        </div>

        <li><a href="#">RV services</a></li>
        <li><a href="#">Boats Services</a></li>
        <li><router-link to="/FAQs">FAQs</router-link></li>
        <li><a href="#">Contact</a></li>
      </ul>


    </nav>
    <a href="#" class="pricing-btn">VIEW OUR PRICING</a>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
const toggle = () => isOpen.value = !isOpen.value
</script>


<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #007BFF;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.pricing-btn {
  background-color: #007BFF;
  color: white;
  padding: 10px 15px;
  text-decoration: none;
  border-radius: 5px;
}

.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-menu {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  list-style: none;
  padding: 8px 0;
  margin: 0;
}
.dropdown-menu li {
  padding: 8px 16px;
}
.dropdown-menu li:hover {
  background-color: #eee;
}
</style>
