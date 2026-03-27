# 📋 Plan de Implementación de Funcionalidades Faltantes

## Fecha: 2026-03-26
## Estado: ✅ Estilos Corregidos - 🔄 Funcionalidades Pendientes

---

## ✅ COMPLETADO

### Correcciones de Estilos
- [x] Reducción de tamaño de fuente (14px → 13px)
- [x] Corrección de InputNumber (botones y alineación)
- [x] Corrección de Dropdowns (tamaño y alineación)
- [x] Corrección de Headers de tabla
- [x] Corrección del Paginador
- [x] Corrección de Botones e Iconos
- [x] Error de `habilitadoTemplate` corregido

**Documentación:** `docs/operacion/CORRECCIONES_ESTILOS_APLICADAS.md`

---

## 🔄 PENDIENTE - Funcionalidades del API

### Análisis de Endpoints Implementados vs. Disponibles

#### ✅ IMPLEMENTADOS (Funcionales)

| Endpoint | Método | Descripción | Archivo |
|----------|--------|-------------|---------|
| `/numeros/{numero}/verificar` | GET | Verificar si un número tiene premio | `ticketsAPI.verificar()` |
| `/numeros/{numero}/reclamar` | POST | Reclamar un premio | `ticketsAPI.reclamar()` |
| `/premios/reclamados` | GET | Listar premios reclamados | `rewardsAPI.obtenerReclamados()` |
| `/premios/pendientes` | GET | Listar premios pendientes | `rewardsAPI.obtenerPendientes()` |
| `/premios/enviados` | GET | Listar premios enviados | `rewardsAPI.obtenerEnviados()` |
| `/premios/{id}/marcar-enviado` | PUT | Marcar premio como enviado | `rewardsAPI.marcarEnviado()` |
| `/auth/login` | POST | Login de usuario | `authAPI.login()` |
| `/auth/register` | POST | Registro de usuario | `authAPI.register()` |
| `/auth/register-admin` | POST | Registro de admin | `authAPI.registerAdmin()` |
| `/auth/first-admin` | POST | Primer administrador | `authAPI.createFirstAdmin()` |
| `/auth/me` | GET | Usuario actual | `authAPI.me()` |
| `/usuarios` | GET | Listar usuarios | `authAPI.listarUsuarios()` |
| `/usuarios/{id}` | DELETE | Eliminar usuario | `authAPI.eliminarUsuario()` |
| `/numeros-premiados` | GET | Listar emparejamientos | `emparejamientosAPI.listar()` |

#### ⚠️ PARCIALMENTE IMPLEMENTADOS

| Endpoint | Método | Descripción | Estado | Acción Requerida |
|----------|--------|-------------|--------|------------------|
| `/premios` | GET | Listar premios | ⚠️ Parcial | Usar `rewardsAPI.obtenerDisponibles()` |
| `/premios` | POST | Crear premio | ⚠️ Parcial | Implementar `rewardsAPI.crearPremio()` |
| `/premios/{id}` | PUT | Actualizar premio | ⚠️ Parcial | Implementar `rewardsAPI.actualizarPremio()` |
| `/premios/{id}` | DELETE | Eliminar premio | ⚠️ Parcial | Implementar `rewardsAPI.eliminarPremio()` |

#### ❌ NO IMPLEMENTADOS

| Endpoint | Método | Descripción | Prioridad |
|----------|--------|-------------|-----------|
| `/usuarios/{id}` | GET | Obtener usuario por ID | MEDIA |
| `/usuarios/{id}` | PUT | Actualizar usuario | ALTA |
| `/usuarios/{id}/toggle-habilitado` | PATCH | Activar/Desactivar usuario | ALTA |
| `/numeros-premiados` | POST | Asignar número a premio | ALTA |
| `/numeros-premiados/{numero}` | GET | Obtener emparejamiento | MEDIA |
| `/numeros-premiados/{numero}` | DELETE | Eliminar emparejamiento | ALTA |
| `/numeros-premiados/premio/{premioId}` | GET | Números por premio | BAJA |
| `/claves` | GET | Listar claves de sorteo | ALTA |
| `/claves` | POST | Crear/Actualizar clave | ALTA |
| `/claves/{anio}` | GET | Obtener clave de año | MEDIA |
| `/claves/{anio}` | DELETE | Eliminar clave | BAJA |
| `/claves/{anio}/numeros` | GET | Listar números con códigos | ALTA |
| `/claves/{anio}/exportar-csv` | GET | Exportar CSV de códigos | ALTA |
| `/claves/verificar-boleto` | POST | Verificar boleto con HMAC | ALTA |
| `/premios/cargar-csv` | POST | Cargar premios desde CSV | MEDIA |

