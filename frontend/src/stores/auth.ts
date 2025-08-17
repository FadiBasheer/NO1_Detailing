import { defineStore } from 'pinia';
import axios from '../axios.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null
  }),
  actions: {
    async login(credentials) {
      const res = await axios.post('/api/auth/login', credentials);
      this.accessToken = res.data.accessToken;
      this.refreshToken = res.data.refreshToken;
      this.user = res.data.user;
      localStorage.setItem('refreshToken', this.refreshToken);
    },
    async register(userData) {
      await axios.post('/api/auth/register', userData);
    },
    async refreshAccessToken() {
      try {
        const res = await axios.post('/api/auth/refresh', { refreshToken: this.refreshToken });
        this.accessToken = res.data.accessToken;
      } catch (error) {
        this.logout();
      }
    },
    logout() {
      if (this.refreshToken) {
        axios.post('/api/auth/logout', { refreshToken: this.refreshToken });
        localStorage.removeItem("vehicles");

      }
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;

      // clear local storage
      localStorage.removeItem("vehicles");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    initializeAuth() {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        this.refreshToken = refreshToken;
        this.refreshAccessToken();
      }
    }
  }
});