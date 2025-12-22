import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const numerosAPI = {
  verificar: (numero) => api.get(`/numeros/${numero}/verificar`),
  reclamar: (numero, formData) => api.post(`/numeros/${numero}/reclamar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const premiosAPI = {
  cargarCSV: (formData) => api.post('/premios/cargar-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  marcarEnviado: (id) => api.put(`/premios/${id}/marcar-enviado`),
  obtenerEnviados: () => api.get('/premios/enviados'),
  obtenerPendientes: () => api.get('/premios/pendientes'),
  obtenerReclamados: () => api.get('/premios/reclamados'),
};

export default api;
