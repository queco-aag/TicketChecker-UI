# ✅ Solución de Errores CORS

## 📋 Problema Identificado

Los errores en la consola del navegador indican:

```
Access to XMLHttpRequest at 'http://localhost:8080/api/v1/premios' from origin 
'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' 
header is present on the requested resource.
```

### ¿Qué significa?

**CORS (Cross-Origin Resource Sharing)** es una medida de seguridad del navegador que impide que una aplicación web en un dominio (ej: `http://localhost:5173`) haga peticiones a otro dominio (ej: `http://localhost:8080`) sin permiso explícito.

## ✅ Soluciones Implementadas

### Solución 1: Proxy de Vite (IMPLEMENTADA)

Se configuró un **proxy en Vite** que redirige todas las peticiones a `/api` al backend en `http://localhost:8080`. Esto evita el error CORS en desarrollo.

#### Cambios realizados:

**1. `vite.config.js`**
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

**2. `.env`**
```env
VITE_API_URL=/api/v1
```

#### ✅ Ventajas:
- No requiere cambios en el backend
- Solución inmediata para desarrollo
- Fácil de implementar

#### ⚠️ Limitaciones:
- Solo funciona en desarrollo
- En producción necesitarás configurar CORS en el backend

---

### Solución 2: Configurar CORS en el Backend (RECOMENDADA PARA PRODUCCIÓN)

Para producción, el backend **debe** configurar CORS correctamente.

#### Spring Boot (Java)

**Opción A: Configuración Global**

Crear `WebConfig.java`:

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
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "https://ticketchecker.aspadif.org" // Producción
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

**Opción B: Con Spring Security**

En `SecurityConfig.java`:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173",
        "https://ticketchecker.aspadif.org"
    ));
    configuration.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
    ));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
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
        // ... resto de configuración
        ;
    return http.build();
}
```

**Opción C: application.properties**

```properties
# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5173,https://ticketchecker.aspadif.org
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
spring.web.cors.max-age=3600
```

#### Node.js/Express

```bash
npm install cors
```

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ticketchecker.aspadif.org'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600
}));
```

---

## 🚀 Pasos para Aplicar la Solución

### Para Desarrollo (YA APLICADO)

1. ✅ La configuración del proxy de Vite ya está aplicada
2. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre la aplicación en `http://localhost:5173`
4. Los errores CORS deberían desaparecer

### Para Producción

1. Implementa la configuración CORS en el backend (ver arriba)
2. Actualiza `.env` para producción:
   ```env
   VITE_API_URL=https://api.aspadif.org/api/v1
   ```
3. Reconstruye el frontend:
   ```bash
   npm run build
   ```

---

## 🔍 Verificación

### Comprobar que funciona:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Realiza una acción que haga una petición a la API
4. Verifica que:
   - ✅ La petición se completa exitosamente (200 OK)
   - ✅ No hay errores CORS en la consola
   - ✅ Los headers de respuesta incluyen `Access-Control-Allow-Origin`

### Comandos útiles:

```bash
# Ver logs de Vite con el proxy
npm run dev

# Probar la API directamente
curl -X GET http://localhost:5173/api/v1/premios \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

## 📚 Otros Errores Relacionados

### Error 401 Unauthorized

Si ves errores 401 en `/auth/login`, puede deberse a:

1. **Credenciales incorrectas**
2. **Token expirado**: Cierra sesión e inicia sesión de nuevo
3. **Backend no configurado**: Verifica que el endpoint `/auth/login` esté implementado

### Error 403 Forbidden

Si ves 403 al crear premios:

1. **Falta autenticación**: Asegúrate de estar autenticado
2. **Permisos insuficientes**: El usuario debe tener rol ADMIN
3. **CSRF habilitado**: Si usas Spring Security, deshabilita CSRF para APIs REST

---

## 📝 Resumen

| Solución | Ventajas | Desventajas | Cuándo usar |
|----------|----------|-------------|-------------|
| Proxy Vite | Fácil, inmediata | Solo desarrollo | **Desarrollo** |
| CORS Backend | Funciona en producción | Requiere cambios backend | **Producción** |
| Ambas | Mejor de ambos mundos | Más configuración | **Recomendado** |

## ✅ Próximos Pasos

1. ✅ Proxy de Vite configurado (desarrollo)
2. ⏳ Implementar CORS en el backend (para producción)
3. ⏳ Probar en producción con el dominio real

---

## 🆘 ¿Aún tienes problemas?

Si después de reiniciar el servidor de desarrollo sigues viendo errores CORS:

1. Verifica que el backend esté ejecutándose en `http://localhost:8080`
2. Limpia la caché del navegador (Ctrl + Shift + Delete)
3. Reinicia el servidor de Vite:
   ```bash
   # Detener (Ctrl+C)
   # Iniciar de nuevo
   npm run dev
   ```
4. Revisa la configuración en `vite.config.js` y `.env`

---

**Fecha de actualización**: 2026-03-29  
**Estado**: ✅ Solución implementada para desarrollo

