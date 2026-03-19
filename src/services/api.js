import api, { authAPI, rewardsAPI, ticketsAPI } from '../shared/api/client';

// Alias de compatibilidad con la API antigua del proyecto.
export const numerosAPI = ticketsAPI;
export const premiosAPI = rewardsAPI;

export { api, authAPI, rewardsAPI, ticketsAPI };
export default api;

