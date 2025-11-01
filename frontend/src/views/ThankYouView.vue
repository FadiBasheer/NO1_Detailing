<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../axios';

// Helcim redirects back with transactionId in the query string
const route = useRoute();
const router = useRouter();

type State = 'verifying' | 'confirmed' | 'failed';
const state = ref<State>('verifying');
const errorMsg = ref('');

onMounted(async () => {
  // transactionId comes from Helcim's redirect query params
  const transactionId = route.query.transactionId as string | undefined;
  const bookingId = localStorage.getItem('pendingBookingId');

  if (!transactionId || !bookingId) {
    // No transaction data — likely a direct page visit or Helcim declined before redirecting
    state.value = 'failed';
    errorMsg.value = 'No payment data received.';
    return;
  }

  try {
    await axios.post('/api/payment-success', { bookingId, transactionId });
    localStorage.removeItem('pendingBookingId');
    state.value = 'confirmed';
  } catch (err: any) {
    if (err.response?.status === 401) {
      // Not authenticated, redirect to login
      // Store the current URL to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', window.location.href);
      router.push('/login');
      return;
    }
    state.value = 'failed';
    errorMsg.value = err.response?.data?.message || 'Payment verification failed.';
  }
});
</script>

<template>
  <div class="thank-you">
    <div class="thank-you-box">

      <!-- Verifying -->
      <template v-if="state === 'verifying'">
        <h1>Verifying payment…</h1>
        <p>Please wait while we confirm your booking.</p>
      </template>

      <!-- Confirmed -->
      <template v-else-if="state === 'confirmed'">
        <h1>🎉 Thank You!</h1>
        <p>Your booking has been successfully confirmed and payment received.</p>
        <router-link to="/"><button class="home-btn">Return Home</button></router-link>
      </template>

      <!-- Failed -->
      <template v-else>
        <h1>❌ Payment Failed</h1>
        <p>{{ errorMsg || 'Unfortunately, your payment didn\'t go through. Please try again or contact support.' }}</p>
        <router-link to="/booking"><button class="home-btn retry-btn">Try Again</button></router-link>
      </template>

    </div>
  </div>
</template>

<style scoped>
.thank-you {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background: linear-gradient(135deg, #0b5394, #073763);
  color: white;
  text-align: center;
}

.thank-you-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.thank-you-box h1 {
  margin-bottom: 0.75rem;
}

.home-btn {
  background-color: #00b050;
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.home-btn:hover {
  background-color: #009241;
}

.retry-btn {
  background-color: #c0392b;
}

.retry-btn:hover {
  background-color: #a93226;
}

@media (max-width: 768px) {
  .thank-you {
    padding: 20px;
    height: auto;
    min-height: 80vh;
  }

  .thank-you-box {
    padding: 30px 20px;
  }

  .home-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>
