<template>
  <section class="how-it-works">
    <h2>How it works</h2>
    <div class="carousel-wrapper">
      <!-- Left arrow -->
      <button class="arrow left" @click="scrollLeft">‹</button>

      <!-- Scrollable container -->
      <div class="steps" ref="stepsContainer">
        <div class="step" v-for="(step, index) in steps" :key="index">
          <img :src="step.icon" :alt="step.title" />
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </div>
      </div>

      <!-- Right arrow -->
      <button class="arrow right" @click="scrollRight">›</button>
    </div>
  </section>
</template>

<script>
import calendarIcon from '@/assets/calendar.jpg';
import locationIcon from '@/assets/looks_clean.jpg';
import carIcon from '@/assets/star.png';

export default {
  data() {
    return {
      steps: [
        { icon: calendarIcon, title: "Book Online", text: "Select your vehicle and service type. Choose a date and time." },
        { icon: locationIcon, title: "We come to your location", text: "We bring water and electricity. All we need are your keys." },
        { icon: carIcon, title: "Your vehicle Gets Shiny", text: "We service the interior and exterior of your car." },
        { icon: carIcon, title: "Another Step", text: "Extra description for demo." },
        { icon: carIcon, title: "Step Five", text: "Some details here." }
      ]
    };
  },
  methods: {
    scrollLeft() {
      this.$refs.stepsContainer.scrollBy({ left: -400, behavior: 'smooth' });
    },
    scrollRight() {
      this.$refs.stepsContainer.scrollBy({ left: 400, behavior: 'smooth' });
    }
  }
};
</script>

<style scoped>
.how-it-works {
  text-align: center;
  padding: 50px 20px;
  background: white;
}

.carousel-wrapper {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

.steps {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Hide scrollbar in Firefox */
}
.steps::-webkit-scrollbar {
  display: none; /* Hide scrollbar in Chrome/Safari */
}

.step {
  flex: 0 0 auto;
  width: 300px;
  text-align: center;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
}

.step img {
  width: 60px;
  margin-bottom: 10px;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 50%;
  z-index: 2;
}

.arrow.left {
  left: -40px;
}

.arrow.right {
  right: -40px;
}
</style>
