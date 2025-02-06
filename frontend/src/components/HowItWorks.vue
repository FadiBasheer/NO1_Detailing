<template>
  <section class="how-it-works">
    <h2>How it works</h2>
    <div class="steps">
      <div class="step">
        <img src="@/assets/star.png" alt="Book Online" />
        <h3>Book Online</h3>
        <p>Select your vehicle and service type. Choose a date and time.</p>
      </div>
      <div class="step">
        <img src="@/assets/star.png" alt="We come to you" />
        <h3>We come to your location</h3>
        <p>We bring water and electricity. All we need are your keys.</p>
      </div>
      <div class="step">
        <img src="@/assets/star.png" alt="Your Car Gets Shiny" />
        <h3>Your Car Gets Shiny</h3>
        <p>We service the interior and exterior of your car.</p>
      </div>
    </div>
    <button class="book-service-btn">BOOK A SERVICE</button>
  </section>
</template>

<style scoped>
.how-it-works {
  text-align: center;
  padding: 50px 20px;
  background-color: #f8f9fa;
}

.steps {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.step {
  width: 200px;
}

.step img {
  width: 50px;
  margin-bottom: 10px;
}

.book-service-btn {
  margin-top: 20px;
  padding: 12px 20px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
