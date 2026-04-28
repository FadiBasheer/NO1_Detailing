<template>
  <div class="gift-cards">
    <div class="coming-soon-box">
      <div class="icon">🎁</div>
      <h1>Gift Cards</h1>
      <div class="badge">Coming Soon</div>
      <p>We're working on gift cards so you can share the joy of a clean car with someone special.</p>
      <p class="sub">Check back soon — this feature is on its way!</p>
      <router-link to="/"><button class="home-btn">Back to Home</button></router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.gift-cards {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 40px 20px;
}

.coming-soon-box {
  text-align: center;
  max-width: 480px;
}

.icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

h1 {
  font-size: 2.2rem;
  color: #007BFF;
  margin-bottom: 16px;
}

.badge {
  display: inline-block;
  background: #f98203d8;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 14px;
  border-radius: 999px;
  margin-bottom: 24px;
}

p {
  color: #555;
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 8px;
}

.sub {
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 32px;
}

.home-btn {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.home-btn:hover {
  background-color: #0056b3;
}
</style>
