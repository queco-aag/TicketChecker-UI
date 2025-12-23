# Guía de Integración con API TicketChecker

## Introducción

Este documento describe cómo el frontend TicketChecker-UI se integra con la API backend del sistema TicketChecker.

## Arquitectura de la Integración

```
┌─────────────────────┐         ┌──────────────────────┐
│  TicketChecker-UI   │ ◄─────► │  TicketChecker API   │
│   (React + Vite)    │  HTTP   │  (Backend Service)   │
└─────────────────────┘         └──────────────────────┘
         │                                │
         ▼                                ▼
   ┌──────────┐                    ┌──────────┐
   │ LocalS.  │                    │ Database │
   └──────────┘                    └──────────┘
```

## Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
VITE_APP_TITLE=TicketChecker - ASPADIF
```

### Estructura de Servicios

El proyecto utiliza una arquitectura de servicios con las siguientes capas:

1. **api.js**: Cliente HTTP base con interceptores
2. **apiMappers.js**: Transformación de datos entre API y frontend
3. **Componentes**: Lógica de presentación y UI

## Servicios Disponibles

### ticketsAPI (Público)

Servicios para usuarios finales que desean verificar y reclamar premios.

```javascript
import { ticketsAPI } from '@/services/api';

// Verificar un número de ticket
const verificarTicket = async (numero) => {
  try {
    const response = await ticketsAPI.verificar(numero);
    const data = mapTicketVerificationResponse(response.data);
    // data contiene: { tienePremio, numero, premio }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Reclamar un premio
const reclamarPremio = async (numero, formData) => {
  const data = new FormData();
  data.append('nombre', 'Juan Pérez');
  data.append('contacto', 'juan@email.com');
  data.append('direccion', 'Calle 123');
  data.append('comprobante', archivoFile);
  
  try {
    await ticketsAPI.reclamar(numero, data);
    // Premio reclamado exitosamente
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### rewardsAPI (Administración)

Servicios para administradores que gestionan premios.

```javascript
import { rewardsAPI } from '@/services/api';
import { mapRewards } from '@/services/apiMappers';

// Cargar premios desde CSV
const cargarPremiosCSV = async (archivo) => {
  const formData = new FormData();
  formData.append('file', archivo);
  
  try {
    const response = await rewardsAPI.cargarCSV(formData);
    const data = mapUploadResponse(response.data);
    console.log(`Cargados ${data.cantidad} premios`);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Obtener premios reclamados
const obtenerReclamados = async () => {
  try {
    const response = await rewardsAPI.obtenerReclamados();
    const premios = mapRewards(response.data);
    // premios es un array de objetos premio
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Marcar premio como enviado
const marcarEnviado = async (premioId) => {
  try {
    await rewardsAPI.marcarEnviado(premioId);
    // Premio marcado como enviado
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

## Mapeo de Datos

El sistema utiliza mapeadores para transformar los datos entre la API y el frontend, permitiendo flexibilidad en caso de cambios en la API.

### Ejemplo de Mapeo de Ticket

**Respuesta de la API:**
```json
{
  "hasReward": true,
  "ticket": {
    "number": "12345",
    "reward": {
      "id": 1,
      "name": "Bicicleta",
      "description": "Bicicleta de montaña",
      "imageUrl": "https://ejemplo.com/bici.jpg",
      "claimed": false
    }
  }
}
```

**Después del mapeo (frontend):**
```json
{
  "tienePremio": true,
  "numero": "12345",
  "premio": {
    "id": 1,
    "nombrePremio": "Bicicleta",
    "descripcion": "Bicicleta de montaña",
    "urlFoto": "https://ejemplo.com/bici.jpg",
    "reclamado": false
  }
}
```

## Interceptores HTTP

### Request Interceptor

Agrega automáticamente el token de autenticación a las peticiones administrativas:

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && config.url.includes('/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Maneja errores de forma centralizada y redirige en caso de autenticación inválida:

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

## Manejo de Errores

Todos los errores de la API son capturados y transformados para mostrar mensajes amigables al usuario:

```javascript
try {
  await ticketsAPI.verificar(numero);
} catch (error) {
  // error.message contiene un mensaje legible
  toast.current.show({
    severity: 'error',
    summary: 'Error',
    detail: error.message,
    life: 3000
  });
}
```

## Compatibilidad hacia atrás

Para mantener compatibilidad con código existente, los servicios antiguos siguen disponibles:

```javascript
// Nuevos servicios (recomendados)
import { ticketsAPI, rewardsAPI } from '@/services/api';

// Servicios antiguos (compatibilidad)
import { numerosAPI, premiosAPI } from '@/services/api';

// Ambos funcionan igual
ticketsAPI.verificar(numero) === numerosAPI.verificar(numero)
rewardsAPI.obtenerReclamados() === premiosAPI.obtenerReclamados()
```

## Seguridad

### Autenticación

- Las rutas `/admin/*` requieren autenticación (futuro)
- Los tokens se almacenan en localStorage
- Los tokens expiran automáticamente

### Validaciones

- Validación de archivos antes de enviar
- Sanitización de inputs
- Límites de tamaño de archivo (5MB)
- Tipos de archivo permitidos: JPG, PNG

### CORS

La API debe configurar CORS para permitir peticiones desde el dominio del frontend:

```
Access-Control-Allow-Origin: https://ticketchecker.aspadif.org
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Testing

### Probar la conexión con la API

```javascript
import api from '@/services/api';

// Verificar conectividad
const testConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('API conectada:', response.data);
  } catch (error) {
    console.error('Error de conexión:', error.message);
  }
};
```

## Troubleshooting

### Error: "No se pudo conectar con el servidor"

- Verificar que la API esté ejecutándose
- Verificar la variable de entorno `VITE_API_URL`
- Verificar configuración de CORS en la API

### Error: 401 Unauthorized

- El token de autenticación expiró o es inválido
- Volver a iniciar sesión

### Error: 404 Not Found

- Verificar que la ruta de la API sea correcta
- Verificar la versión de la API

### Error: 500 Internal Server Error

- Error en el servidor backend
- Revisar logs del servidor
- Contactar al equipo de backend

## Roadmap

- [ ] Implementar autenticación JWT completa
- [ ] Agregar refresh tokens
- [ ] Implementar rate limiting en el cliente
- [ ] Agregar cache de respuestas con React Query
- [ ] Implementar retry automático para peticiones fallidas
- [ ] Agregar indicadores de progreso para uploads grandes
- [ ] Implementar optimistic updates

## Recursos

- [Documentación de Axios](https://axios-http.com/)
- [API REST Best Practices](https://restfulapi.net/)
- [JWT Authentication](https://jwt.io/)

## Contacto

Para preguntas o reportar problemas con la integración:
- Email: desarrollo@aspadif.org
- GitHub Issues: https://github.com/queco-aag/TicketChecker-UI/issues

