import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: "http://192.168.0.40:5000/api",
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
};

export const eventsService = {
  list: (params?: { page?: number; limit?: number }) => api.get('/events', { params }),
  create: (payload: unknown) => api.post('/events', payload),
  update: (id: string, payload: unknown) => api.put(`/events/${id}`, payload),
  remove: (id: string) => api.delete(`/events/${id}`),
};

export const investorsService = {
  list: (params?: { page?: number; limit?: number }) => api.get('/investors', { params }),
  create: (payload: unknown) => api.post('/investors', payload),
  update: (id: string, payload: unknown) => api.put(`/investors/${id}`, payload),
  remove: (id: string) => api.delete(`/investors/${id}`),
};

export const startupsService = {
  list: (params?: { page?: number; limit?: number }) => api.get('/startups', { params }),
  create: (payload: unknown) => api.post('/startups', payload),
  update: (id: string, payload: unknown) => api.put(`/startups/${id}`, payload),
  remove: (id: string) => api.delete(`/startups/${id}`),
};
