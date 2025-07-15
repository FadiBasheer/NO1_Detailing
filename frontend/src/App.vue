<template>
  <div class="app-container">
    <HeaderSection />
    <router-view />
    <FooterSection />
  </div>
</template>

<script>
import HeaderSection from './components/HeaderSection.vue';
import FooterSection from './components/FooterSection.vue';

export default {
  components: {
    HeaderSection,
    FooterSection,
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  background: #f4f4f4;
}

.app-container {
  width: 100%;   /* ✅ make wrapper full width */
  margin: 0;     /* no auto-centering */
  padding: 0;
}
</style>
