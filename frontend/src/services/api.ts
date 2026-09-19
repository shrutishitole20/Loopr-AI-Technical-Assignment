import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crackit_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      // Only dispatch session expired event for authenticated endpoints, not login/register
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('crackit_auth_token');
        localStorage.removeItem('crackit_user');
        window.dispatchEvent(new CustomEvent('auth:unauthorized', {
          detail: { message: error.response.data?.message || 'Session expired. Please log in again.' }
        }));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
