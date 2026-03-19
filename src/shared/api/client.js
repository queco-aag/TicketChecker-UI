import axios from 'axios';
import { getToken, removeSession } from '../auth/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT
});

api.interceptors.request.use(
  (config) => {
    if (config.requiresAuth) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const payload = error?.response?.data;

    if (status === 401) {
      removeSession();
    }

    const message =
      payload?.mensaje || payload?.message || error.message || 'Error inesperado al conectar con la API';

    return Promise.reject(new Error(message));
  }
);

export const ticketsAPI = {
  verificar: (numero) => api.get(`/numeros/${encodeURIComponent(numero)}/verificar`),
  reclamar: (numero, formData) =>
    api.post(`/numeros/${encodeURIComponent(numero)}/reclamar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export const rewardsAPI = {
  cargarCSV: (formData) =>
    api.post('/premios/cargar-csv', formData, {
      requiresAuth: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  marcarEnviado: (id) => api.put(`/premios/${id}/marcar-enviado`, {}, { requiresAuth: true }),
  obtenerEnviados: () => api.get('/premios/enviados', { requiresAuth: true }),
  obtenerPendientes: () => api.get('/premios/pendientes', { requiresAuth: true }),
  obtenerReclamados: () => api.get('/premios/reclamados', { requiresAuth: true })
};

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  me: () => api.get('/auth/me', { requiresAuth: true }),
  createFirstAdmin: (adminData) => api.post('/auth/first-admin', adminData),
  registerAdmin: (adminData) => api.post('/auth/register-admin', adminData, { requiresAuth: true })
};

export default api;

