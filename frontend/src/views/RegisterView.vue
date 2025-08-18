<template>
  <div class="register-container">
    <h2>Register</h2>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.ts';

const router = useRouter();
const auth = useAuthStore();
const userData = ref({ email: '', password: '' });
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  try {
    await auth.register(userData.value);
    router.push('/login');
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