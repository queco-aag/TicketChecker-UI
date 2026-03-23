# Guía: Sincronizar openapi.yaml con Backend

## 🎯 Objetivo

Sincronizar el archivo `docs/api/openapi.yaml` del frontend con la especificación completa del backend para asegurar que todos los endpoints estén documentados.

---

## 📋 Pasos para Sincronizar

### Opción 1: Desde Swagger UI (Recomendado)

1. **Iniciar el backend:**
   ```bash
   # En el proyecto TicketChecker
   ./mvnw spring-boot:run
   ```

2. **Acceder a Swagger UI:**
   ```
   http://localhost:8080/swagger-ui/index.html
   ```

3. **Descargar la especificación completa:**
   
   **URL JSON:**
   ```
   http://localhost:8080/v3/api-docs
   ```
   
   **URL YAML:**
   ```
   http://localhost:8080/v3/api-docs.yaml
   ```

4. **Copiar al proyecto frontend:**
   - Abrir la URL en el navegador
   - Copiar todo el contenido
   - Reemplazar `C:\Workspace\Particular\TicketChecker-UI\docs\api\openapi.yaml`

---

### Opción 2: Desde el Código Fuente del Backend

Si el backend tiene el archivo openapi.yaml en su código fuente:

```bash
# Copiar desde el backend
Copy-Item "C:\Workspace\Particular\TicketChecker\src\main\resources\openapi.yaml" `
          "C:\Workspace\Particular\TicketChecker-UI\docs\api\openapi.yaml"
```

---

### Opción 3: Usando curl/PowerShell

**Con curl (en WSL):**
```bash
cd /mnt/c/Workspace/Particular/TicketChecker-UI
curl -o docs/api/openapi.yaml http://localhost:8080/v3/api-docs.yaml
```

**Con PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/v3/api-docs.yaml" `
                  -OutFile "C:\Workspace\Particular\TicketChecker-UI\docs\api\openapi.yaml"
```

---

## ✅ Verificación Post-Sincronización

Después de actualizar el archivo, verificar que incluya todos estos endpoints:

### Endpoints Críticos que DEBEN estar:

#### 👥 Usuarios (4)
- [ ] `GET /api/v1/usuarios`
- [ ] `PUT /api/v1/usuarios/{id}`
- [ ] `DELETE /api/v1/usuarios/{id}`
- [ ] `PUT /api/v1/usuarios/{id}/role`

#### 🎁 Premios CRUD (5)
- [ ] `GET /api/v1/premios`
- [ ] `POST /api/v1/premios`
- [ ] `PUT /api/v1/premios/{id}`
- [ ] `DELETE /api/v1/premios/{id}`

#### 🔢 Números (2)
- [ ] `GET /api/v1/numeros`
- [ ] `PUT /api/v1/numeros/{id}/codigo`

#### 🔗 Emparejamientos (4)
- [ ] `GET /api/v1/numeros-premiados`
- [ ] `POST /api/v1/numeros-premiados`
- [ ] `PUT /api/v1/numeros-premiados/{id}`
- [ ] `DELETE /api/v1/numeros-premiados/{id}`

#### 🔑 Claves (5)
- [ ] `GET /api/v1/claves`
- [ ] `POST /api/v1/claves`
- [ ] `PUT /api/v1/claves/{id}`
- [ ] `DELETE /api/v1/claves/{id}`
- [ ] `PUT /api/v1/claves/{id}/toggle`

**Total esperado:** Mínimo 32 endpoints (12 actuales + 20 faltantes)

---

## 🔍 Comando de Verificación

Para verificar rápidamente cuántos endpoints hay en el openapi.yaml:

```bash
# Contar paths
grep -E '^\s+/' docs/api/openapi.yaml | wc -l

# Listar paths
grep -E '^\s+/' docs/api/openapi.yaml | sed 's/://g' | sort
```

---

## 📝 Si el Backend No Tiene Estos Endpoints

Si algunos endpoints no existen en el backend, hay dos opciones:

### A) Implementarlos en el Backend
Necesitarás implementar los controladores correspondientes en el backend Java/Spring Boot.

### B) Eliminarlos del Frontend
Si no se van a implementar, hay que:
1. Remover las funciones del `client.js`
2. Actualizar las páginas para no usarlos
3. Actualizar la documentación

---

## 🎯 Estado Actual

- **OpenAPI actual:** 12 endpoints documentados
- **Client.js usa:** 32 endpoints
- **Discrepancia:** 20 endpoints sin documentar
- **Archivo:** `docs/operacion/ANALISIS_DISCREPANCIAS_OPENAPI.md`

---

## 📞 Siguiente Paso Recomendado

**Por favor, proporciona el contenido del openapi.yaml actualizado desde el backend para que pueda:**
1. Comparar todos los endpoints
2. Corregir cualquier discrepancia en client.js
3. Actualizar toda la documentación
4. Asegurar 100% de alineación frontend-backend

---

**Fecha:** 2026-03-22  
**Estado:** ⚠️ Esperando sincronización

