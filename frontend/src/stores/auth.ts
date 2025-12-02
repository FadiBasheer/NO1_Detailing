import { defineStore } from 'pinia';
import axios from '../axios.ts';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  _inactivityTimer: ReturnType<typeof setTimeout> | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    _inactivityTimer: null,
  }),

  actions: {
    async login(credentials: Record<string, any>) {
      const res = await axios.post('/api/auth/login', credentials);
      this.accessToken = res.data.accessToken;
      this.refreshToken = res.data.refreshToken;
      this.user = res.data.user;

      sessionStorage.setItem('refreshToken', this.refreshToken!);
      sessionStorage.setItem('user', JSON.stringify(this.user));
      sessionStorage.setItem('accessToken', this.accessToken!);

      this.startInactivityTimer();
    },

    async register(userData: Record<string, any>) {
      const res = await axios.post('/api/auth/register', userData);
      this.accessToken = res.data.accessToken;
      this.refreshToken = res.data.refreshToken;
      this.user = res.data.user;

      sessionStorage.setItem('refreshToken', this.refreshToken!);
      sessionStorage.setItem('user', JSON.stringify(this.user));
      sessionStorage.setItem('accessToken', this.accessToken!);

      this.startInactivityTimer();
    },

    async refreshAccessToken() {
      try {
        const res = await axios.post('/api/auth/refresh', {
          refreshToken: this.refreshToken
        });
        this.accessToken = res.data.accessToken;
        sessionStorage.setItem('accessToken', this.accessToken!);
      } catch (error) {
        this.logout();
      }
    },

    logout() {
      this.clearInactivityTimer();

      if (this.refreshToken) {
        axios.post('/api/auth/logout', { refreshToken: this.refreshToken });
      }

      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;

      sessionStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('vehicles');
    },

    initializeAuth() {
      const refreshToken = sessionStorage.getItem('refreshToken');
      const user = sessionStorage.getItem('user');
      const accessToken = sessionStorage.getItem('accessToken');

      if (refreshToken) this.refreshToken = refreshToken;
      if (user) this.user = JSON.parse(user);
      if (accessToken) this.accessToken = accessToken;

      if (this.user) {
        this.startInactivityTimer();
      }
    },

    startInactivityTimer() {
      this.clearInactivityTimer();
      this._inactivityTimer = setTimeout(() => {
        this.logout();
      }, INACTIVITY_TIMEOUT);
    },

    clearInactivityTimer() {
      if (this._inactivityTimer) {
        clearTimeout(this._inactivityTimer);
        this._inactivityTimer = null;
      }
    },

    resetInactivityTimer() {
      if (this.user) {
        this.startInactivityTimer();
      }
    },
  }
});
