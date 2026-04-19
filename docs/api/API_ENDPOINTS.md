# API Endpoints - TicketChecker

Este documento describe los endpoints de la API utilizados por el frontend TicketChecker-UI.

## Base URL

```
http://localhost:8080/api/v1
```

Configurar en `.env`:
```
VITE_API_URL=http://localhost:8080/api/v1
```

---

## 🔓 Endpoints Públicos

### 1. Verificar Número

**Endpoint:** `GET /numeros/{numero}/verificar`

Verifica si un número tiene premio asignado.

**Parámetros:**
- `numero` (path): Número a verificar

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "premiado": true,
  "mensaje": "¡Felicidades! Este número está premiado",
  "premio": {
    "id": 1,
    "nombre": "PlayStation 5",
    "descripcion": "Consola de videojuegos de última generación",
    "urlFoto": "https://example.com/ps5.jpg",
    "anio": 2026,
    "enviado": false
  },
  "reclamado": false
}
```

**Ejemplo de uso:**
```javascript
import { ticketsAPI } from '../shared/api/client';
import { mapVerificationResponse } from '../shared/api/mappers';

const response = await ticketsAPI.verificar('12345');
const data = mapVerificationResponse(response.data, '12345');
```

---

### 2. Reclamar Premio

**Endpoint:** `POST /numeros/{numero}/reclamar`

Permite reclamar un premio proporcionando los datos del ganador.

**Parámetros:**
- `numero` (path): Número del premio a reclamar

**Body (multipart/form-data):**
- `nombre` (required): Nombre completo del ganador
- `contacto` (required): Email o teléfono de contacto
- `direccionEnvio`: Dirección para envío del premio
- `comprobante`: Archivo de comprobante (imagen)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "mensaje": "Premio reclamado exitosamente",
  "numeroPremiado": {
    "id": 1,
    "numero": "12345",
    "reclamado": true,
    "premio": {
      "id": 1,
      "nombre": "PlayStation 5",
      "descripcion": "Consola de videojuegos de última generación",
      "urlFoto": "https://example.com/ps5.jpg",
      "enviado": false
    },
    "premiado": {
      "id": 1,
      "nombre": "Juan Pérez",
      "contacto": "+34 600 123 456",
      "direccionEnvio": "Calle Mayor 123, 28001 Madrid",
      "comprobanteUrl": "/uploads/comprobante_12345.jpg",
      "fechaReclamacion": "2025-12-23T10:30:00"
    }
  }
}
```

**Ejemplo de uso:**
```javascript
import { ticketsAPI } from '../shared/api/client';
import { buildClaimFormData } from '../shared/api/mappers';

const formData = buildClaimFormData({
  nombre: 'Juan Perez',
  contacto: 'juan@email.com',
  direccionEnvio: 'Calle Mayor 123',
  comprobante: file
});

const response = await ticketsAPI.reclamar('12345', formData);
```

---

## 🔒 Endpoints Administrativos

### 3. Cargar Premios desde CSV

**Endpoint:** `POST /premios/cargar-csv`

**Requiere:** Autenticación con rol ADMIN

Carga masiva de premios desde un archivo CSV.

**Body (multipart/form-data):**
- `file` (required): Archivo CSV con los premios

**Formato del CSV:**
```csv
numero,nombrePremio,descripcionPremio,urlFotoPremio,anio
12345,PlayStation 5,Consola de videojuegos,https://example.com/ps5.jpg,2026
67890,Xbox Series X,Consola de última generación,https://example.com/xbox.jpg,2026
```

> **Nota:** El campo `anio` es obligatorio. Debe existir una clave registrada para ese año.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "mensaje": "Premios cargados exitosamente",
  "cantidadCargada": 150
}
```

**Ejemplo de uso:**
```javascript
import { rewardsAPI } from '../shared/api/client';

const formData = new FormData();
formData.append('file', csvFile);

const response = await rewardsAPI.cargarCSV(formData);
```

---

### 4. Marcar Premio como Enviado

**Endpoint:** `PUT /premios/{id}/marcar-enviado`

Actualiza el estado de un premio para marcarlo como enviado.

**Parámetros:**
- `id` (path): ID del premio

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "mensaje": "Premio marcado como enviado"
}
```

