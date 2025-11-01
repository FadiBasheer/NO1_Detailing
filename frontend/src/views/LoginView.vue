<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="credentials.email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="credentials.password" required />
      </div>
      <button type="submit" :disabled="loading">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
    <router-link to="/register">Don't have an account? Register</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.ts';

const router = useRouter();
const auth = useAuthStore();
const credentials = ref({ email: '', password: '' });
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await auth.login(credentials.value);
    const redirectTo = sessionStorage.getItem('redirectAfterLogin');
    if (redirectTo) {
      sessionStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectTo; // Use window.location to force reload
    } else {
      router.push('/');
    }
  } catch (err) {
    error.value = 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px 60px;
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