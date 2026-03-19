import {
  buildClaimFormData,
  mapListaNumerosPremiados,
  mapNumeroPremiado,
  mapPremio,
  mapVerificationResponse
} from '../shared/api/mappers';

export const mapNumeroVerificationResponse = (apiResponse, numero) => {
  const mapped = mapVerificationResponse(apiResponse, numero);
  return {
    tienePremio: mapped.premiado,
    numero: mapped.numero,
    reclamado: mapped.reclamado,
    mensaje: mapped.mensaje,
    premio: mapped.premio
      ? {
          id: mapped.premio.id,
          nombrePremio: mapped.premio.nombre,
          descripcion: mapped.premio.descripcion,
          urlFoto: mapped.premio.urlFoto,
          enviado: mapped.premio.enviado
        }
      : null
  };
};

export const mapReward = (reward) => {
  const numeroPremiado = mapNumeroPremiado(reward);
  return {
    id: numeroPremiado.id,
    numero: numeroPremiado.numero,
    nombrePremio: numeroPremiado.premio?.nombre,
    descripcion: numeroPremiado.premio?.descripcion,
    urlFoto: numeroPremiado.premio?.urlFoto,
    nombrePremiado: numeroPremiado.premiado?.nombre,
    contacto: numeroPremiado.premiado?.contacto,
    direccion: numeroPremiado.premiado?.direccionEnvio,
    urlComprobante: numeroPremiado.premiado?.comprobanteUrl,
    fechaReclamo: numeroPremiado.premiado?.fechaReclamacion,
    reclamado: numeroPremiado.reclamado,
    enviado: numeroPremiado.premio?.enviado
  };
};

export const mapRewards = (rewards) => mapListaNumerosPremiados(rewards).map(mapReward);

export const mapUploadResponse = (apiResponse) => ({
  cantidad: apiResponse?.cantidadCargada || 0,
  mensaje: apiResponse?.mensaje || 'Carga completada',
  errores: []
});

export const prepareClaimData = (claimData) =>
  buildClaimFormData({
    nombre: claimData.nombre,
    contacto: claimData.contacto,
    direccionEnvio: claimData.direccionEnvio || claimData.direccion,
    comprobante: claimData.comprobante
  });

export { mapPremio };

