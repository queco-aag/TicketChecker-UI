# Checklist de Verificación de Endpoints

## 📅 Fecha: 2026-03-22

Este documento sirve para verificar manualmente cada endpoint del `client.js` contra el backend real.

---

## 🧪 Cómo Usar Este Checklist

Para cada endpoint, hacer una prueba con curl o Postman y marcar:
- ✅ Si funciona correctamente
- ❌ Si retorna 404 (no existe)
- ⚠️ Si retorna otro error

---

## 📋 Endpoints a Verificar

### 🔓 Públicos (Sin Auth)

#### Autenticación
- [ ] `POST /api/v1/auth/register` - Registrar usuario
- [ ] `POST /api/v1/auth/login` - Login
- [ ] `GET /api/v1/auth/me` - Usuario actual (requiere token)
- [ ] `POST /api/v1/auth/first-admin` - Crear primer admin
- [ ] `POST /api/v1/auth/register-admin` - Registrar admin (requiere token)

#### Verificación Pública
- [ ] `GET /api/v1/numeros/{numero}/verificar` - Verificar número
- [ ] `POST /api/v1/numeros/{numero}/reclamar` - Reclamar premio

**Prueba sugerida:**
```bash
curl http://localhost:8080/api/v1/numeros/12345/verificar
```

---

### 🔒 Administrativos (Requieren JWT + ADMIN)

#### 👥 Gestión de Usuarios
- [ ] `GET /api/v1/usuarios` - Listar usuarios
- [ ] `PUT /api/v1/usuarios/{id}` - Actualizar usuario
- [ ] `DELETE /api/v1/usuarios/{id}` - Eliminar usuario
- [ ] `PUT /api/v1/usuarios/{id}/role` - Cambiar rol

**Prueba sugerida:**
```bash
TOKEN="tu_token_jwt_aqui"
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/usuarios
```

**Respuesta esperada:** Array de usuarios con campos: id, username, email, fullName, role, telefono, cargo, activo, fechaCreacion, ultimoAcceso

---

#### 🎁 Gestión de Premios - CRUD
- [ ] `GET /api/v1/premios` - Listar premios
- [ ] `POST /api/v1/premios` - Crear premio
- [ ] `PUT /api/v1/premios/{id}` - Actualizar premio
- [ ] `DELETE /api/v1/premios/{id}` - Eliminar premio

**Prueba sugerida:**
```bash
TOKEN="tu_token_jwt_aqui"
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/premios
```

**Respuesta esperada:** Array de premios con campos: id, nombre, descripcion, urlFoto, categoria, valorEstimado, stock, asignados, disponibles

---

#### 🎁 Gestión de Premios - Estados
- [ ] `POST /api/v1/premios/cargar-csv` - Carga masiva CSV
- [ ] `PUT /api/v1/premios/{id}/marcar-enviado` - Marcar enviado
- [ ] `GET /api/v1/premios/reclamados` - Listar reclamados
- [ ] `GET /api/v1/premios/pendientes` - Listar pendientes
- [ ] `GET /api/v1/premios/enviados` - Listar enviados

**Prueba sugerida:**
```bash
TOKEN="tu_token_jwt_aqui"
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/premios/reclamados
```

---

#### 🔢 Gestión de Números
- [ ] `GET /api/v1/numeros` - Listar números (con filtros: year, search, status)
- [ ] `PUT /api/v1/numeros/{id}/codigo` - Actualizar código de verificación

**Prueba sugerida:**
```bash
TOKEN="tu_token_jwt_aqui"
curl -H "Authorization: Bearer $TOKEN" "http://localhost:8080/api/v1/numeros?year=2026"
```

**Respuesta esperada:** Array con campos: id, numero, codigoVerificacion, premio, year, estado, reclamado, enviado, fechas

---

#### 🔗 Emparejamiento Números-Premios
- [ ] `GET /api/v1/numeros-premiados` - Listar emparejamientos
- [ ] `POST /api/v1/numeros-premiados` - Crear emparejamiento
- [ ] `PUT /api/v1/numeros-premiados/{id}` - Actualizar
- [ ] `DELETE /api/v1/numeros-premiados/{id}` - Eliminar

**Prueba sugerida:**
```bash
TOKEN="tu_token_jwt_aqui"
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/numeros-premiados
```

**Respuesta esperada:** Array con campos: id, numero, premioId, premio (objeto), fechaAsignacion, nombreReclamante, fechaReclamacion

---

#### 🔑 Gestión de Claves de Años
- [ ] `GET /api/v1/claves` - Listar claves
- [ ] `POST /api/v1/claves` - Crear clave
- [ ] `PUT /api/v1/claves/{id}` - Actualizar clave
- [ ] `DELETE /api/v1/claves/{id}` - Eliminar clave
- [ ] `PUT /api/v1/claves/{id}/toggle` - Activar/desactivar

**Prueba sugerida:**
```bash
TOKEN="tu_token_jwt_aqui"
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/claves
```

**Respuesta esperada:** Array con campos: id, year, clave, descripcion, activo, fechaInicio, fechaFin, totalNumeros

---

## 📊 Resumen de Verificación

### Totales
- **Total endpoints en client.js:** 32
- **Endpoints básicos (openapi.yaml actual):** 12
- **Endpoints adicionales a verificar:** 20

### Por Categoría
- ✅ Autenticación: 5/5
- ✅ Verificación pública: 2/2
- ✅ Premios básicos: 5/5
- ⚠️ Usuarios: 0/4 - **VERIFICAR**
- ⚠️ Premios CRUD: 0/5 - **VERIFICAR**
- ⚠️ Números: 0/2 - **VERIFICAR**
- ⚠️ Emparejamientos: 0/4 - **VERIFICAR**
- ⚠️ Claves: 0/5 - **VERIFICAR**

---

## 🚀 Después de Verificar

### Si Todos los Endpoints Existen ✅

1. **Obtener openapi.yaml completo del backend:**
   ```bash
   curl http://localhost:8080/v3/api-docs.yaml > docs/api/openapi.yaml
   ```

2. **Verificar el contenido:**
   ```bash
   grep -E '^\s+/' docs/api/openapi.yaml | wc -l
   # Debería mostrar ~32 o más
   ```

3. **Notificarme para que actualice toda la documentación**

### Si Faltan Endpoints ❌

**Endpoints que NO existan en el backend necesitan:**
- Ser implementados en el backend, O
- Ser removidos del frontend

**Notificarme cuáles NO existen para:**
1. Actualizar client.js
2. Adaptar las páginas afectadas
3. Actualizar documentación

---

## 📝 Formato de Reporte

Por favor, completa este formato:

```
### Resultados de Verificación

#### ✅ Endpoints que SÍ funcionan:
- GET /api/v1/usuarios
- ...

#### ❌ Endpoints que NO existen (404):
- GET /api/v1/claves
- ...

#### ⚠️ Endpoints con otros errores:
- POST /api/v1/premios (Error: 400 - Validación)
- ...
```

O simplemente pega el contenido del openapi.yaml completo del Swagger.

---

## 🔗 URLs Útiles

Cuando el backend esté corriendo en `localhost:8080`:

- **Swagger UI:** http://localhost:8080/swagger-ui/index.html
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs
- **OpenAPI YAML:** http://localhost:8080/v3/api-docs.yaml
- **API Health:** http://localhost:8080/actuator/health (si tiene Actuator)

---

**Estado:** ⏳ Esperando verificación del backend  
**Acción requerida:** Verificar endpoints o proporcionar openapi.yaml completo  
**Fecha:** 2026-03-22

