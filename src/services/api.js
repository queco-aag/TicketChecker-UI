import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para peticiones - agregar token de autenticación si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token && config.url.includes('/admin')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas - manejo de errores centralizado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const { status, data } = error.response;

      if (status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('adminToken');
        if (window.location.pathname.includes('/admin')) {
          window.location.href = '/admin/login';
        }
      } else if (status === 403) {
        console.error('Acceso denegado');
      } else if (status === 404) {
        console.error('Recurso no encontrado');
      } else if (status >= 500) {
        console.error('Error del servidor');
      }

      // Agregar mensaje de error legible
      error.message = data?.message || data?.mensaje || error.message;
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      error.message = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
    }

    return Promise.reject(error);
  }
);

// API de Números (Endpoints públicos)
export const numerosAPI = {
  /**
   * Verificar si un número tiene premio
   * @param {string} numero - Número a verificar
   * @returns {Promise} Respuesta con información del premio si existe
   */
  verificar: (numero) => api.get(`/numeros/${numero}/verificar`),

  /**
   * Reclamar un premio asociado a un número
   * @param {string} numero - Número del ticket
   * @param {FormData} formData - Datos del formulario con información del ganador
   * @returns {Promise} Confirmación de reclamo
   */
  reclamar: (numero, formData) => api.post(`/numeros/${numero}/reclamar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// API de Premios (Endpoints administrativos)
export const premiosAPI = {
  /**
   * Cargar premios desde un archivo CSV
   * @param {FormData} formData - Archivo CSV con los premios
   * @returns {Promise} Resultado de la carga
   */
  cargarCSV: (formData) => api.post('/premios/cargar-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  /**
   * Marcar un premio como enviado
   * @param {number} id - ID del premio
   * @returns {Promise} Confirmación de actualización
   */
  marcarEnviado: (id) => api.put(`/premios/${id}/marcar-enviado`),

  /**
   * Obtener lista de premios enviados
   * @returns {Promise} Array de premios enviados
   */
  obtenerEnviados: () => api.get('/premios/enviados'),

  /**
   * Obtener lista de premios pendientes de envío
   * @returns {Promise} Array de premios pendientes
   */
  obtenerPendientes: () => api.get('/premios/pendientes'),

  /**
   * Obtener lista de premios reclamados
   * @returns {Promise} Array de premios reclamados
   */
  obtenerReclamados: () => api.get('/premios/reclamados'),
};

// API de Autenticación
export const authAPI = {
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario (username, password, email, fullName)
   * @returns {Promise} Token de autenticación y datos del usuario
   */
  register: (userData) => api.post('/auth/register', userData),

  /**
   * Login de usuario
   * @param {Object} credentials - Credenciales (username, password)
   * @returns {Promise} Token de autenticación
   */
  login: (credentials) => api.post('/auth/login', credentials),

  /**
   * Obtener información del usuario actual
   * @returns {Promise} Información del usuario autenticado
   */
  me: () => api.get('/auth/me'),

  /**
   * Crear primer administrador (solo funciona si no hay admins)
   * @param {Object} adminData - Datos del administrador
   * @returns {Promise} Token de autenticación
   */
  createFirstAdmin: (adminData) => api.post('/auth/first-admin', adminData),

  /**
   * Registrar nuevo administrador (requiere rol ADMIN)
   * @param {Object} adminData - Datos del administrador
   * @returns {Promise} Token de autenticación
   */
  registerAdmin: (adminData) => api.post('/auth/register-admin', adminData),
};

export default api;

