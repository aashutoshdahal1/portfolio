import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    return response.data;
  },

  verify: async () => {
    try {
      const response = await api.post('/auth/verify');
      return response.data;
    } catch (error) {
      localStorage.removeItem('admin_token');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
  },
};

// Content API
export const contentAPI = {
  getContent: async () => {
    const response = await api.get('/content');
    return response.data;
  },

  updateContent: async (content: any) => {
    const response = await api.put('/content', content);
    return response.data;
  },
};

// Contact API
export const contactAPI = {
  submitContact: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  getContacts: async (params?: { status?: string; limit?: number; skip?: number }) => {
    const response = await api.get('/contact', { params });
    return response.data;
  },

  updateContactStatus: async (id: string, status: 'new' | 'read' | 'responded') => {
    const response = await api.patch(`/contact/${id}/status`, { status });
    return response.data;
  },

  deleteContact: async (id: string) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },
};

export default api;
