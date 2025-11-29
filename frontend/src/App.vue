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
import { useAuthStore } from './stores/auth';

const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

export default {
  components: {
    HeaderSection,
    FooterSection,
  },
  mounted() {
    if (window.top !== window.self) {
      window.top.location.href = window.location.href;
    }

    const auth = useAuthStore();
    this._resetTimer = () => auth.resetInactivityTimer();
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, this._resetTimer, { passive: true }));
  },
  beforeUnmount() {
    ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, this._resetTimer));
  }
}
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
  height: 100%;
}
</style>
