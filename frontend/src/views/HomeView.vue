// Home page

<template>
  <div>
    <HeroSection />
    <HowItWorks />
  </div>
</template>

<script>
import HeroSection from '../components/HeroSection.vue';
import HowItWorks from '../components/HowItWorks.vue';

export default {
  components: {
    HeroSection,
    HowItWorks,
  }
};
</script>
