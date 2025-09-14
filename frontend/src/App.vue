<template>
  <div class="app-container">
    <HeaderSection />
    <div class="page-content">
      <router-view />
    </div>
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
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-content > * {
  flex: 1;
}
</style>
