<template>
  <header class="header">
    <div class="logo">shiny</div>
    <nav>
      <ul>
        <li><a href="#">Car Detailing</a></li>
        <li><a href="#">Mold Removal</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Reviews</a></li>
        <li><a href="#">FAQs</a></li>
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
