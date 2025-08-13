import axios from 'axios';
import { useAuthStore } from './stores/auth.js';

const instance = axios.create({
  baseURL: 'http://localhost:5000',  // Your backend URL
  timeout: 10000,  // Optional: set a timeout for requests
});

// Request interceptor to add access token
instance.interceptors.request.use(config => {
  const auth = useAuthStore();
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

// Response interceptor to handle token refresh
instance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && error.config && !error.config._retry) {
      error.config._retry = true;
      const auth = useAuthStore();
      await auth.refreshAccessToken();
      error.config.headers.Authorization = `Bearer ${auth.accessToken}`;
      return instance(error.config);
    }
    return Promise.reject(error);
  }
);

export default instance;