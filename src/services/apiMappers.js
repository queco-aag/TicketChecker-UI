/**
 * Mapeadores para transformar las respuestas de la API al formato esperado por el frontend
 * Esto permite mantener compatibilidad si la API cambia sus nombres de campos
 */

/**
 * Mapea la respuesta de verificación de número de la API al formato esperado por el frontend
 * @param {Object} apiResponse - Respuesta de la API
 * @returns {Object} Datos mapeados para el frontend
 */
export const mapNumeroVerificationResponse = (apiResponse) => {
  // Estructura según openapi.yaml:
  // {success: true, premiado: true, mensaje: "...", premio: {...}, reclamado: false}
  return {
    tienePremio: apiResponse.premiado || false,
    numero: apiResponse.numero,
    reclamado: apiResponse.reclamado || false,
    mensaje: apiResponse.mensaje,
    premio: apiResponse.premio ? {
      id: apiResponse.premio.id,
      nombrePremio: apiResponse.premio.nombre,
      descripcion: apiResponse.premio.descripcion,
      urlFoto: apiResponse.premio.urlFoto,
      enviado: apiResponse.premio.enviado
    } : null
  };
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

  // Mapear nombres de campos según openapi.yaml
  formData.append('nombre', claimData.nombre);
  formData.append('contacto', claimData.contacto);

  // El campo se llama "direccionEnvio" en la API
  if (claimData.direccion) {
    formData.append('direccionEnvio', claimData.direccion);
  }

  if (claimData.comprobante) {
    formData.append('comprobante', claimData.comprobante);
  }

  return formData;
};

