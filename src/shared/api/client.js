import axios from 'axios';
import { getToken, removeSession } from '../auth/authStorage';

// Forzar uso del proxy en desarrollo (evitar CORS)
const API_BASE_URL = '/api/v1';
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
  // Carga masiva
  cargarCSV: (formData) =>
    api.post('/premios/cargar-csv', formData, {
      requiresAuth: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  // Gestión de estado
  marcarEnviado: (id) => api.put(`/premios/${id}/marcar-enviado`, {}, { requiresAuth: true }),
  obtenerEnviados: () => api.get('/premios/enviados', { requiresAuth: true }),
  obtenerPendientes: () => api.get('/premios/pendientes', { requiresAuth: true }),
  obtenerReclamados: () => api.get('/premios/reclamados', { requiresAuth: true }),
  // CRUD de premios
  listarPremios: () => api.get('/premios', { requiresAuth: true }),
  obtenerPremio: (id) => api.get(`/premios/${id}`, { requiresAuth: true }),
  crearPremio: (premio) => api.post('/premios', premio, { requiresAuth: true }),
  actualizarPremio: (id, premio) => api.put(`/premios/${id}`, premio, { requiresAuth: true }),
  eliminarPremio: (id) => api.delete(`/premios/${id}`, { requiresAuth: true }),
  obtenerDisponibles: () => api.get('/premios', { requiresAuth: true })
};

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  me: () => api.get('/auth/me', { requiresAuth: true }),
  createFirstAdmin: (adminData) => api.post('/auth/first-admin', adminData),
  registerAdmin: (adminData) => api.post('/auth/register-admin', adminData, { requiresAuth: true }),
  // Gestión de usuarios
  listarUsuarios: () => api.get('/usuarios', { requiresAuth: true }),
  obtenerUsuario: (id) => api.get(`/usuarios/${id}`, { requiresAuth: true }),
  actualizarUsuario: (id, userData) => api.put(`/usuarios/${id}`, userData, { requiresAuth: true }),
  eliminarUsuario: (id) => api.delete(`/usuarios/${id}`, { requiresAuth: true }),
  toggleHabilitado: (id) => api.patch(`/usuarios/${id}/toggle-habilitado`, {}, { requiresAuth: true }),
  cambiarRol: (id, role) => api.put(`/usuarios/${id}/role`, { role }, { requiresAuth: true })
};


export const emparejamientosAPI = {
  listar: () => api.get('/numeros-premiados', { requiresAuth: true }),
  obtenerPorNumero: (numero) => api.get(`/numeros-premiados/${encodeURIComponent(numero)}`, { requiresAuth: true }),
  listarPorPremio: (premioId) => api.get(`/numeros-premiados/premio/${premioId}`, { requiresAuth: true }),
  asignar: (emparejamiento) => api.post('/numeros-premiados', emparejamiento, { requiresAuth: true }),
  eliminarPorNumero: (numero) => api.delete(`/numeros-premiados/${encodeURIComponent(numero)}`, { requiresAuth: true })
};

export const clavesAPI = {
  listar: () => api.get('/claves', { requiresAuth: true }),
  crear: (clave) => api.post('/claves', clave, { requiresAuth: true }),
  obtenerPorAnio: (anio) => api.get(`/claves/${anio}`, { requiresAuth: true }),
  eliminarPorAnio: (anio) => api.delete(`/claves/${anio}`, { requiresAuth: true }),
  listarNumerosConCodigos: (anio, desde, hasta) =>
    api.get(`/claves/${anio}/numeros`, { params: { desde, hasta }, requiresAuth: true }),
  exportarCSV: (anio, desde, hasta) =>
    api.get(`/claves/${anio}/exportar-csv`, { params: { desde, hasta }, requiresAuth: true, responseType: 'blob' }),
  verificarBoleto: (numero, codigo, anio) =>
    api.post('/claves/verificar-boleto', { numero, codigo, anio })
};

export default api;

