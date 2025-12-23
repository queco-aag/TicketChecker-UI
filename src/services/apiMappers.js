/**
 * Mapeadores para transformar las respuestas de la API al formato esperado por el frontend
 * Esto permite mantener compatibilidad si la API cambia sus nombres de campos
 */

/**
 * Mapea la respuesta de verificación de ticket de la API al formato del frontend
 * @param {Object} apiResponse - Respuesta de la API
 * @returns {Object} Datos mapeados para el frontend
 */
export const mapTicketVerificationResponse = (apiResponse) => {
  // Si la API usa hasReward en lugar de tienePremio
  if (apiResponse.hasReward !== undefined) {
    return {
      tienePremio: apiResponse.hasReward,
      numero: apiResponse.ticket?.number || apiResponse.numero,
      premio: apiResponse.ticket?.reward ? {
        id: apiResponse.ticket.reward.id,
        nombrePremio: apiResponse.ticket.reward.name || apiResponse.ticket.reward.nombrePremio,
        descripcion: apiResponse.ticket.reward.description || apiResponse.ticket.reward.descripcion,
        urlFoto: apiResponse.ticket.reward.imageUrl || apiResponse.ticket.reward.urlFoto,
        reclamado: apiResponse.ticket.reward.claimed !== undefined
          ? apiResponse.ticket.reward.claimed
          : apiResponse.ticket.reward.reclamado
      } : null
    };
  }

  // Si la API ya usa el formato esperado, retornar como está
  return apiResponse;
};

/**
 * Mapea un premio de la API al formato del frontend
 * @param {Object} reward - Premio de la API
 * @returns {Object} Premio mapeado
 */
export const mapReward = (reward) => {
  return {
    id: reward.id,
    numero: reward.ticketNumber || reward.numero,
    nombrePremio: reward.rewardName || reward.name || reward.nombrePremio,
    descripcion: reward.description || reward.descripcion,
    urlFoto: reward.imageUrl || reward.urlFoto,
    nombrePremiado: reward.winnerName || reward.nombrePremiado,
    contacto: reward.contact || reward.contacto,
    direccion: reward.address || reward.direccion,
    urlComprobante: reward.proofUrl || reward.urlComprobante,
    fechaReclamo: reward.claimedDate || reward.fechaReclamo,
    fechaEnvio: reward.shippedDate || reward.fechaEnvio,
    reclamado: reward.claimed !== undefined ? reward.claimed : reward.reclamado,
    enviado: reward.shipped !== undefined ? reward.shipped : reward.enviado
  };
};

/**
 * Mapea un array de premios
 * @param {Array} rewards - Array de premios de la API
 * @returns {Array} Array de premios mapeados
 */
export const mapRewards = (rewards) => {
  if (!Array.isArray(rewards)) {
    return [];
  }
  return rewards.map(mapReward);
};

/**
 * Mapea la respuesta de carga de CSV
 * @param {Object} apiResponse - Respuesta de la API
 * @returns {Object} Respuesta mapeada
 */
export const mapUploadResponse = (apiResponse) => {
  return {
    cantidad: apiResponse.count || apiResponse.uploaded || apiResponse.cantidad,
    mensaje: apiResponse.message || apiResponse.mensaje,
    errores: apiResponse.errors || apiResponse.errores || []
  };
};

/**
 * Prepara los datos de reclamo para enviar a la API
 * @param {Object} claimData - Datos del formulario de reclamo
 * @returns {FormData} FormData preparado para la API
 */
export const prepareClaimData = (claimData) => {
  const formData = new FormData();

  // Mapear nombres de campos si es necesario
  formData.append('nombre', claimData.nombre);
  formData.append('contacto', claimData.contacto);
  formData.append('direccion', claimData.direccion);

  if (claimData.comprobante) {
    formData.append('comprobante', claimData.comprobante);
  }

  return formData;
};

