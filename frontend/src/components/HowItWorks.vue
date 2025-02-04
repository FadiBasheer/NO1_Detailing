<template>
  <section class="how-it-works">
    <h2>How it works</h2>
    <div class="steps">
      <div class="step">
        <img src="@/assets/star.png" alt="Book Online">
        <h3>Book Online</h3>
        <p>Select your vehicle and service type. Choose a date and time.</p>
      </div>
      <div class="step">
        <img src="@/assets/star.png" alt="We come to you">
        <h3>We come to your location</h3>
        <p>We bring our own water and electricity.</p>
      </div>
      <div class="step">
        <img src="@/assets/star.png" alt="Car Gets Shiny">
        <h3>Your Car Gets Shiny</h3>
        <p>We detail your car inside and out.</p>
      </div>
    </div>
    <button class="book-service">BOOK A SERVICE</button>
  </section>
</template>

<style scoped>
.how-it-works {
  text-align: center;
  padding: 50px 20px;
}
.steps {
  display: flex;
  justify-content: center;
  gap: 40px;
}
.step img {
  width: 60px;
}
.book-service {
  background-color: green;
  color: white;
  padding: 10px 20px;
  border: none;
  margin-top: 20px;
}
</style>
