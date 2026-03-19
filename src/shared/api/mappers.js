export const mapVerificationResponse = (apiResponse, numero) => ({
  numero,
  premiado: Boolean(apiResponse?.premiado),
  reclamado: Boolean(apiResponse?.reclamado),
  mensaje: apiResponse?.mensaje || '',
  premio: apiResponse?.premio
    ? {
        id: apiResponse.premio.id,
        nombre: apiResponse.premio.nombre,
        descripcion: apiResponse.premio.descripcion,
        urlFoto: apiResponse.premio.urlFoto,
        enviado: Boolean(apiResponse.premio.enviado)
      }
    : null
});

export const mapPremio = (premio) => ({
  id: premio?.id,
  nombre: premio?.nombre,
  descripcion: premio?.descripcion,
  urlFoto: premio?.urlFoto,
  enviado: Boolean(premio?.enviado)
});

export const mapNumeroPremiado = (numeroPremiado) => ({
  id: numeroPremiado?.id,
  numero: numeroPremiado?.numero,
  reclamado: Boolean(numeroPremiado?.reclamado),
  premio: numeroPremiado?.premio ? mapPremio(numeroPremiado.premio) : null,
  premiado: numeroPremiado?.premiado
    ? {
        nombre: numeroPremiado.premiado.nombre,
        contacto: numeroPremiado.premiado.contacto,
        direccionEnvio: numeroPremiado.premiado.direccionEnvio,
        comprobanteUrl: numeroPremiado.premiado.comprobanteUrl,
        fechaReclamacion: numeroPremiado.premiado.fechaReclamacion
      }
    : null
});

export const mapListaNumerosPremiados = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(mapNumeroPremiado);
};

export const buildClaimFormData = ({ nombre, contacto, direccionEnvio, comprobante }) => {
  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('contacto', contacto);

  if (direccionEnvio) {
    formData.append('direccionEnvio', direccionEnvio);
  }

  if (comprobante) {
    formData.append('comprobante', comprobante);
  }

  return formData;
};

