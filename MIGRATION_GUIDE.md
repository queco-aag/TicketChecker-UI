# Guía de Migración - TicketChecker-UI

## Resumen de Cambios

Esta guía describe los cambios realizados en el proyecto TicketChecker-UI para adaptarse a una API REST estándar y moderna.

## Cambios Principales

### 1. Servicio API Renovado (`src/services/api.js`)

#### Antes:
```javascript
// Endpoints en español
export const numerosAPI = {
  verificar: (numero) => api.get(`/numeros/${numero}/verificar`),
  reclamar: (numero, formData) => api.post(`/numeros/${numero}/reclamar`, formData),
};

export const premiosAPI = {
  cargarCSV: (formData) => api.post('/premios/cargar-csv', formData),
  // ...
};
```

#### Después:
```javascript
// Endpoints en inglés (REST estándar)
export const ticketsAPI = {
  verificar: (numero) => api.get(`/tickets/${numero}/verify`),
  reclamar: (numero, formData) => api.post(`/tickets/${numero}/claim`, formData),
};

export const rewardsAPI = {
  cargarCSV: (formData) => api.post('/admin/rewards/upload', formData),
  // ...
};

// Mantiene compatibilidad con código antiguo
export const numerosAPI = ticketsAPI;
export const premiosAPI = rewardsAPI;
```

**Beneficios:**
- ✅ URLs RESTful estándar en inglés
- ✅ Separación clara entre endpoints públicos y administrativos
- ✅ Compatibilidad hacia atrás mantenida
- ✅ Interceptores para autenticación automática
- ✅ Manejo de errores centralizado y mejorado

### 2. Sistema de Mapeo de Datos (`src/services/apiMappers.js`)

**Nuevo archivo** que permite transformar las respuestas de la API al formato esperado por el frontend.

#### Funciones disponibles:

1. **mapTicketVerificationResponse**: Transforma respuesta de verificación
2. **mapReward**: Transforma un premio individual
3. **mapRewards**: Transforma array de premios
4. **mapUploadResponse**: Transforma respuesta de carga CSV
5. **prepareClaimData**: Prepara datos para enviar al reclamar

**Ventaja:** Si la API cambia sus nombres de campos, solo se actualiza el mapeador.

### 3. Interceptores HTTP

#### Request Interceptor
```javascript
// Agrega automáticamente el token de autenticación a rutas admin
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && config.url.includes('/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Response Interceptor
```javascript
// Maneja errores de forma centralizada
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirigir a login
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    // Agregar mensaje de error legible
    error.message = error.response?.data?.message || error.message;
    return Promise.reject(error);
  }
);
```

### 4. Componentes Actualizados

Todos los componentes ahora usan:
- `ticketsAPI` en lugar de `numerosAPI` (aunque ambos funcionan)
- `rewardsAPI` en lugar de `premiosAPI` (aunque ambos funcionan)
- Mapeadores para transformar datos
- Mensajes de error mejorados desde `error.message`

**Archivos modificados:**
- ✅ `src/components/public/VerificarNumero.jsx`
- ✅ `src/components/public/ReclamarPremio.jsx`
- ✅ `src/components/admin/AdminPanel.jsx`
- ✅ `src/components/admin/CargarPremios.jsx`
- ✅ `src/components/admin/ListaPremios.jsx`
- ✅ `src/components/admin/ListaPendientes.jsx`
- ✅ `src/components/admin/ListaEnviados.jsx`

## Nuevos Archivos Creados

### 1. `.env.example`
Plantilla de configuración de variables de entorno.

### 2. `src/services/apiMappers.js`
Sistema de transformación de datos entre API y frontend.

### 3. `docs/API_INTEGRATION_GUIDE.md`
Guía completa de integración con la API.

### 4. `API_INTEGRATION.md`
Documentación de endpoints de la API.

## Endpoints de la API

### Cambios de URLs

| Antes | Después | Tipo |
|-------|---------|------|
| `GET /api/numeros/{numero}/verificar` | `GET /api/tickets/{numero}/verify` | Público |
| `POST /api/numeros/{numero}/reclamar` | `POST /api/tickets/{numero}/claim` | Público |
| `POST /api/premios/cargar-csv` | `POST /api/admin/rewards/upload` | Admin |
| `GET /api/premios/reclamados` | `GET /api/admin/rewards/claimed` | Admin |
| `GET /api/premios/pendientes` | `GET /api/admin/rewards/pending` | Admin |
| `GET /api/premios/enviados` | `GET /api/admin/rewards/shipped` | Admin |
| `PUT /api/premios/{id}/marcar-enviado` | `PUT /api/admin/rewards/{id}/ship` | Admin |

### Nuevos Endpoints

- `GET /api/admin/rewards` - Obtener todos los premios
- `DELETE /api/admin/rewards/{id}` - Eliminar un premio
- `POST /api/auth/login` - Login de administrador (futuro)
- `POST /api/auth/logout` - Logout (futuro)
- `GET /api/auth/verify` - Verificar token (futuro)

## Formato de Respuestas de la API

### Verificar Ticket

**Antes (asumido):**
```json
{
  "tienePremio": true,
  "premio": {
    "nombrePremio": "Bicicleta",
    "descripcion": "...",
    "urlFoto": "...",
    "reclamado": false
  }
}
```

**Ahora (estándar REST):**
```json
{
  "hasReward": true,
  "ticket": {
    "number": "12345",
    "reward": {
      "id": 1,
      "name": "Bicicleta",
      "description": "...",
      "imageUrl": "...",
      "claimed": false
    }
  }
}
```

El mapeador transforma automáticamente al formato que espera el frontend.

### Lista de Premios

**Antes (asumido):**
```json
[
  {
    "numero": "123",
    "nombrePremio": "Bicicleta",
    "nombrePremiado": "Juan",
    "reclamado": true,
    "enviado": false
  }
]
```

**Ahora (estándar REST):**
```json
[
  {
    "id": 1,
    "ticketNumber": "123",
    "rewardName": "Bicicleta",
    "winnerName": "Juan",
    "contact": "juan@email.com",
    "claimed": true,
    "shipped": false,
    "claimedDate": "2025-12-20T10:30:00Z"
  }
]
```

## Configuración del Backend

El backend debe actualizar sus endpoints para coincidir con las nuevas URLs. Si el backend aún usa las URLs antiguas, el frontend tiene dos opciones:

### Opción 1: Revertir temporalmente

En `src/services/api.js`, cambiar las URLs a las antiguas:

```javascript
export const ticketsAPI = {
  verificar: (numero) => api.get(`/numeros/${numero}/verificar`),
  reclamar: (numero, formData) => api.post(`/numeros/${numero}/reclamar`, formData),
};
```

### Opción 2: Usar mapeo inverso en el backend

El backend puede mantener compatibilidad con ambas URLs usando alias o rutas duplicadas.

## Variables de Entorno

### Nueva configuración requerida

Crear archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
VITE_APP_TITLE=TicketChecker - ASPADIF
```

