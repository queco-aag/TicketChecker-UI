# Referencia Rápida de Endpoints

## 📅 Actualizado: 2026-03-22

Esta es una guía de referencia rápida de todos los endpoints utilizados por el frontend, **verificados y correctos**.

---

## ✅ Endpoints Correctos (Backend Real)

### 🔓 Públicos (Sin autenticación)

#### Verificación de Números
```
GET  /api/v1/numeros/{numero}/verificar
POST /api/v1/numeros/{numero}/reclamar
```

#### Autenticación
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/first-admin
GET  /api/v1/auth/me
POST /api/v1/auth/register-admin (requiere auth)
```

---

### 🔒 Administrativos (Requieren JWT + Rol ADMIN)

#### 👥 Gestión de Usuarios
```
GET    /api/v1/usuarios
PUT    /api/v1/usuarios/{id}
DELETE /api/v1/usuarios/{id}
PUT    /api/v1/usuarios/{id}/role
```
**Página:** UsersManagementPage

---

#### 🎁 Gestión de Premios
```
GET    /api/v1/premios
POST   /api/v1/premios
PUT    /api/v1/premios/{id}
DELETE /api/v1/premios/{id}
GET    /api/v1/premios/reclamados
GET    /api/v1/premios/pendientes
GET    /api/v1/premios/enviados
POST   /api/v1/premios/cargar-csv
PUT    /api/v1/premios/{id}/marcar-enviado
```
**Nota:** El endpoint `/api/v1/premios` se usa tanto para listar todos los premios como para obtener los disponibles.

**Páginas:** 
- PrizesManagementPage
- ClaimedListPage
- PendingListPage
- ShippedListPage
- UploadCsvPage

---

#### 🔢 Gestión de Números
```
GET /api/v1/numeros?year={year}&search={search}&status={status}
PUT /api/v1/numeros/{id}/codigo
```
**Página:** NumbersVerificationListPage

---

#### 🔗 Emparejamiento de Números con Premios
```
GET    /api/v1/numeros-premiados
POST   /api/v1/numeros-premiados
PUT    /api/v1/numeros-premiados/{id}
DELETE /api/v1/numeros-premiados/{id}
```
**Página:** NumberPrizeMatchingPage

---

#### 🔑 Gestión de Claves de Años
```
GET    /api/v1/claves
POST   /api/v1/claves
PUT    /api/v1/claves/{id}
DELETE /api/v1/claves/{id}
PUT    /api/v1/claves/{id}/toggle
```
**Página:** YearKeysManagementPage

---

## 🚫 Endpoints INCORRECTOS (NO usar)

Estos endpoints estaban en versiones anteriores pero son **incorrectos**:

### ❌ Usuarios
```
GET    /api/v1/users          → ✅ Usar: /api/v1/usuarios
PUT    /api/v1/users/{id}     → ✅ Usar: /api/v1/usuarios/{id}
DELETE /api/v1/users/{id}     → ✅ Usar: /api/v1/usuarios/{id}
```

### ❌ Emparejamientos
```
GET    /api/v1/emparejamientos       → ✅ Usar: /api/v1/numeros-premiados
POST   /api/v1/emparejamientos       → ✅ Usar: /api/v1/numeros-premiados
PUT    /api/v1/emparejamientos/{id}  → ✅ Usar: /api/v1/numeros-premiados/{id}
DELETE /api/v1/emparejamientos/{id}  → ✅ Usar: /api/v1/numeros-premiados/{id}
```

---

## 📋 Estructura de Respuestas

Todas las respuestas del backend siguen este formato:

### Respuesta Exitosa
```json
{
  "success": true,
  "mensaje": "Operación exitosa",
  "data": { ... }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "mensaje": "Descripción del error",
  "error": "DetallesTecnicos"
}
```

---

## 🔐 Autenticación

### Headers Requeridos para Endpoints Protegidos
```
Authorization: Bearer {JWT_TOKEN}
```

### Códigos de Estado HTTP
- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validación)
- `401` - Unauthorized (token inválido/expirado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔗 Referencias

- **Especificación OpenAPI:** `docs/api/openapi.yaml`
- **Cliente API:** `src/shared/api/client.js`
- **Correcciones aplicadas:** `docs/operacion/CORRECCION_ENDPOINTS.md`
- **Integración completa:** `docs/operacion/INTEGRACION_ENDPOINTS_COMPLETA.md`

---

**Versión del Cliente API:** 1.5  
**Estado:** ✅ Todos los endpoints verificados y funcionales  
**Última actualización:** 2026-03-22

