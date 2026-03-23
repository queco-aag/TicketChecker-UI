# Análisis Completo: Frontend vs Backend (OpenAPI Actualizado)

## 📅 Fecha: 2026-03-22

## ✅ Backend Actualizado - Análisis Completo

El backend tiene **25 paths** con múltiples métodos HTTP, totalizando aproximadamente **32 endpoints**.

---

## 📊 Comparación Detallada

### ✅ Endpoints CORRECTOS en client.js

#### Autenticación (5/5) ✅
| client.js | Backend | Estado |
|-----------|---------|--------|
| `POST /auth/register` | `POST /api/v1/auth/register` | ✅ |
| `POST /auth/login` | `POST /api/v1/auth/login` | ✅ |
| `GET /auth/me` | `GET /api/v1/auth/me` | ✅ |
| `POST /auth/first-admin` | `POST /api/v1/auth/first-admin` | ✅ |
| `POST /auth/register-admin` | `POST /api/v1/auth/register-admin` | ✅ |

#### Verificación Pública (2/2) ✅
| client.js | Backend | Estado |
|-----------|---------|--------|
| `GET /numeros/{numero}/verificar` | `GET /api/v1/numeros/{numero}/verificar` | ✅ |
| `POST /numeros/{numero}/reclamar` | `POST /api/v1/numeros/{numero}/reclamar` | ✅ |

#### Premios - Estados (5/5) ✅
| client.js | Backend | Estado |
|-----------|---------|--------|
| `POST /premios/cargar-csv` | `POST /api/v1/premios/cargar-csv` | ✅ |
| `PUT /premios/{id}/marcar-enviado` | `PUT /api/v1/premios/{id}/marcar-enviado` | ✅ |
| `GET /premios/reclamados` | `GET /api/v1/premios/reclamados` | ✅ |
| `GET /premios/pendientes` | `GET /api/v1/premios/pendientes` | ✅ |
| `GET /premios/enviados` | `GET /api/v1/premios/enviados` | ✅ |

#### Premios - CRUD (4/4) ✅
| client.js | Backend | Estado |
|-----------|---------|--------|
| `GET /premios` | `GET /api/v1/premios` | ✅ |
| `POST /premios` | `POST /api/v1/premios` | ✅ |
| `PUT /premios/{id}` | `PUT /api/v1/premios/{id}` | ✅ |
| `DELETE /premios/{id}` | `DELETE /api/v1/premios/{id}` | ✅ |

#### Usuarios (3/3) ✅
| client.js | Backend | Estado |
|-----------|---------|--------|
| `GET /usuarios` | `GET /api/v1/usuarios` | ✅ |
| `PUT /usuarios/{id}` | `PUT /api/v1/usuarios/{id}` | ✅ |
| `DELETE /usuarios/{id}` | `DELETE /api/v1/usuarios/{id}` | ✅ |

#### Emparejamientos (2/2) ✅
| client.js | Backend | Estado |
|-----------|---------|--------|
| `GET /numeros-premiados` | `GET /api/v1/numeros-premiados` | ✅ |
| `POST /numeros-premiados` | `POST /api/v1/numeros-premiados` | ✅ |

#### Claves (2/2) ✅
| client.js | Backend | Estado |
|-----------|---------|--------|
| `GET /claves` | `GET /api/v1/claves` | ✅ |
| `POST /claves` | `POST /api/v1/claves` | ✅ |

---

## ❌ Discrepancias Encontradas

### 1. Usuarios - Cambiar Rol
**client.js tiene:**
```javascript
cambiarRol: (id, role) => api.put(`/usuarios/${id}/role`, { role }, { requiresAuth: true })
```

**Backend tiene:**
- ❌ NO existe `PUT /api/v1/usuarios/{id}/role`
- ✅ Existe `PATCH /api/v1/usuarios/{id}/toggle-habilitado` (activar/desactivar)

**Problema:** El endpoint de cambio de rol NO existe en el backend.

---

### 2. Emparejamientos - Actualizar y Eliminar por ID
**client.js tiene:**
```javascript
actualizar: (id, emparejamiento) => api.put(`/numeros-premiados/${id}`, emparejamiento, { requiresAuth: true })
eliminar: (id) => api.delete(`/numeros-premiados/${id}`, { requiresAuth: true })
```

**Backend tiene:**
- ❌ NO existe `PUT /api/v1/numeros-premiados/{id}`
- ✅ Existe `DELETE /api/v1/numeros-premiados/{numero}` (por número, no por ID)
- ❌ NO existe endpoint para actualizar emparejamiento

