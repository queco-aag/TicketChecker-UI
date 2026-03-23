# ⚠️ ALERTA: Endpoints No Implementados en Backend

## 📅 Fecha: 2026-03-22

## 🚨 Problema Crítico Detectado

El análisis del archivo `openapi.yaml` actualizado desde el backend revela que **solo 12 de los 32 endpoints** usados en el frontend están implementados en el backend.

---

## ✅ Endpoints IMPLEMENTADOS en Backend (12)

### Autenticación (5)
- ✅ `POST /api/v1/auth/register`
- ✅ `POST /api/v1/auth/login`
- ✅ `GET /api/v1/auth/me`
- ✅ `POST /api/v1/auth/first-admin`
- ✅ `POST /api/v1/auth/register-admin`

### Verificación Pública (2)
- ✅ `GET /api/v1/numeros/{numero}/verificar`
- ✅ `POST /api/v1/numeros/{numero}/reclamar`

### Premios - Estados (5)
- ✅ `POST /api/v1/premios/cargar-csv`
- ✅ `PUT /api/v1/premios/{id}/marcar-enviado`
- ✅ `GET /api/v1/premios/reclamados`
- ✅ `GET /api/v1/premios/pendientes`
- ✅ `GET /api/v1/premios/enviados`

---

## ❌ Endpoints NO IMPLEMENTADOS en Backend (20)

### 👥 Gestión de Usuarios (4) - ❌ NO IMPLEMENTADOS
```javascript
authAPI.listarUsuarios()           // GET /api/v1/usuarios
authAPI.actualizarUsuario(id)      // PUT /api/v1/usuarios/{id}
authAPI.eliminarUsuario(id)        // DELETE /api/v1/usuarios/{id}
authAPI.cambiarRol(id, role)       // PUT /api/v1/usuarios/{id}/role
```
**Páginas afectadas:** UsersManagementPage

### 🎁 Premios - CRUD (4) - ❌ NO IMPLEMENTADOS
```javascript
rewardsAPI.listarPremios()         // GET /api/v1/premios
rewardsAPI.crearPremio(premio)     // POST /api/v1/premios
rewardsAPI.actualizarPremio(id)    // PUT /api/v1/premios/{id}
rewardsAPI.eliminarPremio(id)      // DELETE /api/v1/premios/{id}
rewardsAPI.obtenerDisponibles()    // GET /api/v1/premios (mismo endpoint)
```
**Páginas afectadas:** PrizesManagementPage, NumberPrizeMatchingPage

### 🔢 Números - Gestión (2) - ❌ NO IMPLEMENTADOS
```javascript
numerosAPI.listarNumeros(params)   // GET /api/v1/numeros
numerosAPI.actualizarCodigo(id)    // PUT /api/v1/numeros/{id}/codigo
```
**Páginas afectadas:** NumbersVerificationListPage

### 🔗 Emparejamientos (4) - ❌ NO IMPLEMENTADOS
```javascript
emparejamientosAPI.listar()        // GET /api/v1/numeros-premiados
emparejamientosAPI.crear(data)     // POST /api/v1/numeros-premiados
emparejamientosAPI.actualizar(id)  // PUT /api/v1/numeros-premiados/{id}
emparejamientosAPI.eliminar(id)    // DELETE /api/v1/numeros-premiados/{id}
```
**Páginas afectadas:** NumberPrizeMatchingPage

### 🔑 Claves de Años (5) - ❌ NO IMPLEMENTADOS
```javascript
clavesAPI.listar()                 // GET /api/v1/claves
clavesAPI.crear(clave)             // POST /api/v1/claves
clavesAPI.actualizar(id, clave)    // PUT /api/v1/claves/{id}
clavesAPI.eliminar(id)             // DELETE /api/v1/claves/{id}
clavesAPI.toggle(id)               // PUT /api/v1/claves/{id}/toggle
```
**Páginas afectadas:** YearKeysManagementPage

---

## 💥 Impacto en el Frontend

### Páginas que NO FUNCIONAN (5 de 8 páginas admin)
1. ❌ **UsersManagementPage** - No puede listar/editar/eliminar usuarios
2. ❌ **PrizesManagementPage** - No puede hacer CRUD de premios
3. ❌ **NumbersVerificationListPage** - No puede listar números con códigos
4. ❌ **NumberPrizeMatchingPage** - No puede listar/crear emparejamientos
5. ❌ **YearKeysManagementPage** - No puede gestionar claves de años