---

## 📊 Análisis de Páginas vs. Endpoints

### Páginas Existentes

| Página | Estado | Endpoints Usados | Problemas |
|--------|--------|------------------|-----------|
| `AdminDashboardPage.jsx` | ✅ OK | Estadísticas básicas | Ninguno |
| `AdminLoginPage.jsx` | ✅ OK | `/auth/login` | Ninguno |
| `UsersManagementPage.jsx` | ⚠️ Parcial | `/usuarios`, `/auth/register-admin` | Falta actualizar y toggle |
| `PrizesManagementPage.jsx` | ⚠️ Parcial | `/premios` | Falta CRUD completo |
| `NumberPrizeMatchingPage.jsx` | ⚠️ Parcial | `/numeros-premiados` | Falta crear/eliminar |
| `YearKeysManagementPage.jsx` | ❌ Incompleto | Ninguno | No usa API de claves |
| `ClaimedListPage.jsx` | ✅ OK | `/premios/reclamados` | Ninguno |
| `PendingListPage.jsx` | ✅ OK | `/premios/pendientes` | Ninguno |
| `ShippedListPage.jsx` | ✅ OK | `/premios/enviados` | Ninguno |
| `UploadCsvPage.jsx` | ❌ No funciona | `/premios/cargar-csv` | No implementado |
| `NumbersVerificationListPage.jsx` | ⚠️ Unknown | ? | Revisar |
| `ClaimPrizePage.jsx` | ✅ OK | `/numeros/{numero}/reclamar` | Ninguno |

---

## 🎯 Plan de Acción Priorizado

### FASE 1: Funcionalidades Críticas (Prioridad ALTA)

#### 1.1. Gestión de Usuarios Completa
**Archivos a modificar:**
- `src/shared/api/client.js` - Agregar endpoints
- `src/features/admin/UsersManagementPage.jsx` - Conectar funcionalidades

**Endpoints a implementar:**
```javascript
// En authAPI
actualizarUsuario(id, data) {
  return apiClient.put(`/usuarios/${id}`, data, { requiresAuth: true });
},

toggleHabilitado(id) {
  return apiClient.patch(`/usuarios/${id}/toggle-habilitado`, {}, { requiresAuth: true });
}
```

**Cambios en UsersManagementPage:**
- Conectar botón de editar con `actualizarUsuario()`
- Agregar columna con toggle para habilitar/deshabilitar
- Implementar función de actualización real (línea ~128)

---

#### 1.2. CRUD Completo de Premios
**Archivos a modificar:**
- `src/shared/api/client.js` - Agregar endpoints
- `src/features/admin/PrizesManagementPage.jsx` - Conectar funcionalidades

**Endpoints a implementar:**
```javascript
// En rewardsAPI
listarPremios() {
  return apiClient.get('/premios', { requiresAuth: true });
},

obtenerPremio(id) {
  return apiClient.get(`/premios/${id}`, { requiresAuth: true });
},

crearPremio(data) {
  return apiClient.post('/premios', data, { requiresAuth: true });
},

actualizarPremio(id, data) {
  return apiClient.put(`/premios/${id}`, data, { requiresAuth: true });
},

eliminarPremio(id) {
  return apiClient.delete(`/premios/${id}`, { requiresAuth: true });
}
```

---