### Para producción

```env
VITE_API_URL=https://api.aspadif.org/api
VITE_API_TIMEOUT=30000
VITE_APP_TITLE=TicketChecker - ASPADIF
```

## Autenticación (Preparado para el futuro)

El sistema está preparado para implementar autenticación JWT:

1. El interceptor agrega automáticamente `Authorization: Bearer {token}` a rutas `/admin/*`
2. El token se almacena en `localStorage.adminToken`
3. Si el token expira (401), redirige automáticamente a login
4. Servicios de autenticación ya definidos en `authAPI`

### Implementar login (futuro)

```javascript
import { authAPI } from '@/services/api';

const login = async (username, password) => {
  try {
    const response = await authAPI.login({ username, password });
    localStorage.setItem('adminToken', response.data.token);
    navigate('/admin');
  } catch (error) {
    console.error('Error de login:', error.message);
  }
};
```

## Testing

### Probar la integración

1. **Verificar conexión con la API:**
```bash
npm run dev
```

2. **Probar verificación de ticket:**
   - Ir a http://localhost:5173
   - Ingresar un número de ticket
   - Verificar que la respuesta se muestre correctamente

3. **Probar panel administrativo:**
   - Ir a http://localhost:5173/admin
   - Verificar que las estadísticas se carguen
   - Probar carga de CSV

### Errores comunes y soluciones

#### Error: "No se pudo conectar con el servidor"
- Verificar que la API esté corriendo
- Verificar `VITE_API_URL` en `.env`

#### Error: 404 Not Found
- El backend aún usa las URLs antiguas
- Actualizar el backend o revertir temporalmente las URLs

#### Error: CORS
- Configurar CORS en el backend para permitir el dominio del frontend

## Rollback

Si es necesario volver a la versión anterior:

```bash
git checkout HEAD~1 -- src/services/api.js
git checkout HEAD~1 -- src/components/
```

O simplemente usar los servicios de compatibilidad:

```javascript
// En lugar de ticketsAPI, usar numerosAPI
import { numerosAPI, premiosAPI } from '@/services/api';
```

## Próximos Pasos

1. ✅ Adaptar frontend a nueva API (COMPLETADO)
2. ⏳ Actualizar backend para usar nuevas URLs
3. ⏳ Implementar autenticación JWT
4. ⏳ Agregar tests automatizados
5. ⏳ Implementar caché con React Query
6. ⏳ Agregar documentación OpenAPI/Swagger

## Soporte

Para preguntas o problemas:
- Revisar `docs/API_INTEGRATION_GUIDE.md`
- Revisar `API_INTEGRATION.md`
- Abrir un issue en GitHub
- Contactar al equipo de desarrollo

---

**Versión:** 2.0.0  
**Fecha:** Diciembre 2025  
**Autor:** GitHub Copilot

