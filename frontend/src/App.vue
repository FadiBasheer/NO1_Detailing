<template>
  <div>
    <HeaderSection />
    <router-view />
  </div>
</template>

<script>
import HeaderSection from './components/HeaderSection.vue';

export default {
  components: {
    HeaderSection,
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  overflow-x: hidden; 
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: #f4f4f4;
  text-align: center;
}
</style>