#### 1.3. Emparejamiento Número-Premio Completo
**Archivos a modificar:**
- `src/shared/api/client.js` - Agregar endpoints
- `src/features/admin/NumberPrizeMatchingPage.jsx` - Conectar funcionalidades

**Endpoints a implementar:**
```javascript
// En emparejamientosAPI
crear(data) {
  return apiClient.post('/numeros-premiados', data, { requiresAuth: true });
},

obtenerPorNumero(numero) {
  return apiClient.get(`/numeros-premiados/${numero}`, { requiresAuth: true });
},

eliminar(numero) {
  return apiClient.delete(`/numeros-premiados/${numero}`, { requiresAuth: true });
}
```

**Cambios en NumberPrizeMatchingPage:**
- Implementar función `handleSave()` (línea ~100+)
- Implementar función `handleDelete()` 
- Conectar botones con las API calls

---

#### 1.4. Gestión de Claves de Sorteo (YearKeysManagementPage)
**Archivos a modificar:**
- `src/shared/api/client.js` - Crear nuevo API client
- `src/features/admin/YearKeysManagementPage.jsx` - Implementar completamente

**Nuevo API Client:**
```javascript
export const yearKeysAPI = {
  listar() {
    return apiClient.get('/claves', { requiresAuth: true });
  },
  
  obtener(anio) {
    return apiClient.get(`/claves/${anio}`, { requiresAuth: true });
  },
  
  crear(data) {
    return apiClient.post('/claves', data, { requiresAuth: true });
  },
  
  eliminar(anio) {
    return apiClient.delete(`/claves/${anio}`, { requiresAuth: true });
  },
  
  listarNumerosConCodigos(anio, desde, hasta) {
    return apiClient.get(`/claves/${anio}/numeros`, {
      params: { desde, hasta },
      requiresAuth: true
    });
  },
  
  exportarCSV(anio, desde, hasta) {
    return apiClient.get(`/claves/${anio}/exportar-csv`, {
      params: { desde, hasta },
      responseType: 'blob',
      requiresAuth: true
    });
  },
  
  verificarBoleto(data) {
    return apiClient.post('/claves/verificar-boleto', data);
  }
};
```

**Funcionalidades de YearKeysManagementPage:**
- Listar claves existentes (tabla con años)
- Crear nueva clave (formulario con año + clave secreta + descripción)
- Eliminar clave (con confirmación)
- Generar códigos de validación (formulario con año + rango)
- Exportar CSV de códigos
- Vista previa de códigos generados

---

#### 1.5. Cargar Premios desde CSV
**Archivos a modificar:**
- `src/shared/api/client.js` - Agregar endpoint
- `src/features/admin/UploadCsvPage.jsx` - Conectar con API

**Endpoint a implementar:**
```javascript
// En rewardsAPI
cargarCSV(formData) {
  return apiClient.post('/premios/cargar-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    requiresAuth: true
  });
}
```

---

### FASE 2: Mejoras y Limpieza (Prioridad MEDIA)

#### 2.1. Revisar Campos en Premios
**Objetivo:** Asegurar que los campos del formulario coincidan con el modelo de datos

**Archivos a revisar:**
- `src/features/admin/PrizesManagementPage.jsx`
- Verificar que los campos del formulario sean: `nombre`, `descripcion`, `urlFoto`
- Eliminar campos que no existan en el modelo (si los hay)

#### 2.2. Revisar Emparejamiento
**Archivo:** `src/features/admin/NumberPrizeMatchingPage.jsx`

**Tareas:**
- Verificar que todos los campos de la tabla sean correctos
- Verificar que el formulario tenga solo: `numero` y `premioId`
- Eliminar campos sobrantes
- Mejorar visualización de datos relacionados (premio.nombre, etc.)

#### 2.3. Eliminar Páginas/Campos Sobrantes
**Análisis pendiente:**
- Identificar páginas que no se usan
- Identificar campos en formularios que no existen en el API
- Limpiar imports innecesarios

---

### FASE 3: Funcionalidades Avanzadas (Prioridad BAJA)

