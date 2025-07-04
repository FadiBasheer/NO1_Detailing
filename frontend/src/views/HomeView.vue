// Home page

<template>
  <div>
    <HeroSection />
    <HowItWorks />
    <MainSection />
  </div>
</template>

<script>
import HeroSection from '../components/HeroSection.vue';
import HowItWorks from '../components/HowItWorks.vue';
import MainSection from '../components/MainSection.vue';

export default {
  components: {
    HeroSection,
    HowItWorks,
    MainSection,
  }
};
</script>
