# 🔐 Solución: Token no se guarda después del Login

**Fecha:** 30 de Marzo, 2026  
**Problema:** El token no se almacena después del login, causando errores 403 en llamadas posteriores

---

## ✅ Cambios Realizados

### 1. **Forzar uso del proxy de Vite** (`src/shared/api/client.js`)

**Problema:** Las peticiones se hacían directamente a `http://localhost:8080` ignorando el proxy configurado.

**Solución:** Cambiar la URL base a una ruta relativa:

```javascript
// ANTES:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// DESPUÉS:
const API_BASE_URL = '/api/v1';
```

**Resultado:** Ahora todas las peticiones pasan por el proxy de Vite en `http://localhost:5173`, evitando errores CORS.

---

### 2. **Mejorar manejo de respuesta del login** (`src/features/public/HomePage.jsx`)

**Problema:** El código asumía una estructura específica de respuesta que podría no coincidir con lo que devuelve el backend.

**Solución:** 
- Agregar logs de debugging detallados
- Manejar múltiples estructuras de respuesta posibles
- Validar que el token existe antes de guardar
- Verificar que se guardó correctamente en localStorage

**Código agregado:**

```javascript
// Ver la respuesta completa del backend
console.log('========== DEBUG LOGIN ==========');
console.log('Respuesta completa:', response);
console.log('response.data:', response.data);
console.log('=================================');

// Extraer token de diferentes ubicaciones posibles
const token = data.token || data?.data?.token;

// Validar que el token existe
if (!token) {
  console.error('❌ ERROR: No se pudo extraer el token');
  // Mostrar error al usuario
  return;
}

// Guardar y verificar
saveSession(token, userData);
const savedToken = localStorage.getItem('ticketchecker.admin.token');
console.log('✅ Token guardado:', savedToken ? 'SÍ' : 'NO');
```

---

## 🚀 Próximos Pasos

### **PASO 1: Reiniciar el servidor de Vite**

Si el servidor está corriendo, detenerlo con `Ctrl+C` y reiniciarlo:

```powershell
npm run dev
```

### **PASO 2: Limpiar la caché del navegador**

**Opción A - Usar modo incógnito:**
- Presiona `Ctrl + Shift + N` (Chrome/Edge)
- Navega a `http://localhost:5173`

**Opción B - Limpiar localStorage:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Ejecuta:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

### **PASO 3: Intentar login nuevamente**

1. Ve a `http://localhost:5173`
2. Haz clic en "Login"
3. Ingresa tus credenciales
4. **Abre la consola del navegador (F12)** para ver los logs

### **PASO 4: Verificar los logs**

Deberías ver en la consola algo como:

```
========== DEBUG LOGIN ==========
Respuesta completa: { data: { token: "eyJ...", username: "admin", ... } }
response.data: { token: "eyJ...", username: "admin", email: "...", fullName: "..." }
Campos en response.data: ["token", "type", "username", "email", "fullName"]
=================================
Token extraído: eyJ...
User data extraído: { username: "admin", email: "...", fullName: "..." }
✅ Token guardado en localStorage: SÍ
Longitud del token: 147
```

---

## 🔍 Diagnóstico de Problemas

### ❌ Si NO ves el token en los logs:

**Posible causa:** El backend no está devolviendo el token.

**Verificación:**
1. Ve a la pestaña "Network" en las DevTools
2. Busca la petición `POST /api/v1/auth/login`
3. Haz clic en ella
4. Ve a la pestaña "Response"
5. Verifica que contenga el campo `token`

**Solución:** Revisa la configuración del backend.

---

### ❌ Si ves "CORS error" en la consola:

**Posible causa:** El proxy no se está usando.

**Verificación:**
1. Ve a la pestaña "Network"
2. Busca la petición `POST .../auth/login`
3. Verifica la URL:
   - ✅ **CORRECTO:** `http://localhost:5173/api/v1/auth/login`
   - ❌ **INCORRECTO:** `http://localhost:8080/api/v1/auth/login`

**Solución:**
```powershell
# Detener el servidor
Ctrl + C

# Limpiar caché
Remove-Item -Path node_modules\.vite -Recurse -Force

# Reiniciar
npm run dev
```

---

### ❌ Si recibes 401 "Credenciales inválidas":

**Posible causa:** Usuario o contraseña incorrectos.

**Solución:** Verifica las credenciales o crea un nuevo admin:

```bash
# Si el backend tiene endpoint para crear primer admin
curl -X POST http://localhost:8080/api/v1/auth/first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "email": "admin@aspadif.org",
    "fullName": "Administrador Principal"
  }'
```

---

### ❌ Si después del login sigues recibiendo 403:

**Posible causa 1:** El token no se está enviando en las peticiones.

**Verificación:**
1. Haz una acción que requiera autenticación (crear premio, listar usuarios, etc.)
2. Ve a "Network" y busca esa petición
3. Haz clic en la petición → pestaña "Headers"
4. Busca el header `Authorization`
5. Debe decir: `Bearer eyJ...`

**Posible causa 2:** El backend no acepta el token.

**Verificación:** El backend debe estar configurado para aceptar JWT en el header `Authorization: Bearer {token}`.

---

## 📋 Checklist de Verificación

Marca cada item cuando esté completado:

- [ ] Servidor de Vite reiniciado
- [ ] Caché del navegador limpiada
- [ ] Login exitoso sin errores en consola
- [ ] Logs muestran "✅ Token guardado en localStorage: SÍ"
- [ ] Token visible en localStorage (F12 → Application → Local Storage)
- [ ] Peticiones posteriores incluyen header `Authorization: Bearer ...`
- [ ] No hay errores 403 en peticiones autenticadas
- [ ] Navegación al dashboard admin funciona correctamente

---

## 🎯 Resultado Esperado

Después de aplicar estos cambios:

1. **Login exitoso:** El token se guarda correctamente
2. **Sin errores CORS:** Todas las peticiones pasan por el proxy
3. **Autenticación funcional:** Las peticiones incluyen el token JWT
4. **Sin errores 403:** El backend acepta las peticiones autenticadas
5. **Navegación fluida:** Puedes acceder a todas las páginas de administración

---

## 📞 Soporte

Si sigues teniendo problemas después de seguir todos los pasos:

1. **Copia los logs de la consola** después del login
2. **Copia la respuesta** de la pestaña Network → POST auth/login → Response
3. **Describe el comportamiento** que estás viendo

---

**Actualizado por:** GitHub Copilot  
**Última modificación:** 30 de Marzo, 2026

