<template>
  <section class="hero">
    <div class="hero-content">
      <!-- Left side: illustration -->
      <div class="hero-image">
        <img src="@/assets/looks_clean.jpg" alt="Car, RV, Boat, Motorcycle, and Airplane" />
      </div>

      <!-- Right side: text -->
      <div class="hero-text">
        <h1>Mobile Detailing & Wash</h1>
        <p>We’ll come to your home, office, or job site.</p>
        <p>We bring electricity and water!</p>
        <div class="buttons">
          <router-link to="/vehicles">
            <button class="book-btn">BOOK NOW</button>
          </router-link>
          <button class="pricing-btn">VIEW OUR PRICING</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  background: #f9fafb; /* light background instead of overlay */
}

.hero-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  gap: 3rem;
}

.hero-image img {
  max-width: 450px;
  width: 100%;
  height: auto;
}

.hero-text {
  flex: 1;
  text-align: left;
}

.hero-text h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #0a0a0a;
}

.hero-text p {
  margin-top: 10px;
  font-size: 1.2rem;
  color: #333;
}

.buttons {
  margin-top: 20px;
}

.book-btn {
  background-color: #1e40af;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 1rem;
  font-weight: bold;
}

.book-btn:hover {
  background-color: #1e3a8a;
}

.pricing-btn {
  background-color: #f3f4f6;
  color: #111827;
  padding: 12px 24px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.pricing-btn:hover {
  background-color: #e5e7eb;
}
</style>