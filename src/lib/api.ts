// API utility for centralized HTTP requests
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Don't redirect on auth-related endpoints to prevent infinite loops
      const isAuthEndpoint = error.config?.url?.includes('/api/auth/');
      const isLoginPage = window.location.pathname === '/login';
      const isRegisterPage = window.location.pathname === '/register';
      
      // Only redirect if we're not already on login/register page and not calling auth endpoints
      if (!isAuthEndpoint && !isLoginPage && !isRegisterPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Auth endpoints
  auth: {
    login: (data: { email: string; password: string }) =>
      api.post('/api/auth/login', data),
    
    register: (data: { username: string; email: string; password: string }) =>
      api.post('/api/auth/register', data),
    
    logout: () => api.post('/api/auth/logout'),
    
    me: () => api.get('/api/auth/me'),
    
    deactivate: () => api.post('/api/auth/deactivate'),
  },

  // User endpoints
  users: {
    getAll: () => api.get('/api/users'),
    
    update: (data: { username: string }) =>
      api.put('/api/users/update', data),
    
    deactivate: () => api.post('/api/users/deactivate'),
  },

  // Message endpoints
  messages: {
    getByUserId: (userId: string) => api.get(`/api/messages/${userId}`),
    
    delete: (messageId: string) => api.delete(`/api/messages/${messageId}`),
    
    upload: (formData: FormData) =>
      api.post('/api/messages/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
  },

  // Chat endpoints
  chats: {
    create: (data: { recipientId: string }) =>
      api.post('/api/chats', data),
  },

  // File upload helper
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/messages/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Export the axios instance for custom requests
export { api };

// Export the base URL for other uses
export { API_BASE_URL }; 