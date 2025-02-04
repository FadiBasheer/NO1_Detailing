<template>
  <header class="header">
    <div class="logo">shiny</div>
    <nav>
      <ul>
        <li><a href="#">Car Detailing</a></li>
        <li><a href="#">Mold Removal</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Reviews</a></li>
        <li><a href="#">Contact</a></li>
        <li><button class="pricing-btn">VIEW OUR PRICING</button></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.logo {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}
nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
}
nav a {
  text-decoration: none;
  color: black;
}
.pricing-btn {
  background-color: #007bff;
  color: white;
  padding: 8px 15px;
  border: none;
  cursor: pointer;
}
</style>
