import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const isFormData = (payload: unknown): payload is FormData => payload instanceof FormData;

const withPayloadHeaders = (payload: unknown) =>
  isFormData(payload)
    ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    : undefined;

export const api = axios.create({
  baseURL: API_BASE_URL,
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
  list: () => api.get('/events'),
  create: (payload: unknown) => api.post('/events', payload, withPayloadHeaders(payload)),
  update: (id: string, payload: unknown) => api.put(`/events/${id}`, payload, withPayloadHeaders(payload)),
  remove: (id: string) => api.delete(`/events/${id}`),
};

export const investorsService = {
  list: () => api.get('/investors'),
  create: (payload: unknown) => api.post('/investors', payload, withPayloadHeaders(payload)),
  update: (id: string, payload: unknown) => api.put(`/investors/${id}`, payload, withPayloadHeaders(payload)),
  remove: (id: string) => api.delete(`/investors/${id}`),
};

export const startupsService = {
  list: () => api.get('/startups'),
  create: (payload: unknown) => api.post('/startups', payload, withPayloadHeaders(payload)),
  update: (id: string, payload: unknown) => api.put(`/startups/${id}`, payload, withPayloadHeaders(payload)),
  remove: (id: string) => api.delete(`/startups/${id}`),
};
