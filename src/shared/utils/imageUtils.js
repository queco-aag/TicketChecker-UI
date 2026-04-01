/**
 * Construye la URL completa de una imagen del backend
 * @param {string} rutaFoto - Ruta de la foto (puede ser relativa, absoluta o solo el nombre)
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (rutaFoto) => {
  if (!rutaFoto) {
    return null;
  }

  // Si ya es una URL completa (http:// o https://), devolverla tal cual
  if (rutaFoto.startsWith('http://') || rutaFoto.startsWith('https://')) {
    return rutaFoto;
  }

  // Obtener la URL base del backend sin el /api/v1
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
  const baseUrl = apiUrl.replace('/api/v1', '');

  // Si la URL empieza con /uploads/, construir la URL completa
  if (rutaFoto.startsWith('/uploads/')) {
    return `${baseUrl}${rutaFoto}`;
  }

  // Si la URL empieza con /, construir la URL completa
  if (rutaFoto.startsWith('/')) {
    return `${baseUrl}${rutaFoto}`;
  }

  // Si es solo el nombre del archivo, asumir que está en /uploads/
  return `${baseUrl}/uploads/${rutaFoto}`;
};

/**
 * Obtiene la URL de una imagen con fallback a un placeholder
 * @param {string} rutaFoto - Ruta de la foto
 * @param {string} placeholder - URL del placeholder (opcional)
 * @returns {string} URL de la imagen o placeholder
 */
export const getImageUrlWithFallback = (rutaFoto, placeholder = null) => {
  const imageUrl = getImageUrl(rutaFoto);
  return imageUrl || placeholder;
};

