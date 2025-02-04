<template>
  <section class="hero">
    <div class="overlay">
      <h1>Mobile Car Detailing & Wash</h1>
      <ul>
        <li>We come to your home, office or job site</li>
        <li>We bring electricity and water</li>
      </ul>
      <div class="buttons">
        <button class="book-now">BOOK NOW</button>
        <button class="view-pricing">VIEW OUR PRICING</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: url('@/assets/van-background.jpg') no-repeat center center/cover;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}
.overlay {
  background: rgba(0, 0, 0, 0.6);
  padding: 40px;
  color: white;
}
h1 {
  font-size: 36px;
}
.buttons {
  margin-top: 20px;
}
.book-now {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  margin-right: 10px;
}
.view-pricing {
  background-color: green;
  color: white;
  padding: 10px 20px;
  border: none;
}
</style>
