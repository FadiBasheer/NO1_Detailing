import { defineStore } from 'pinia';
import axios from '../axios.ts';

// 1. Define what your Auth State looks like
interface AuthState {
  user: any | null; // Replace 'any' with your User interface if you have one
  accessToken: string | null;
  refreshToken: string | null;
}

export const useAuthStore = defineStore('auth', {
  // 2. Explicitly type the state
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null
  }),

  actions: {
    // 3. Add types to arguments (credentials is usually an object)
    async login(credentials: Record<string, any>) {
      const res = await axios.post('/api/auth/login', credentials);
      this.accessToken = res.data.accessToken;
      this.refreshToken = res.data.refreshToken;
      this.user = res.data.user;
      
      if (this.refreshToken) {
        localStorage.setItem('refreshToken', this.refreshToken);
      }
      if (this.user) {
        localStorage.setItem('user', JSON.stringify(this.user));
      }
      if (this.accessToken) {
        localStorage.setItem('accessToken', this.accessToken);
      }
    },

    async register(userData: Record<string, any>) {
      const res = await axios.post('/api/auth/register', userData);
      this.accessToken = res.data.accessToken;
      this.refreshToken = res.data.refreshToken;
      this.user = res.data.user;
      
      if (this.refreshToken) {
        localStorage.setItem('refreshToken', this.refreshToken);
      }
      if (this.user) {
        localStorage.setItem('user', JSON.stringify(this.user));
      }
      if (this.accessToken) {
        localStorage.setItem('accessToken', this.accessToken);
      }
    },

    async refreshAccessToken() {
      try {
        const res = await axios.post('/api/auth/refresh', { 
          refreshToken: this.refreshToken 
        });
        this.accessToken = res.data.accessToken;
      } catch (error) {
        this.logout();
      }
    },

    logout() {
      if (this.refreshToken) {
        // We don't necessarily need to 'await' this if we're clearing local state anyway
        axios.post('/api/auth/logout', { refreshToken: this.refreshToken });
      }
      
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;

      // Clear local storage
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
      const user = localStorage.getItem('user');
      if (user) {
        this.user = JSON.parse(user);
      }
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        this.accessToken = accessToken;
      }
    }
  }
});