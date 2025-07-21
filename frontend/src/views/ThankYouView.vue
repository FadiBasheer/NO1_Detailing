<template>
  <div class="thank-you">
    <div class="thank-you-box">
      <h1>🎉 Thank You!</h1>
      <p>Your booking has been successfully confirmed and payment received.</p>
      <p>We’ll be in touch soon to confirm details.</p>

      <router-link to="/">
        <button class="home-btn">Return Home</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.thank-you {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background: linear-gradient(135deg, #0b5394, #073763);
  color: white;
  text-align: center;
}

.thank-you-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.home-btn {
  background-color: #00b050;
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.home-btn:hover {
  background-color: #009241;
}
</style>
