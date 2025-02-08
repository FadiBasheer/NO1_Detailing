<template>
  <section class="hero">
    <div class="overlay">
      <h1>Mobile Car Detailing & Wash</h1>
      <p>We come to your home, office, or job site</p>
      <p>We bring electricity and water</p>
      <div class="buttons">
        <router-link to="/vehicles">
          <button>BOOK NOW</button>
        </router-link>
        <button class="pricing-btn">VIEW OUR PRICING</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  background: url('@/assets/looks_clean.jpg') no-repeat center center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.overlay {
  background: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 10px;
  color: white;
  max-width: 600px;
  width: 100%;
}

.buttons {
  margin-top: 20px;
}

.book-btn {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

.pricing-btn {
  background-color: green;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}
</style>
