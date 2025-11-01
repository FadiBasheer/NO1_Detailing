<template>
  <div class="register-container">
    <h2>Register</h2>
    <div v-if="promoCode" class="promo-notice">
      🎉 Your free exterior wash is reserved — it will be applied automatically on your first booking.
    </div>
    <div v-if="referralCode" class="referral-notice">
      🎁 10% off your first booking will be applied automatically at checkout.
    </div>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="userData.email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="userData.password" required />
      </div>
      <button type="submit" :disabled="loading">Register</button>
    </form>
    <p v-if="error">{{ error }}</p>
    <router-link to="/login">Already have an account? Login</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.ts';

const router = useRouter();
const auth = useAuthStore();
const userData = ref({ email: '', password: '' });
const loading = ref(false);
const error = ref('');
const promoCode = ref('');
const referralCode = ref('');

onMounted(() => {
  const storedPromo = sessionStorage.getItem('promoCode');
  if (storedPromo) promoCode.value = storedPromo;
  const storedReferral = sessionStorage.getItem('referralCode');
  if (storedReferral) referralCode.value = storedReferral;
});

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  try {
    const payload = { ...userData.value };
    if (promoCode.value) payload.promoCode = promoCode.value;
    if (referralCode.value) payload.referralCode = referralCode.value;
    await auth.register(payload);
    sessionStorage.removeItem('promoCode');
    sessionStorage.removeItem('referralCode');
    // Check for redirect after login
    const redirectTo = sessionStorage.getItem('redirectAfterLogin');
    if (redirectTo) {
      sessionStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectTo;
    } else {
      // Check if there are vehicles in cart, redirect to booking
      const vehicles = localStorage.getItem('vehicles');
      if (vehicles && JSON.parse(vehicles).length > 0) {
        router.push('/booking');
      } else {
        router.push('/');
      }
    }
  } catch (err) {
    error.value = 'Registration failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.promo-notice {
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.92rem;
  color: #166534;
  margin-bottom: 18px;
  font-weight: 500;
}
.referral-notice {
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.92rem;
  color: #065f46;
  margin-bottom: 18px;
  font-weight: 500;
}
form div {
  margin-bottom: 10px;
}
input {
  width: 100%;
  padding: 8px;
}
button {
  padding: 10px;
  width: 100%;
}
</style>