<template>
  <section class="hero">
    <div class="hero-overlay">
      <h1>Mobile Car Detailing & Wash</h1>
      <ul>
        <li>We come to your home, office, or job site</li>
        <li>We bring electricity and water</li>
      </ul>
      <div class="buttons">
        <button class="book-btn">BOOK NOW</button>
        <button class="pricing-btn">VIEW OUR PRICING</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  background: url('/your-image.jpg') no-repeat center center/cover;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-overlay {
  background: rgba(0, 0, 0, 0.6);
  padding: 30px;
  border-radius: 10px;
}

h1 {
  font-size: 36px;
  margin-bottom: 15px;
}

ul {
  list-style: none;
  padding: 0;
  font-size: 18px;
}

.buttons {
  margin-top: 20px;
}

.book-btn, .pricing-btn {
  padding: 12px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 5px;
}

.book-btn {
  background-color: red;
  color: white;
}

.pricing-btn {
  background-color: green;
  color: white;
}
</style>