**Problema:** El backend usa NÚMERO como identificador, no ID. Y no permite actualizar emparejamientos.

---

### 3. Claves - Actualizar, Eliminar y Toggle
**client.js tiene:**
```javascript
actualizar: (id, clave) => api.put(`/claves/{id}`, clave, { requiresAuth: true })
eliminar: (id) => api.delete(`/claves/{id}`, { requiresAuth: true })
toggle: (id) => api.put(`/claves/{id}/toggle`, {}, { requiresAuth: true })
```

**Backend tiene:**
- ❌ NO existe `PUT /api/v1/claves/{id}` (actualizar por ID)
- ✅ Existe `DELETE /api/v1/claves/{anio}` (eliminar por año, no por ID)
- ❌ NO existe `PUT /api/v1/claves/{id}/toggle`
- ✅ Backend usa POST para crear/actualizar en `/api/v1/claves` (upsert)

**Problema:** El backend usa AÑO como identificador, no ID.

---

### 4. Números - Listado y Actualizar Código
**client.js tiene:**
```javascript
listarNumeros: (params) => api.get('/numeros', { params, requiresAuth: true })
actualizarCodigo: (id, codigo) => api.put(`/numeros/${id}/codigo`, { codigo }, { requiresAuth: true })
```

**Backend tiene:**
- ❌ NO existe `GET /api/v1/numeros`
- ✅ Existe `GET /api/v1/claves/{anio}/numeros` (listar con códigos por año)
- ❌ NO existe `PUT /api/v1/numeros/{id}/codigo`

**Problema:** El endpoint de listado de números tiene otra estructura en el backend.

---

## 🚨 Endpoints Adicionales en Backend (No usados en Frontend)

Estos endpoints existen en el backend pero NO se usan en el frontend:

1. ✅ `GET /api/v1/usuarios/{id}` - Obtener usuario por ID
2. ✅ `GET /api/v1/premios/{id}` - Obtener premio por ID
3. ✅ `PATCH /api/v1/usuarios/{id}/toggle-habilitado` - Activar/desactivar usuario
4. ✅ `POST /api/v1/claves/verificar-boleto` - Verificar autenticidad con HMAC
5. ✅ `GET /api/v1/numeros-premiados/{numero}` - Obtener por número
6. ✅ `GET /api/v1/numeros-premiados/premio/{premioId}` - Listar por premio
7. ✅ `GET /api/v1/claves/{anio}` - Obtener clave por año
8. ✅ `GET /api/v1/claves/{anio}/numeros` - Listar números con códigos
9. ✅ `GET /api/v1/claves/{anio}/exportar-csv` - Exportar CSV

---

## 🔧 Correcciones Necesarias

### 1. authAPI - Remover cambiarRol
```javascript
// ❌ ELIMINAR (no existe en backend)
cambiarRol: (id, role) => api.put(`/usuarios/${id}/role`, { role }, { requiresAuth: true })

// ✅ AGREGAR (existe en backend)
toggleHabilitado: (id) => api.patch(`/usuarios/${id}/toggle-habilitado`, {}, { requiresAuth: true })
obtenerUsuario: (id) => api.get(`/usuarios/${id}`, { requiresAuth: true })
```

### 2. emparejamientosAPI - Cambiar a usar número
```javascript
// ❌ ELIMINAR (no existe en backend)
actualizar: (id, emparejamiento) => api.put(`/numeros-premiados/${id}`, ...)
eliminar: (id) => api.delete(`/numeros-premiados/${id}`, ...)

// ✅ CAMBIAR (backend usa número como key)
obtenerPorNumero: (numero) => api.get(`/numeros-premiados/${numero}`, { requiresAuth: true })
eliminarPorNumero: (numero) => api.delete(`/numeros-premiados/${numero}`, { requiresAuth: true })
listarPorPremio: (premioId) => api.get(`/numeros-premiados/premio/${premioId}`, { requiresAuth: true })
```

### 3. clavesAPI - Cambiar a usar año
```javascript
// ❌ ELIMINAR (backend usa año, no ID)
actualizar: (id, clave) => api.put(`/claves/${id}`, ...)
eliminar: (id) => api.delete(`/claves/${id}`, ...)
toggle: (id) => api.put(`/claves/{id}/toggle`, ...)

// ✅ CAMBIAR (backend usa año como key)
obtenerPorAnio: (anio) => api.get(`/claves/${anio}`, { requiresAuth: true })
eliminarPorAnio: (anio) => api.delete(`/claves/${anio}`, { requiresAuth: true })
listarNumerosConCodigos: (anio, desde, hasta) => 
  api.get(`/claves/${anio}/numeros`, { params: { desde, hasta }, requiresAuth: true })
exportarCSV: (anio, desde, hasta) => 
  api.get(`/claves/${anio}/exportar-csv`, { params: { desde, hasta }, requiresAuth: true, responseType: 'blob' })
verificarBoleto: (numero, codigo, anio) => 
  api.post('/claves/verificar-boleto', { numero, codigo, anio })

// NOTA: POST /claves hace upsert (crea o actualiza), no necesitamos método separado de actualizar
```

