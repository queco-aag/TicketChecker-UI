# 📄 Actualización del OpenAPI - Endpoints CRUD de Premios

**Fecha:** 30 de Marzo, 2026  
**Archivo actualizado:** `docs/api/openapi.yaml`

---

## ✅ Endpoints Agregados

Se han agregado los siguientes endpoints al archivo OpenAPI que estaban implementados en el backend pero no documentados:

### **1. GET /api/v1/premios**
- **Descripción:** Listar todos los premios
- **Requiere autenticación:** Sí (Bearer token)
- **Requiere rol:** ADMIN
- **Respuesta:** Array de premios con todos sus detalles

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "premios": [
    {
      "id": 1,
      "nombre": "PlayStation 5",
      "descripcion": "Consola de videojuegos de última generación",
      "urlFoto": "https://example.com/ps5.jpg",
      "anio": 2026,
      "enviado": false
    }
  ]
}
```

---

### **2. POST /api/v1/premios**
- **Descripción:** Crear un nuevo premio individual
- **Requiere autenticación:** Sí (Bearer token)
- **Requiere rol:** ADMIN
- **Content-Type:** `application/json`
- **Body:** CrearPremioRequest

**Ejemplo de request:**
```json
{
  "nombre": "PlayStation 5",
  "descripcion": "Consola de videojuegos de última generación",
  "urlFoto": "https://example.com/ps5.jpg",
  "anio": 2026
}
```

**Ejemplo de respuesta (201 Created):**
```json
{
  "success": true,
  "mensaje": "Premio creado exitosamente",
  "premio": {
    "id": 1,
    "nombre": "PlayStation 5",
    "descripcion": "Consola de videojuegos de última generación",
    "urlFoto": "https://example.com/ps5.jpg",
    "anio": 2026,
    "enviado": false
  }
}
```

---

### **3. GET /api/v1/premios/{id}**
- **Descripción:** Obtener un premio específico por ID
- **Requiere autenticación:** Sí (Bearer token)
- **Requiere rol:** ADMIN
- **Parámetros:** `id` (path, integer)

**Ejemplo de respuesta (200 OK):**
```json
{
  "success": true,
  "premio": {
    "id": 1,
    "nombre": "PlayStation 5",
    "descripcion": "Consola de videojuegos de última generación",
    "urlFoto": "https://example.com/ps5.jpg",
    "anio": 2026,
    "enviado": false
  }
}
```

**Errores posibles:**
- `404 Not Found` - Premio no encontrado

---

### **4. PUT /api/v1/premios/{id}**
- **Descripción:** Actualizar un premio existente
- **Requiere autenticación:** Sí (Bearer token)
- **Requiere rol:** ADMIN
- **Parámetros:** `id` (path, integer)
- **Content-Type:** `application/json`
- **Body:** ActualizarPremioRequest (todos los campos opcionales)

**Ejemplo de request:**
```json
{
  "nombre": "PlayStation 5 Pro",
  "descripcion": "Versión mejorada de la consola",
  "urlFoto": "https://example.com/ps5-pro.jpg"
}
```

**Ejemplo de respuesta (200 OK):**
```json
{
  "success": true,
  "mensaje": "Premio actualizado exitosamente",
  "premio": {
    "id": 1,
    "nombre": "PlayStation 5 Pro",
    "descripcion": "Versión mejorada de la consola",
    "urlFoto": "https://example.com/ps5-pro.jpg",
    "anio": 2026,
    "enviado": false
  }
}
```

---

### **5. DELETE /api/v1/premios/{id}**
- **Descripción:** Eliminar un premio
- **Requiere autenticación:** Sí (Bearer token)
- **Requiere rol:** ADMIN
- **Parámetros:** `id` (path, integer)

**⚠️ ATENCIÓN:** No se puede eliminar un premio que tenga números asignados. Primero se deben eliminar todos los emparejamientos.

**Ejemplo de respuesta (200 OK):**
```json
{
  "success": true,
  "mensaje": "Premio eliminado exitosamente"
}
```

**Errores posibles:**
- `404 Not Found` - Premio no encontrado
- `409 Conflict` - El premio tiene números asignados

---

## 📋 Schemas Agregados

### **CrearPremioRequest**
Esquema para la creación de premios.

**Campos obligatorios:**
- `nombre` (string, 1-200 caracteres)
- `descripcion` (string, 1-1000 caracteres)
- `anio` (integer, 2000-2100)

**Campos opcionales:**
- `urlFoto` (string, formato URI)

---

### **ActualizarPremioRequest**
Esquema para la actualización de premios.

**Todos los campos son opcionales:**
- `nombre` (string, 1-200 caracteres)
- `descripcion` (string, 1-1000 caracteres)
- `urlFoto` (string, formato URI)
- `anio` (integer, 2000-2100)

Solo se actualizan los campos incluidos en la petición.

---

### **PremioDetallado**
Esquema de respuesta con todos los detalles de un premio.

**Campos:**
- `id` (integer) - Identificador único
- `nombre` (string) - Nombre del premio
- `descripcion` (string) - Descripción detallada
- `urlFoto` (string) - URL de la imagen
- `anio` (integer) - Año del sorteo
- `enviado` (boolean) - Estado de envío (default: false)

---

## 📊 Tabla Comparativa de Endpoints de Premios

| Endpoint | Método | Autenticación | Tipo de Datos | Estado Anterior | Estado Actual |
|----------|--------|---------------|---------------|-----------------|---------------|
| `/premios/cargar-csv` | POST | Sí | multipart/form-data | ✅ Documentado | ✅ Documentado |
| `/premios/{id}/marcar-enviado` | PUT | Sí | - | ✅ Documentado | ✅ Documentado |
| `/premios/enviados` | GET | Sí | - | ✅ Documentado | ✅ Documentado |
| `/premios/pendientes` | GET | Sí | - | ✅ Documentado | ✅ Documentado |
| `/premios/reclamados` | GET | Sí | - | ✅ Documentado | ✅ Documentado |
| `/premios` | GET | Sí | - | ❌ No documentado | ✅ **AGREGADO** |
| `/premios` | POST | Sí | application/json | ❌ No documentado | ✅ **AGREGADO** |
| `/premios/{id}` | GET | Sí | - | ❌ No documentado | ✅ **AGREGADO** |
| `/premios/{id}` | PUT | Sí | application/json | ❌ No documentado | ✅ **AGREGADO** |
| `/premios/{id}` | DELETE | Sí | - | ❌ No documentado | ✅ **AGREGADO** |

---

## 🎯 Resumen de Cambios

### **Endpoints agregados:** 5
- GET /premios
- POST /premios
- GET /premios/{id}
- PUT /premios/{id}
- DELETE /premios/{id}

### **Schemas agregados:** 3
- CrearPremioRequest
- ActualizarPremioRequest
- PremioDetallado

### **Total de líneas agregadas:** ~400 líneas de especificación OpenAPI

---

## ✅ Validación

### **Archivo actualizado:**
- ✅ `docs/api/openapi.yaml` - Formato YAML válido

### **Pendiente:**
- ⏳ `docs/api/openapi-formatted.json` - Actualizar versión JSON (2352 líneas)

**Nota:** El archivo JSON puede actualizarse convirtiendo el YAML actualizado a JSON, o puede omitirse si solo se usa el YAML.

---

## 📖 Cómo Usar el OpenAPI Actualizado

### **1. Visualizar en Swagger UI**

Puedes importar el archivo `openapi.yaml` en:
- [Swagger Editor](https://editor.swagger.io/) - Editor online
- Swagger UI local (si está configurado en el proyecto)

### **2. Generar Documentación**

```bash
# Con Redoc
redoc-cli bundle docs/api/openapi.yaml -o docs/api/index.html

