<template>
  <section class="how-it-works">
    <h2>How it works</h2>
    <div class="steps">
      <div class="step">
        <img :src="calendarIcon" alt="Book Online" />
        <h3>Book Online</h3>
        <p>Select your vehicle and service type. Choose a date and time.</p>
      </div>
      <div class="step">
        <img :src="locationIcon" alt="We come to you" />
        <h3>We come to your location</h3>
        <p>We bring water and electricity. All we need are your keys.</p>
      </div>
      <div class="step">
        <img :src="carIcon" alt="Your Car Gets Shiny" />
        <h3>Your Car Gets Shiny</h3>
        <p>We service the interior and exterior of your car.</p>
      </div>
      <div class="step">
        <img :src="carIcon" alt="Your Car Gets Shiny" />
        <h3>Your Car Gets Shiny</h3>
        <p>We service the interior and exterior of your car.</p>
      </div>
      <div class="step">
        <img :src="carIcon" alt="Your Car Gets Shiny" />
        <h3>Your Car Gets Shiny</h3>
        <p>We service the interior and exterior of your car.</p>
      </div>
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
      calendarIcon,
      locationIcon,
      carIcon
    };
  }
};
</script>

<style scoped>
.how-it-works {
  text-align: center;
  padding: 50px 20px;
  background: white;
}

.steps {
  max-width: 1200px; /* Prevents stretching */
  margin: 0 auto; /* Centers content */
  display: flex; /* Aligns items */
  justify-content: center; /* Centers inside */
  flex-wrap: wrap; /* Prevents overflow */
  gap: 20px; /* Space between steps */
}

.step {
  width: 350px;
  text-align: center;
}

.step img {
  width: 60px;
  margin-bottom: 10px;
}

h2 {
  margin-bottom: 20px;
}
</style>