### 4. numerosAPI - Cambiar estructura
```javascript
// ❌ ELIMINAR (no existe así en backend)
listarNumeros: (params) => api.get('/numeros', { params, requiresAuth: true })
actualizarCodigo: (id, codigo) => api.put(`/numeros/${id}/codigo`, ...)

// ✅ CAMBIAR (backend usa otro enfoque)
// El listado de números se obtiene desde /claves/{anio}/numeros
// No hay endpoint para actualizar código individual
```

---

## 🎯 Resumen de Correcciones Necesarias

| API | Métodos a Eliminar | Métodos a Cambiar | Métodos a Agregar |
|-----|-------------------|-------------------|-------------------|
| **authAPI** | `cambiarRol` (1) | - | `toggleHabilitado`, `obtenerUsuario` (2) |
| **emparejamientosAPI** | `actualizar`, `eliminar` (2) | `eliminar` → `eliminarPorNumero` | `obtenerPorNumero`, `listarPorPremio` (2) |
| **clavesAPI** | `actualizar`, `toggle` (2) | `eliminar` → por año | `obtenerPorAnio`, `listarNumerosConCodigos`, `exportarCSV`, `verificarBoleto` (4) |
| **numerosAPI** | `listarNumeros`, `actualizarCodigo` (2) | - | Mover a clavesAPI |
| **rewardsAPI** | - | - | `obtenerPorId` (1) |

**Total:**
- ❌ Eliminar: 7 métodos
- 🔄 Modificar: 3 métodos
- ✅ Agregar: 9 métodos

---

## 🚀 Plan de Acción

### Paso 1: Actualizar client.js ✅
1. Corregir `authAPI`
2. Corregir `emparejamientosAPI`
3. Corregir `clavesAPI`
4. Reemplazar `numerosAPI` por métodos de `clavesAPI`
5. Agregar método `obtenerPorId` a `rewardsAPI`

### Paso 2: Actualizar Páginas Afectadas 🔄
1. **UsersManagementPage** - Cambiar cambiarRol por toggleHabilitado
2. **NumberPrizeMatchingPage** - Cambiar eliminar por ID a eliminar por número
3. **YearKeysManagementPage** - Cambiar uso de ID a uso de año
4. **NumbersVerificationListPage** - Usar `/claves/{anio}/numeros`

### Paso 3: Actualizar Documentación 📝
1. Actualizar todos los documentos de referencia
2. Crear guía de migración
3. Actualizar README

---

## 📋 Estado Actual vs Estado Objetivo

| Característica | Estado Actual | Estado Objetivo | Acción |
|----------------|---------------|-----------------|--------|
| Autenticación | ✅ Correcto | ✅ | Agregar métodos extras |
| Verificación pública | ✅ Correcto | ✅ | Ninguna |
| Premios CRUD | ✅ Correcto | ✅ | Agregar obtenerPorId |
| Premios Estados | ✅ Correcto | ✅ | Ninguna |
| Usuarios | ⚠️ Incompleto | ✅ | Cambiar rol por toggle |
| Emparejamientos | ⚠️ Incorrecto | ✅ | Usar número en vez de ID |
| Claves | ⚠️ Incorrecto | ✅ | Usar año en vez de ID |
| Números | ⚠️ Incorrecto | ✅ | Mover a clavesAPI |

---

## 🎯 Decisión

**¿Procedo con las correcciones automáticamente?**

Si dices **SÍ**, procedo a:
1. ✅ Actualizar `src/shared/api/client.js` completo
2. ✅ Actualizar todas las páginas afectadas
3. ✅ Actualizar toda la documentación
4. ✅ Verificar que no haya errores

**Esto incluye:**
- Cambiar 10 archivos de código
- Actualizar 8 archivos de documentación
- Tiempo estimado: 5-10 minutos

---

**Estado:** ⏳ ESPERANDO CONFIRMACIÓN  
**Endpoints en backend:** 32  
**Endpoints en client.js:** 32  
**Coincidencia:** ~75% (necesita ajustes)  
**Fecha:** 2026-03-22