**Ejemplo de uso:**
```javascript
import { rewardsAPI } from '../shared/api/client';

await rewardsAPI.marcarEnviado(1);
```

---

### 5. Listar Premios Enviados

**Endpoint:** `GET /premios/enviados`

Obtiene la lista de todos los premios que han sido marcados como enviados.

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "numero": "12345",
    "premio": {
      "id": 1,
      "nombre": "PlayStation 5",
      "descripcion": "Consola de videojuegos",
      "urlFoto": "https://example.com/ps5.jpg",
      "enviado": true
    },
    "premiado": {
      "id": 1,
      "nombre": "Juan Pérez",
      "contacto": "+34 600 123 456",
      "direccionEnvio": "Calle Mayor 123",
      "comprobanteUrl": "/uploads/comprobante_12345.jpg",
      "fechaReclamacion": "2025-12-23T10:30:00"
    },
    "reclamado": true
  }
]
```

**Ejemplo de uso:**
```javascript
import { rewardsAPI } from '../shared/api/client';
import { mapListaNumerosPremiados } from '../shared/api/mappers';

const response = await rewardsAPI.obtenerEnviados();
const premios = mapListaNumerosPremiados(response.data);
```

---

### 6. Listar Premios Pendientes

**Endpoint:** `GET /premios/pendientes`

Obtiene la lista de premios que han sido reclamados pero aún no han sido enviados.

**Respuesta:** Array de NumeroPremiado (similar a Premios Enviados)

**Ejemplo de uso:**
```javascript
import { rewardsAPI } from '../shared/api/client';
import { mapListaNumerosPremiados } from '../shared/api/mappers';

const response = await rewardsAPI.obtenerPendientes();
const premios = mapListaNumerosPremiados(response.data);
```

---

### 7. Listar Premios Reclamados

**Endpoint:** `GET /premios/reclamados`

Obtiene la lista completa de premios que han sido reclamados, independientemente de su estado de envío.

**Respuesta:** Array de NumeroPremiado

**Ejemplo de uso:**
```javascript
import { rewardsAPI } from '../shared/api/client';
import { mapListaNumerosPremiados } from '../shared/api/mappers';

const response = await rewardsAPI.obtenerReclamados();
const premios = mapListaNumerosPremiados(response.data);
```

---

## 🔐 Endpoints de Autenticación

### 8. Registrar Usuario

**Endpoint:** `POST /auth/register`

Registra un nuevo usuario en el sistema.

**Body (JSON):**
```json
{
  "username": "juanperez",
  "password": "SecurePass123!",
  "email": "juan@example.com",
  "fullName": "Juan Pérez García"
}
```

**Respuesta exitosa (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "username": "juanperez",
  "email": "juan@example.com",
  "fullName": "Juan Pérez García"
}
```

---

### 9. Login

**Endpoint:** `POST /auth/login`

Autentica un usuario existente.

**Body (JSON):**
```json
{
  "username": "juanperez",
  "password": "SecurePass123!"
}
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "username": "juanperez",
  "email": "juan@example.com",
  "fullName": "Juan Pérez García"
}
```

**Ejemplo de uso:**
```javascript
import { authAPI } from '../shared/api/client';

const response = await authAPI.login({
  username: 'admin',
  password: 'password123'
});

// Guardar token
localStorage.setItem('ticketchecker.admin.token', response.data.token);
```

---

### 10. Obtener Usuario Actual

**Endpoint:** `GET /auth/me`

**Requiere:** Autenticación

