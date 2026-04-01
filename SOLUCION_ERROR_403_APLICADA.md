# ✅ SOLUCIÓN APLICADA - Error 403 Resuelto

**Fecha:** 30 de Marzo, 2026  
**Problema:** Error 403 al crear premios - Token sin roles

---

## 🎯 CAUSA RAÍZ IDENTIFICADA

El diagnóstico mostró:
```
• Roles: Ninguno  ← PROBLEMA
• Status: 403
```

**El token JWT NO incluía los roles del usuario**, por lo que Spring Security rechazaba las peticiones con 403 Forbidden.

---

## ✅ SOLUCIÓN APLICADA

### **Archivo Modificado:** `JwtService.java`

**Ubicación:** `C:\Workspace\Particular\TicketChecker\src\main\java\com\lottery\security\JwtService.java`

**Cambio realizado:**

```java
/**
 * Genera un token JWT para el usuario
 * MODIFICADO: Ahora incluye los roles en el token
 */
public String generateToken(UserDetails userDetails) {
    // Crear claims adicionales con los roles del usuario
    Map<String, Object> extraClaims = new HashMap<>();
    
    // Extraer los roles/authorities del usuario
    List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());
    
    // Agregar los roles al token
    extraClaims.put("roles", roles);
    
    return generateToken(extraClaims, userDetails);
}
```

**Imports agregados:**
```java
import org.springframework.security.core.GrantedAuthority;
import java.util.List;
import java.util.stream.Collectors;
```

---

## 📋 CONFIGURACIÓN DE SEGURIDAD (Ya estaba correcta)

El `SecurityConfig.java` ya tiene:

✅ **CORS configurado:**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOriginPatterns(List.of(
            "http://localhost:[*]",
            "http://127.0.0.1:[*]"
    ));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    // ...
}
```

✅ **Endpoint de premios protegido:**
```java
.requestMatchers("/api/v1/premios/**").hasRole("ADMIN")
```

Esto espera que el token tenga **`"ROLE_ADMIN"`** (con prefijo).

---

## 🚀 PRÓXIMOS PASOS - RECOMPILAR EL BACKEND

### **PASO 1: Ir al directorio del backend**

```powershell
cd C:\Workspace\Particular\TicketChecker
```

### **PASO 2: Recompilar el backend**

**Opción A - Con Maven Wrapper (Recomendado):**
```powershell
.\mvnw clean package -DskipTests
```

**Opción B - Con Maven instalado:**
```powershell
mvn clean package -DskipTests
```

**Opción C - Usar el script incluido:**
```powershell
.\scripts\build.ps1
```

### **PASO 3: Reiniciar el backend**

**Si está corriendo, detenerlo (Ctrl+C) y luego:**

```powershell
java -jar target\ticket-checker.jar
```

**O con el script:**
```powershell
.\scripts\run.bat
```

### **PASO 4: Verificar que arrancó correctamente**

Deberías ver en los logs:
```
Started LotteryServiceApplication in X.XXX seconds
```

---

## 🧪 VERIFICACIÓN

### **1. Hacer login de nuevo**

Ve a `http://localhost:5173`, haz logout (si estás logueado) y vuelve a hacer login.

**IMPORTANTE:** Debes hacer login DE NUEVO porque el token anterior no tiene roles.

### **2. Ejecutar el diagnóstico de nuevo**

En la consola del navegador (F12):

```javascript
const token = localStorage.getItem('ticketchecker.admin.token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Roles:', payload.roles);
```

**Deberías ver:**
```javascript
Roles: ["ROLE_ADMIN"]
```

### **3. Intentar crear un premio**

Ir a "Gestión de Premios" → "Nuevo Premio" → Rellenar el formulario → Guardar

**Resultado esperado:**
- ✅ Status: 201 Created
- ✅ Premio creado exitosamente
- ✅ Sin error 403

---

## 📊 ANTES vs DESPUÉS

### **ANTES:**

```javascript
// Token JWT payload
{
  "sub": "admin",
  "iat": 1774868697,
  "exp": 1774955097
  // ❌ NO hay roles
}

// Resultado
Status: 403 Forbidden
```

### **DESPUÉS:**

```javascript
// Token JWT payload
{
  "roles": ["ROLE_ADMIN"],  // ✅ Roles incluidos
  "sub": "admin",
  "iat": 1774868697,
  "exp": 1774955097
}

// Resultado
Status: 201 Created ✅
```

---

## 🔧 SI EL PROBLEMA PERSISTE

### **Verificar que el backend se recompiló:**

```powershell
# Ver la fecha de modificación del JAR
Get-Item C:\Workspace\Particular\TicketChecker\target\ticket-checker.jar | Select-Object LastWriteTime
```

Debe mostrar la fecha de HOY.

### **Verificar los logs del backend:**

Cuando hagas login, el backend debería mostrar:
```
Usuario autenticado exitosamente: admin
```

Cuando intentes crear un premio, debería mostrar:
```
Request: POST /api/v1/premios
Authorization: Bearer eyJ...
```

### **Si sigue dando 403:**

1. Verifica que hiciste login DE NUEVO (el token viejo no tiene roles)
2. Ejecuta el diagnóstico para ver si el token tiene roles
3. Comparte los logs del backend

---

## 📄 ARCHIVO DE BACKUP

Se creó un backup del archivo original:
```
C:\Workspace\Particular\TicketChecker\src\main\java\com\lottery\security\JwtService.java.backup
```

Si necesitas revertir los cambios:
```powershell
Copy-Item "JwtService.java.backup" "JwtService.java" -Force
```

---

## 📝 RESUMEN DE CAMBIOS

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `JwtService.java` | Agregar roles al token JWT | ✅ Modificado |
| `SecurityConfig.java` | CORS y protección de endpoints | ✅ Ya estaba correcto |
| Backend | Recompilar | ⏳ **PENDIENTE - HAZLO TÚ** |
| Frontend | Hacer login de nuevo | ⏳ **PENDIENTE - HAZLO TÚ** |

---

## 🎯 CHECKLIST

- [x] Modificar JwtService.java para incluir roles
- [x] Crear backup del archivo original
- [ ] Recompilar el backend (mvnw clean package)
- [ ] Reiniciar el backend (java -jar target/ticket-checker.jar)
- [ ] Hacer logout en el frontend
- [ ] Hacer login de nuevo
- [ ] Verificar que el token tiene roles
- [ ] Intentar crear un premio
- [ ] Verificar que funciona (201 Created)

---

**AHORA RECOMPILA EL BACKEND Y PRUEBA DE NUEVO.** 🚀

---

**Actualizado por:** GitHub Copilot  
**Fecha:** 30 de Marzo, 2026  
**Estado:** ✅ Código modificado - ⏳ Pendiente recompilar

