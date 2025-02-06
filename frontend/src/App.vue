<template>
  <div>
    <HeaderSection />
    <HeroSection />
    <HowItWorks />
  </div>
</template>

<script>
import HeaderSection from './components/HeaderSection.vue';
import HeroSection from './components/HeroSection.vue';
import HowItWorks from './components/HowItWorks.vue';

export default {
  components: {
    HeaderSection,
    HeroSection,
    HowItWorks,
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: #f4f4f4;
  text-align: center;
}
</style>