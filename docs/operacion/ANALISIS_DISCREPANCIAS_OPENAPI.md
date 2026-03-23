# Análisis de Discrepancias: client.js vs openapi.yaml

## 📅 Fecha: 2026-03-22

## 🔍 Análisis

Comparación entre los endpoints utilizados en `src/shared/api/client.js` y los definidos en `docs/api/openapi.yaml`.

---

## ✅ Endpoints en openapi.yaml (12)

### Autenticación (5)
- ✅ `POST /auth/register`
- ✅ `POST /auth/login`
- ✅ `GET /auth/me`
- ✅ `POST /auth/first-admin`
- ✅ `POST /auth/register-admin`

### Números (2)
- ✅ `GET /numeros/{numero}/verificar`
- ✅ `POST /numeros/{numero}/reclamar`

### Premios (5)
- ✅ `POST /premios/cargar-csv`
- ✅ `PUT /premios/{id}/marcar-enviado`
- ✅ `GET /premios/enviados`
- ✅ `GET /premios/pendientes`
- ✅ `GET /premios/reclamados`

---

## ❌ Endpoints en client.js NO en openapi.yaml (20)

### Usuarios (4) - FALTANTES en OpenAPI
- ❌ `GET /usuarios`
- ❌ `PUT /usuarios/{id}`
- ❌ `DELETE /usuarios/{id}`
- ❌ `PUT /usuarios/{id}/role`

### Premios - CRUD (5) - FALTANTES en OpenAPI
- ❌ `GET /premios` (listar todos)
- ❌ `POST /premios` (crear)
- ❌ `PUT /premios/{id}` (actualizar)
- ❌ `DELETE /premios/{id}` (eliminar)
- ⚠️ `GET /premios` (obtenerDisponibles - mismo que listar)

### Números - Gestión (2) - FALTANTES en OpenAPI
- ❌ `GET /numeros` (listar con filtros)
- ❌ `PUT /numeros/{id}/codigo` (actualizar código)

### Emparejamientos/Números Premiados (4) - FALTANTES en OpenAPI
- ❌ `GET /numeros-premiados`
- ❌ `POST /numeros-premiados`
- ❌ `PUT /numeros-premiados/{id}`
- ❌ `DELETE /numeros-premiados/{id}`

### Claves de Años (5) - FALTANTES en OpenAPI
- ❌ `GET /claves`
- ❌ `POST /claves`
- ❌ `PUT /claves/{id}`
- ❌ `DELETE /claves/{id}`
- ❌ `PUT /claves/{id}/toggle`

---

## 📊 Resumen

| Categoría | En openapi.yaml | En client.js | Faltantes en OpenAPI |
|-----------|-----------------|--------------|---------------------|
| **Autenticación** | 5 | 5 | 0 |
| **Verificación pública** | 2 | 2 | 0 |
| **Premios básicos** | 5 | 5 | 0 |
| **Usuarios** | 0 | 4 | **4** ❌ |
| **Premios CRUD** | 0 | 5 | **5** ❌ |
| **Números** | 0 | 2 | **2** ❌ |
| **Emparejamientos** | 0 | 4 | **4** ❌ |
| **Claves** | 0 | 5 | **5** ❌ |
| **TOTAL** | **12** | **32** | **20** ❌ |

---

## 🎯 Recomendaciones

### Opción 1: Actualizar openapi.yaml con endpoints faltantes ⭐

El archivo `openapi.yaml` debe sincronizarse con el backend real. Si el Swagger del backend (`http://localhost:8080/swagger-ui/index.html`) tiene todos los endpoints, se puede:

1. **Exportar desde Swagger UI:**
   - Ir a `http://localhost:8080/v3/api-docs` (formato JSON)
   - O `http://localhost:8080/v3/api-docs.yaml` (formato YAML)
   - Copiar el contenido completo
   - Reemplazar `docs/api/openapi.yaml`

2. **Desde el código fuente del backend:**
   - Copiar desde `TicketChecker/src/main/resources/openapi.yaml`
   - Si usa anotaciones Swagger, regenerar la especificación

