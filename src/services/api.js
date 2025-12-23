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

// API de Tickets (Endpoints públicos)
export const ticketsAPI = {
  /**
   * Verificar si un número de ticket tiene premio
   * @param {string} numero - Número del ticket a verificar
   * @returns {Promise} Respuesta con información del premio si existe
   */
  verificar: (numero) => api.get(`/tickets/${numero}/verify`),

  /**
   * Reclamar un premio asociado a un ticket
   * @param {string} numero - Número del ticket
   * @param {FormData} formData - Datos del formulario con información del ganador
   * @returns {Promise} Confirmación de reclamo
   */
  reclamar: (numero, formData) => api.post(`/tickets/${numero}/claim`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// API de Premios/Recompensas (Endpoints administrativos)
export const rewardsAPI = {
  /**
   * Cargar premios desde un archivo CSV
   * @param {FormData} formData - Archivo CSV con los premios
   * @returns {Promise} Resultado de la carga
   */
  cargarCSV: (formData) => api.post('/admin/rewards/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  /**
   * Marcar un premio como enviado
   * @param {number} id - ID del premio
   * @returns {Promise} Confirmación de actualización
   */
  marcarEnviado: (id) => api.put(`/admin/rewards/${id}/ship`),

  /**
   * Obtener lista de premios enviados
   * @returns {Promise} Array de premios enviados
   */
  obtenerEnviados: () => api.get('/admin/rewards/shipped'),

  /**
   * Obtener lista de premios pendientes de envío
   * @returns {Promise} Array de premios pendientes
   */
  obtenerPendientes: () => api.get('/admin/rewards/pending'),

  /**
   * Obtener lista de premios reclamados
   * @returns {Promise} Array de premios reclamados
   */
  obtenerReclamados: () => api.get('/admin/rewards/claimed'),

  /**
   * Obtener todos los premios cargados
   * @returns {Promise} Array de todos los premios
   */
  obtenerTodos: () => api.get('/admin/rewards'),

  /**
   * Eliminar un premio
   * @param {number} id - ID del premio
   * @returns {Promise} Confirmación de eliminación
   */
  eliminar: (id) => api.delete(`/admin/rewards/${id}`),
};

// API de Autenticación (para futuras implementaciones)
export const authAPI = {
  /**
   * Login de administrador
   * @param {Object} credentials - Credenciales (usuario, contraseña)
   * @returns {Promise} Token de autenticación
   */
  login: (credentials) => api.post('/auth/login', credentials),

  /**
   * Logout de administrador
   * @returns {Promise} Confirmación de logout
   */
  logout: () => api.post('/auth/logout'),

  /**
   * Verificar token actual
   * @returns {Promise} Información del usuario autenticado
   */
  verificarToken: () => api.get('/auth/verify'),
};

// Mantener compatibilidad con código existente
export const numerosAPI = ticketsAPI;
export const premiosAPI = rewardsAPI;

export default api;
