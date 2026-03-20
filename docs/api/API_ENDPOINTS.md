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
numero,nombrePremio,descripcionPremio,urlFotoPremio
12345,PlayStation 5,Consola de videojuegos,https://example.com/ps5.jpg
67890,Xbox Series X,Consola de última generación,https://example.com/xbox.jpg
```

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

## 📚 Ver También

- [Contrato OpenAPI (README)](../../README.md#contrato-openapi-de-referencia) - Ruta oficial del contrato compartido
- [README.md](../../README.md) - Documentación principal del proyecto
- [MIGRATION_GUIDE.md](../migracion/MIGRATION_GUIDE.md) - Guía de migración v2.0

