<template>
  <header class="header">
    <a href="#" class="logo">Star Detailing</a>
    <nav>
      <ul>
        <li><a href="#">Car Services</a></li>
        <li><a href="#">Fleet Services</a></li>
        <li><a href="#">RV services</a></li>
        <li><a href="#">Boats Services</a></li>
        <li><router-link to="/FAQs">FAQs</router-link></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
    <a href="#" class="pricing-btn">VIEW OUR PRICING</a>
  </header>
</template>

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
</style>