### Páginas que SÍ FUNCIONAN (3 de 8)
1. ✅ **UploadCsvPage** - Carga CSV funciona
2. ✅ **ClaimedListPage** - Lista reclamados funciona
3. ✅ **PendingListPage** - Lista pendientes funciona
4. ✅ **ShippedListPage** - Lista enviados funciona
5. ✅ **AdminDashboardPage** - Dashboard básico funciona
6. ✅ Páginas públicas - Verificación y reclamación funcionan

---

## 🎯 Soluciones Posibles

### Opción 1: Implementar Endpoints en Backend (Recomendado) ⭐

El backend necesita implementar 20 endpoints adicionales. Estos son endpoints CRUD estándar y relativamente simples de implementar en Spring Boot.

**Prioridad Alta (necesarios para funcionalidad básica):**
1. `GET /api/v1/premios` - CRUD de premios
2. `POST /api/v1/premios`
3. `PUT /api/v1/premios/{id}`
4. `DELETE /api/v1/premios/{id}`

**Prioridad Media:**
5. `GET /api/v1/usuarios` - Gestión de usuarios
6. `PUT /api/v1/usuarios/{id}`
7. `DELETE /api/v1/usuarios/{id}`
8. `GET /api/v1/numeros-premiados` - Emparejamientos
9. `POST /api/v1/numeros-premiados`

**Prioridad Baja:**
10. `GET /api/v1/claves` - Claves de años
11. `GET /api/v1/numeros` - Listado de números

---

### Opción 2: Adaptar Frontend a Backend Actual

Si no se van a implementar estos endpoints en el backend, el frontend debe:

1. **Remover páginas no funcionales:**
   - Eliminar UsersManagementPage
   - Eliminar PrizesManagementPage
   - Eliminar NumbersVerificationListPage
   - Eliminar NumberPrizeMatchingPage
   - Eliminar YearKeysManagementPage

2. **Simplificar AdminLayout:**
   - Quitar opciones del menú que no funcionan
   - Dejar solo: Dashboard, Carga CSV, Listas (Reclamados/Pendientes/Enviados)

3. **Limpiar client.js:**
   - Remover: `authAPI` (excepto auth), `numerosAPI`, `emparejamientosAPI`, `clavesAPI`
   - Remover métodos CRUD de `rewardsAPI`

---

### Opción 3: Modo Híbrido (Datos Mock temporales)

Mantener las páginas pero con datos de ejemplo hasta que el backend implemente los endpoints:

1. **Agregar mensajes informativos claros**
2. **Datos de ejemplo en cada página**
3. **Deshabilitar operaciones de guardado**
4. **Documentar claramente el estado**

---

## 📊 Comparativa

| Característica | Backend Actual | Frontend Actual | Estado |
|----------------|----------------|-----------------|--------|
| Login/Register | ✅ | ✅ | ✅ FUNCIONA |
| Verificar número | ✅ | ✅ | ✅ FUNCIONA |
| Reclamar premio | ✅ | ✅ | ✅ FUNCIONA |
| Carga CSV | ✅ | ✅ | ✅ FUNCIONA |
| Listas (reclamados/pendientes/enviados) | ✅ | ✅ | ✅ FUNCIONA |
| **Gestión de usuarios** | ❌ | ✅ | ❌ NO FUNCIONA |
| **CRUD de premios** | ❌ | ✅ | ❌ NO FUNCIONA |
| **Gestión de números** | ❌ | ✅ | ❌ NO FUNCIONA |
| **Emparejamientos** | ❌ | ✅ | ❌ NO FUNCIONA |
| **Claves de años** | ❌ | ✅ | ❌ NO FUNCIONA |

---

## 🚀 Recomendación

**Mi recomendación es la Opción 1:** Implementar los endpoints faltantes en el backend.

### Beneficios:
- ✅ Frontend ya está completo y funcional
- ✅ UI ya está diseñada y probada
- ✅ Solo falta backend (endpoints CRUD estándar)
- ✅ Funcionalidad completa del sistema

### Endpoints Críticos a Implementar PRIMERO:
1. `GET /api/v1/premios` (+ POST, PUT, DELETE)
2. `GET /api/v1/usuarios` (+ PUT, DELETE, PUT role)
3. `GET /api/v1/numeros-premiados` (+ POST, PUT, DELETE)

---

## 📝 Próximo Paso

**¿Qué opción prefieres?**

A) **Implementar en backend** → Te proporciono especificaciones detalladas de cada endpoint  
B) **Adaptar frontend** → Elimino páginas y limpio client.js  
C) **Modo híbrido** → Mantengo páginas con datos mock + mensajes informativos

Por favor, indícame cuál opción prefieres y procedo en consecuencia. 🚀

---

**Estado:** ⚠️ ACCIÓN REQUERIDA  
**Endpoints funcionales:** 37.5% (12/32)  
**Fecha:** 2026-03-22

