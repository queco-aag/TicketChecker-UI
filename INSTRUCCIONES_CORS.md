# 🚀 INSTRUCCIONES RÁPIDAS - Solución Error CORS

## ✅ ¿Qué se hizo?

Se configuró un **proxy en Vite** para evitar errores CORS en desarrollo.

---

## 🔄 ¿Qué hacer ahora?

### 1. Verifica que el Backend esté corriendo

El backend debe estar ejecutándose en:
```
http://localhost:8080
```

Si no está corriendo, inícialo primero.

---

### 2. Verifica el Servidor de Desarrollo

El servidor de desarrollo **ya está corriendo** en el puerto 5173.

Si no lo está, ejecútalo con:
```bash
npm run dev
```

---

### 3. Abre la Aplicación

Ir a: **http://localhost:5173**

---

### 4. Verifica en la Consola del Navegador

Presiona **F12** para abrir las DevTools y verifica:

- ✅ **NO** debes ver errores CORS
- ✅ Las peticiones deben completarse correctamente
- ✅ Las URLs de las peticiones ahora son relativas: `/api/v1/...`

**Ejemplo de peticiones exitosas:**
```
GET /api/v1/premios → 200 OK
POST /api/v1/auth/login → 200 OK
GET /api/v1/usuarios → 200 OK
```

---

### 5. Si sigues viendo errores CORS

1. **Detén el servidor** (Ctrl+C en la terminal donde corre `npm run dev`)
2. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```
3. **Limpia la caché del navegador**:
   - Chrome/Edge: Ctrl + Shift + Delete
   - Firefox: Ctrl + Shift + Delete
   - Selecciona "Caché" y "Eliminar ahora"
4. **Recarga la página**: Ctrl + F5 (recarga forzada)

---

## 📋 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `vite.config.js` | Agregado proxy para `/api` → `http://localhost:8080` |
| `.env` | Cambiado `VITE_API_URL` de absoluta a relativa (`/api/v1`) |

---

## ⚠️ Importante para Producción

**Esta solución funciona solo en desarrollo.**

Para **producción**, el backend debe configurar CORS correctamente.

Ver instrucciones completas en:
```
docs/operacion/SOLUCION_CORS.md
```

---

## 🆘 ¿Aún tienes errores?

### Error: "Failed to load resource: the server responded with a status of 401"

**Causa**: Credenciales incorrectas o token expirado.

**Solución**:
1. Verifica las credenciales de login
2. Cierra sesión e inicia sesión de nuevo

---

### Error: "Failed to load resource: the server responded with a status of 403"

**Causa**: Permisos insuficientes.

**Solución**:
1. Verifica que el usuario tenga rol ADMIN
2. Verifica que el backend esté configurado correctamente

---

### Error: "net::ERR_CONNECTION_REFUSED"

**Causa**: El backend no está ejecutándose.

**Solución**:
1. Inicia el backend en `http://localhost:8080`
2. Verifica que el puerto 8080 no esté bloqueado

---

## 📊 Estado Actual

| Componente | Estado |
|------------|--------|
| Frontend | ✅ Configurado con proxy |
| Variables de entorno | ✅ Actualizadas |
| Servidor de desarrollo | ✅ Corriendo |
| Documentación | ✅ Creada |
| Backend CORS | ⏳ Pendiente (solo para producción) |

---

## 📚 Más Información

- **Guía completa de solución**: `docs/operacion/SOLUCION_CORS.md`
- **Resumen de cambios**: `RESUMEN_CAMBIOS_CORS.md`
- **Documentación de Vite Proxy**: https://vitejs.dev/config/server-options.html#server-proxy

---

**¡Listo! Ahora deberías poder usar la aplicación sin errores CORS.**

Si tienes más problemas, revisa la documentación completa o contacta al equipo de desarrollo.