### Opción 2: Verificar endpoints del backend

Es posible que algunos endpoints no estén implementados en el backend. Verificar con:

```bash
# Listar todos los endpoints del backend
curl http://localhost:8080/v3/api-docs | jq '.paths | keys'
```

### Opción 3: Crear especificación completa manual

Si el backend no tiene documentación OpenAPI completa, podemos:
- Generar la especificación completa basada en los endpoints que usamos
- Documentar todos los 32 endpoints del client.js
- Crear schemas para todas las entidades

---

## 📝 Endpoints que Necesitan Documentación en OpenAPI

### 1. Gestión de Usuarios
```yaml
/usuarios:
  get:
    summary: Listar todos los usuarios
    security: [bearerAuth]
    responses:
      '200':
        description: Lista de usuarios
        
  post:
    summary: Crear nuevo usuario
    security: [bearerAuth]
    
/usuarios/{id}:
  put:
    summary: Actualizar usuario
    security: [bearerAuth]
    
  delete:
    summary: Eliminar usuario
    security: [bearerAuth]
    
/usuarios/{id}/role:
  put:
    summary: Cambiar rol del usuario
    security: [bearerAuth]
```

### 2. CRUD de Premios
```yaml
/premios:
  get:
    summary: Listar todos los premios
    security: [bearerAuth]
    
  post:
    summary: Crear nuevo premio
    security: [bearerAuth]
    
/premios/{id}:
  put:
    summary: Actualizar premio
    security: [bearerAuth]
    
  delete:
    summary: Eliminar premio
    security: [bearerAuth]
```

### 3. Gestión de Números
```yaml
/numeros:
  get:
    summary: Listar números con códigos
    parameters:
      - name: year
      - name: search
      - name: status
    security: [bearerAuth]
    
/numeros/{id}/codigo:
  put:
    summary: Actualizar código de verificación
    security: [bearerAuth]
```

### 4. Emparejamientos (Números Premiados)
```yaml
/numeros-premiados:
  get:
    summary: Listar emparejamientos número-premio
    security: [bearerAuth]
    
  post:
    summary: Crear emparejamiento
    security: [bearerAuth]
    
/numeros-premiados/{id}:
  put:
    summary: Actualizar emparejamiento
    security: [bearerAuth]
    
  delete:
    summary: Eliminar emparejamiento
    security: [bearerAuth]
```

### 5. Claves de Años
```yaml
/claves:
  get:
    summary: Listar claves de años
    security: [bearerAuth]
    
  post:
    summary: Crear clave de año
    security: [bearerAuth]
    
/claves/{id}:
  put:
    summary: Actualizar clave
    security: [bearerAuth]
    
  delete:
    summary: Eliminar clave
    security: [bearerAuth]
    
/claves/{id}/toggle:
  put:
    summary: Activar/desactivar clave
    security: [bearerAuth]
```

---

## 🚀 Próximos Pasos

1. **Obtener la especificación completa del backend:**
   - Acceder a `http://localhost:8080/v3/api-docs.yaml`
   - Copiar el contenido
   - Actualizar `docs/api/openapi.yaml`

2. **Verificar que todos los endpoints existen en el backend:**
   - Hacer pruebas con curl o Postman
   - Confirmar que los 20 endpoints faltantes están implementados

3. **Actualizar la documentación:**
   - Una vez sincronizado el openapi.yaml
   - Regenerar toda la documentación derivada

---

## 🔗 Referencias

- **Cliente API:** `src/shared/api/client.js` (32 endpoints)
- **OpenAPI actual:** `docs/api/openapi.yaml` (12 endpoints)
- **Swagger del backend:** `http://localhost:8080/swagger-ui/index.html`
- **API Docs JSON:** `http://localhost:8080/v3/api-docs`
- **API Docs YAML:** `http://localhost:8080/v3/api-docs.yaml`

---

**Estado:** ⚠️ DESINCRONIZADO  
**Cobertura OpenAPI:** 37.5% (12 de 32 endpoints)  
**Acción requerida:** Sincronizar openapi.yaml con backend  
**Fecha:** 2026-03-22

