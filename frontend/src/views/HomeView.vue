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
import HowItWorks from '../components/MainSection.vue';

export default {
  components: {
    HeroSection,
    HowItWorks,
  }
};
</script>