Devuelve la información del usuario actualmente autenticado.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "mensaje": "Usuario autenticado"
}
```

---

### 11. Crear Primer Administrador

**Endpoint:** `POST /auth/first-admin`

⚠️ Solo funciona si no existe ningún administrador en el sistema.

**Body (JSON):** Igual que registro

**Respuesta exitosa (201):** Igual que login

---

### 12. Registrar Nuevo Administrador

**Endpoint:** `POST /auth/register-admin`

**Requiere:** Autenticación con rol ADMIN

Permite a un administrador crear nuevos administradores.

**Body (JSON):** Igual que registro

**Respuesta exitosa (201):** Igual que login

---

## 📝 Modelos de Datos

### Premio
```typescript
{
  id: number;
  nombre: string;
  descripcion: string;
  urlFoto: string;
  anio: number;           // Año del sorteo al que pertenece
  enviado: boolean;
}
```

### Premiado
```typescript
{
  id: number;
  nombre: string;
  contacto: string;
  direccionEnvio: string;
  comprobanteUrl: string;
  fechaReclamacion: string; // ISO 8601 date-time
}
```

### NumeroPremiado
```typescript
{
  id: number;
  numero: string;
  premio: Premio;
  premiado: Premiado | null;
  reclamado: boolean;
}
```

---

## 🔧 Configuración de Autenticación

El token JWT debe incluirse en las peticiones que lo requieren usando el header:

```
Authorization: Bearer {token}
```

El interceptor de Axios en `src/shared/api/client.js` anade el token cuando la peticion define `requiresAuth: true`.

---

## ⚠️ Manejo de Errores

Todos los endpoints pueden devolver errores con el siguiente formato:

```json
{
  "success": false,
  "mensaje": "Descripción del error"
}
```

**Códigos de estado comunes:**
- `400` - Bad Request (validación fallida)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error (error del servidor)

---

## 🏗️ Arquitectura de Integración

```
┌─────────────────────┐         ┌──────────────────────┐
│  TicketChecker-UI   │ ◄─────► │  TicketChecker API   │
│   (React + Vite)    │  HTTP   │  (Backend Service)   │
└─────────────────────┘         └──────────────────────┘
         │                                │
         ▼                                ▼
   ┌──────────┐                    ┌──────────┐
   │LocalStorage│                  │ Database │
   └──────────┘                    └──────────┘
```

### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_API_TIMEOUT=30000
VITE_APP_TITLE=TicketChecker - ASPADIF
```

### Estructura de módulos API

```
src/shared/api/client.js
├── ticketsAPI      – endpoints públicos (verificar, reclamar)
├── authAPI         – autenticación (login, register, me)
├── usuariosAPI     – gestión de usuarios (CRUD, toggle)
├── rewardsAPI      – gestión de premios (CRUD, CSV, estados)
├── emparejamientosAPI – asignación números-premios
└── clavesAPI       – claves de sorteo y validación HMAC
```

---

## 🔌 Interceptores HTTP

### Request interceptor

Agrega automáticamente el token JWT a las peticiones que requieren autenticación (las que definen `requiresAuth: true`):

```javascript
api.interceptors.request.use((config) => {
  if (config.requiresAuth) {
    const token = localStorage.getItem('ticketchecker.admin.token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

### Response interceptor

Maneja errores de forma centralizada y redirige cuando el token es inválido o ha expirado:

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ticketchecker.admin.token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🔒 Seguridad y Validaciones

- Los tokens JWT se almacenan en `localStorage` bajo la clave `ticketchecker.admin.token`.
- Validación de archivos antes de enviar (tipo y tamaño).
- Límite de tamaño de archivos de comprobante: 5 MB.
- Tipos de archivo permitidos para comprobantes: JPG, PNG.
- El backend debe configurar CORS para permitir peticiones desde el dominio del frontend:

```
Access-Control-Allow-Origin: https://ticketchecker.aspadif.org
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 🐛 Resolución de Problemas

| Error | Causa probable | Solución |
|-------|----------------|----------|
| "No se pudo conectar con el servidor" | API no está ejecutándose | Verificar que el backend esté corriendo y revisar `VITE_API_URL` |
| `401 Unauthorized` | Token expirado o inválido | Volver a iniciar sesión |
| `403 Forbidden` | Sin permisos para el recurso | Verificar que el usuario tenga rol `ADMIN` |
| `404 Not Found` | Ruta incorrecta | Verificar la versión de la API y las rutas en `client.js` |
| `500 Internal Server Error` | Error en el backend | Revisar logs del servidor |
| Error CORS en navegador | CORS no configurado en backend | Verificar configuración CORS del backend |

---

## 📚 Ver También

- [Contrato OpenAPI](./openapi.yaml) - Especificación completa OpenAPI 3.0
- [Referencia rápida de endpoints](./REFERENCIA_ENDPOINTS.md) - Tabla resumen de todos los endpoints
- [README.md](../../README.md) - Documentación principal del proyecto

