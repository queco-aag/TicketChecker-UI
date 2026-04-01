# ⚠️ CONFIGURACIÓN CORS REQUERIDA EN EL BACKEND

**Fecha:** 30 de Marzo, 2026  
**Cambio:** Llamadas directas al backend (sin proxy de Vite)

---

## 🎯 Cambio Realizado

**ANTES:** Peticiones pasaban por el proxy de Vite
- Frontend: `http://localhost:5173/api/v1/...`
- Proxy redirigía a: `http://localhost:8080/api/v1/...`

**AHORA:** Peticiones directas al backend
- Frontend: `http://localhost:8080/api/v1/...`
- **REQUIERE:** CORS habilitado en el backend

---

## ✅ CONFIGURACIÓN CORS EN EL BACKEND (OBLIGATORIA)

El backend **DEBE** tener CORS configurado correctamente para permitir peticiones desde `http://localhost:5173`.

### **Opción 1: Spring Boot - Configuración Global**

Crear o modificar el archivo de configuración web:

**Archivo:** `src/main/java/com/aspadif/ticketchecker/config/WebConfig.java`

```java
package com.aspadif.ticketchecker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:5173",      // Frontend Vite dev
                    "http://localhost:3000",      // Frontend Docker
                    "https://ticketchecker.aspadif.org"  // Producción
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

---

### **Opción 2: Spring Security - Configuración CORS**

Si el backend usa Spring Security, agregar CORS en la configuración de seguridad:

**Archivo:** `src/main/java/com/aspadif/ticketchecker/config/SecurityConfig.java`

```java
package com.aspadif.ticketchecker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Orígenes permitidos
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",      // Frontend Vite dev
            "http://localhost:3000",      // Frontend Docker
            "https://ticketchecker.aspadif.org"  // Producción
        ));
        
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // Headers permitidos
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Permitir credenciales (cookies, Authorization header)
        configuration.setAllowCredentials(true);
        
        // Tiempo de caché de la configuración CORS
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            // ... resto de configuración de seguridad
            ;
        
        return http.build();
    }
}
```

---

### **Opción 3: Application Properties**

Algunos frameworks Spring Boot permiten configurar CORS en `application.properties` o `application.yml`:

**Archivo:** `src/main/resources/application.properties`

```properties
# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5173,http://localhost:3000,https://ticketchecker.aspadif.org
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
spring.web.cors.max-age=3600
```

**O en YAML:** `src/main/resources/application.yml`

```yaml
spring:
  web:
    cors:
      allowed-origins:
        - http://localhost:5173
        - http://localhost:3000
        - https://ticketchecker.aspadif.org
      allowed-methods:
        - GET
        - POST
        - PUT
        - DELETE
        - PATCH
        - OPTIONS
      allowed-headers: "*"
      allow-credentials: true
      max-age: 3600
```

---

### **Opción 4: Anotación @CrossOrigin en Controladores**

Si prefieres configurar CORS por controlador:

```java
package com.aspadif.ticketchecker.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:3000",
        "https://ticketchecker.aspadif.org"
    },
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
        RequestMethod.PATCH,
        RequestMethod.OPTIONS
    },
    allowedHeaders = "*",
    allowCredentials = "true",
    maxAge = 3600
)
public class PremiosController {
    
    // ... endpoints
    
}
```

⚠️ **Nota:** Debes agregar `@CrossOrigin` en TODOS los controladores.

---

## 🔍 Verificar que CORS está Configurado

### **1. Desde PowerShell:**

```powershell
# Hacer una petición OPTIONS (preflight)
curl -X OPTIONS http://localhost:8080/api/v1/premios `
  -H "Origin: http://localhost:5173" `
  -H "Access-Control-Request-Method: POST" `
  -H "Access-Control-Request-Headers: Authorization,Content-Type" `
  -v
```

**Deberías ver en la respuesta:**
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: *
Access-Control-Allow-Credentials: true
```

### **2. Desde el navegador:**

Después de configurar CORS en el backend:

1. Reinicia el backend
2. Abre el frontend: `http://localhost:5173`
3. Haz login
4. Intenta crear un premio
5. Abre F12 → Console
6. **NO** deberías ver errores CORS

---

## 📋 Checklist de Configuración

- [ ] Configurar CORS en el backend (una de las opciones de arriba)
- [ ] Reiniciar el backend
- [ ] Reiniciar el frontend (`npm run dev`)
- [ ] Limpiar caché del navegador (Ctrl+Shift+Delete)
- [ ] Hacer login de nuevo
- [ ] Probar crear premio
- [ ] Verificar en F12 → Console que NO hay errores CORS
- [ ] Verificar en F12 → Network que las peticiones retornan 200 OK (no 403)

---

## 🚨 Si Sigue Dando 403

El error 403 después de configurar CORS puede deberse a:

### **1. El usuario no tiene el rol correcto**

Verifica que el usuario tenga rol ADMIN:

```java
// En el endpoint de premios
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/premios")
public ResponseEntity<?> crearPremio(@RequestBody CrearPremioRequest request) {
    // ...
}
```

El token JWT debe incluir el rol en el claim correspondiente.

### **2. El endpoint POST /premios no existe**

Verifica que el endpoint esté implementado en el backend:

```java
@RestController
@RequestMapping("/api/v1")
public class PremiosController {
    
    @PostMapping("/premios")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crearPremio(@RequestBody CrearPremioRequest request) {
        // Implementación
        Premio premio = premioService.crearPremio(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(premio);
    }
}
```

### **3. El token JWT no es válido**

Verifica en el backend los logs cuando recibe la petición. Debería mostrar:
- El token recibido
- Si el token es válido
- El usuario extraído del token
- Los roles del usuario

---

## 📄 Archivos Modificados en el Frontend

| Archivo | Cambio |
|---------|--------|
| `src/shared/api/client.js` | URL absoluta `http://localhost:8080/api/v1` |
| `.env` | `VITE_API_URL=http://localhost:8080/api/v1` |

---

## 🔄 Flujo de Peticiones (Ahora)

```
Frontend (localhost:5173)
    ↓
    Petición directa a: http://localhost:8080/api/v1/premios
    Headers: Authorization: Bearer {token}
    ↓
Backend (localhost:8080)
    ↓
    1. Verifica CORS (Origin: http://localhost:5173)
    2. Valida el token JWT
    3. Verifica el rol del usuario (ADMIN)
    4. Ejecuta el endpoint
    ↓
    Respuesta con headers CORS:
    Access-Control-Allow-Origin: http://localhost:5173
    ↓
Frontend recibe la respuesta ✅
```

---

## 🆘 Si Necesitas Ayuda

**Comparte los logs del backend** cuando hagas la petición. Deberían mostrar:

```
[INFO] Request: POST /api/v1/premios
[INFO] Origin: http://localhost:5173
[INFO] Authorization: Bearer eyJ...
[DEBUG] Token válido: true
[DEBUG] Usuario: admin
[DEBUG] Roles: [ROLE_ADMIN]
[INFO] Response: 201 Created
```

Si muestra algo diferente (como "Token inválido" o "Acceso denegado"), eso indicará el problema.

---

**Actualizado por:** GitHub Copilot  
**Fecha:** 30 de Marzo, 2026  
**Estado:** ⚠️ Requiere configuración CORS en el backend

