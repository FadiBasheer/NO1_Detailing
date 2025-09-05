<template>
  <section class="how-it-works">
    <div class="section-inner">
      <p class="section-label">Simple Process</p>
      <h2>How It Works</h2>
      <p class="section-subtitle">Get your vehicle detailed in 3 easy steps — no hassle, no trips to the shop.</p>

      <div class="steps">
        <div class="step" v-for="(step, index) in steps" :key="index">
          <div class="step-number">{{ index + 1 }}</div>
          <img :src="step.icon" :alt="step.title" />
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </div>
      </div>

      <div class="cta">
        <router-link to="/vehicles">
          <button class="cta-btn">Book Now</button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import calendarIcon from '@/assets/calendar.jpg';
import locationIcon from '@/assets/we_come_to_you.jpg';
import carIcon from '@/assets/looks_clean.jpg';

export default {
  data() {
    return {
      steps: [
        {
          icon: calendarIcon,
          title: 'Book Online',
          text: 'Select your vehicle, service, and a time that works for you — all in a few clicks.'
        },
        {
          icon: locationIcon,
          title: 'We Come to You',
          text: 'Our team arrives at your home, office, or job site with everything we need — water and electricity included.'
        },
        {
          icon: carIcon,
          title: 'Enjoy the Shine',
          text: 'Sit back while we detail your vehicle to a showroom finish, inside and out.'
        }
      ]
    };
  }
};
</script>

<style scoped>
.how-it-works {
  background: #f9fafb;
  padding: 70px 20px;
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.section-label {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 8px;
}

.section-inner h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #0a0a0a;
  margin: 0 0 12px;
}

.section-subtitle {
  font-size: 1rem;
  color: #6b7280;
  max-width: 520px;
  margin: 0 auto 50px;
  line-height: 1.6;
}

.steps {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
}

.step {
  background: white;
  border-radius: 16px;
  padding: 36px 28px;
  width: 300px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.step:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.11);
}

.step-number {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e40af;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
}

.step img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
}

.step h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 10px;
}

.step p {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.cta {
  margin-top: 48px;
}

.cta-btn {
  background-color: #1e40af;
  color: white;
  padding: 13px 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: background-color 0.2s;
}

.cta-btn:hover {
  background-color: #1e3a8a;
}

@media (max-width: 768px) {
  .how-it-works {
    padding: 50px 16px;
  }

  .section-inner h2 {
    font-size: 1.6rem;
  }

  .steps {
    flex-direction: column;
    align-items: center;
  }

  .step {
    width: 100%;
    max-width: 340px;
  }
}
</style>