# Con Swagger Codegen
swagger-codegen generate -i docs/api/openapi.yaml -l html2 -o docs/api/generated
```

### **3. Validar el OpenAPI**

```bash
# Con Swagger CLI
swagger-cli validate docs/api/openapi.yaml

# Con OpenAPI Generator
openapi-generator-cli validate -i docs/api/openapi.yaml
```

---

## 🔗 Referencias

- **Archivo actualizado:** `docs/api/openapi.yaml`
- **Backend confirmado:** `docs/operacion/ESTADO_ENDPOINTS_BACKEND.md`
- **Cliente frontend:** `src/shared/api/client.js`
- **Especificación OpenAPI:** [https://swagger.io/specification/](https://swagger.io/specification/)

---

## 📝 Notas Adicionales

### **Diferencias con otros endpoints:**

1. **POST /premios** vs **POST /premios/cargar-csv**
   - `/premios` → Crea UN premio (JSON)
   - `/premios/cargar-csv` → Crea MÚLTIPLES premios (CSV file)

2. **Autenticación requerida**
   - Todos los endpoints CRUD de premios requieren autenticación
   - Se debe incluir: `Authorization: Bearer {token}`

3. **Validaciones del campo `anio`**
   - Debe estar entre 2000 y 2100
   - Es obligatorio al crear un premio
   - Debe existir una clave registrada para ese año (según backend)

---

**Actualizado por:** GitHub Copilot  
**Última modificación:** 30 de Marzo, 2026  
**Estado:** ✅ Completado

