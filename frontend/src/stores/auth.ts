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
      sessionStorage.removeItem('vehicles');
      localStorage.removeItem('vehicles');
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },

    initializeAuth() {
      // Read from sessionStorage first; fall back to localStorage so existing
      // sessions (saved before this change) are not immediately logged out.
      const refreshToken = sessionStorage.getItem('refreshToken') ?? localStorage.getItem('refreshToken');
      const user = sessionStorage.getItem('user') ?? localStorage.getItem('user');
      const accessToken = sessionStorage.getItem('accessToken') ?? localStorage.getItem('accessToken');

      if (refreshToken) {
        this.refreshToken = refreshToken;
        sessionStorage.setItem('refreshToken', refreshToken);
        localStorage.removeItem('refreshToken');
      }
      if (user) {
        this.user = JSON.parse(user);
        sessionStorage.setItem('user', user);
        localStorage.removeItem('user');
      }
      if (accessToken) {
        this.accessToken = accessToken;
        sessionStorage.setItem('accessToken', accessToken);
        localStorage.removeItem('accessToken');
      }

      // Don't call refreshAccessToken() here — the axios interceptor handles
      // token refresh automatically when a 401 is returned by any API call.
      // Calling it here risks wiping the session if the network is slow or
      // the refresh endpoint hiccups on load.
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