#### 3.1. Verificación de Boletos con HMAC
- Integrar verificación de boletos en la página de verificación pública
- Agregar campo para código de validación
- Agregar campo para año del sorteo

#### 3.2. Números Asignados por Premio
- Implementar vista de números asignados a un premio específico
- Puede ser un dialog o una página aparte

---

## 🗂️ Estructura de Archivos a Modificar

```
src/
├── shared/
│   └── api/
│       ├── client.js ⚠️ MODIFICAR - Agregar endpoints faltantes
│       └── mappers.js ⚠️ REVISAR - Mappers de respuestas
│
├── features/
│   ├── admin/
│   │   ├── UsersManagementPage.jsx ⚠️ MODIFICAR - Actualizar y toggle
│   │   ├── PrizesManagementPage.jsx ⚠️ MODIFICAR - CRUD completo
│   │   ├── NumberPrizeMatchingPage.jsx ⚠️ MODIFICAR - Crear/eliminar
│   │   ├── YearKeysManagementPage.jsx ❌ IMPLEMENTAR - Completamente
│   │   └── UploadCsvPage.jsx ⚠️ MODIFICAR - Conectar API
│   │
│   └── public/
│       └── ClaimPrizePage.jsx ⚠️ REVISAR - Agregar campos HMAC opcionales
│
└── App.jsx ✅ OK - No requiere cambios
```

---

## 📝 Checklist de Implementación

### Gestión de Usuarios
- [ ] Implementar `authAPI.actualizarUsuario()`
- [ ] Implementar `authAPI.toggleHabilitado()`
- [ ] Conectar botón editar en UsersManagementPage
- [ ] Agregar toggle de habilitación en tabla
- [ ] Probar actualización de usuario
- [ ] Probar activar/desactivar usuario

### Gestión de Premios
- [ ] Implementar `rewardsAPI.listarPremios()`
- [ ] Implementar `rewardsAPI.obtenerPremio()`
- [ ] Implementar `rewardsAPI.crearPremio()`
- [ ] Implementar `rewardsAPI.actualizarPremio()`
- [ ] Implementar `rewardsAPI.eliminarPremio()`
- [ ] Conectar formulario de creación
- [ ] Conectar formulario de edición
- [ ] Conectar botón de eliminación
- [ ] Probar CRUD completo

### Emparejamiento
- [ ] Implementar `emparejamientosAPI.crear()`
- [ ] Implementar `emparejamientosAPI.obtenerPorNumero()`
- [ ] Implementar `emparejamientosAPI.eliminar()`
- [ ] Conectar formulario de asignación
- [ ] Conectar botón de eliminación
- [ ] Probar crear emparejamiento
- [ ] Probar eliminar emparejamiento

### Claves de Sorteo
- [ ] Crear `yearKeysAPI` completo
- [ ] Implementar tabla de claves
- [ ] Implementar formulario de creación
- [ ] Implementar eliminación de claves
- [ ] Implementar generación de códigos
- [ ] Implementar exportación CSV
- [ ] Probar flujo completo

### Cargar CSV
- [ ] Implementar `rewardsAPI.cargarCSV()`
- [ ] Conectar UploadCsvPage con API
- [ ] Probar carga de archivo
- [ ] Manejar errores de validación

### Limpieza
- [ ] Revisar campos en PrizesManagementPage
- [ ] Revisar campos en NumberPrizeMatchingPage
- [ ] Eliminar páginas no utilizadas
- [ ] Eliminar imports innecesarios
- [ ] Limpiar código comentado

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Linter
npm run lint
```

---

## 📚 Documentación de Referencia

- `docs/api/API_ENDPOINTS.md` - Documentación de endpoints
- `docs/api/openapi.yaml` - Contrato OpenAPI
- `docs/operacion/CORRECCIONES_ESTILOS_APLICADAS.md` - Correcciones aplicadas

---

**Última actualización:** 2026-03-26
**Estado del Proyecto:** 🟡 En Progreso - Estilos OK, Funcionalidades Pendientes

