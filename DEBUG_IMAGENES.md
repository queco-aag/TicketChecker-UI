# 🔍 DEBUG: Imágenes No Se Muestran en la Tabla

## 📋 PASOS DE DEPURACIÓN

### **1. Verificar Logs en la Consola del Navegador**

Abre la consola del navegador (F12) y busca los siguientes mensajes:

```
📊 PREMIOS CARGADOS: [...]
📌 PRIMER PREMIO: {...}
📌 urlFoto del primer premio: /uploads/...
🔍 getImageUrl - Entrada: /uploads/...
🌐 getImageUrl - Base URL: http://localhost:8080
✅ getImageUrl - URL con /uploads/ detectada: http://localhost:8080/uploads/...
🖼️ DEBUG IMAGEN: {...}
```

**¿Qué revisar?**
- ✅ ¿El campo `urlFoto` tiene valor?
- ✅ ¿La URL calculada es correcta?
- ❌ ¿Hay errores 404 o 403 al cargar las imágenes?
- ❌ ¿Hay errores de CORS?

---

### **2. Verificar la Red (Network Tab)**

En las DevTools, ve a la pestaña **Network**:

1. Filtra por **Img** o **All**
2. Recarga la página
3. Busca las peticiones a `/uploads/...`

**Posibles problemas:**

#### **A. Error 404 - Archivo no encontrado**
```
GET http://localhost:8080/uploads/imagen.jpg → 404 Not Found
```

**Solución:** El archivo no existe en el backend.
- Verifica que la carpeta `uploads/` existe
- Verifica que el archivo está en la carpeta
- Verifica los permisos de la carpeta

#### **B. Error 403 - Acceso denegado**
```
GET http://localhost:8080/uploads/imagen.jpg → 403 Forbidden
```

**Solución:** El backend no permite servir archivos estáticos.
- Verifica la configuración de Spring para servir `/uploads/`

#### **C. Error CORS**
```
Access to XMLHttpRequest at 'http://localhost:8080/uploads/imagen.jpg' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solución:** CORS no está configurado para `/uploads/`
- Agrega `/uploads/**` a la configuración de CORS del backend

#### **D. La imagen se carga correctamente (200 OK)**
```
GET http://localhost:8080/uploads/imagen.jpg → 200 OK
```

Si la imagen se carga con éxito pero no se muestra:
- Verifica que el componente `<Image>` de PrimeReact esté funcionando
- Verifica que no haya errores de CSS

---

### **3. Verificar Backend - Servir Archivos Estáticos**

El backend debe estar configurado para servir archivos estáticos de `/uploads/`.

**En Spring Boot, esto se hace con:**

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
```

**Verificar:**
- ✅ ¿Existe la carpeta `uploads/` en el directorio raíz del backend?
- ✅ ¿Hay archivos dentro de `uploads/`?
- ✅ ¿El backend está configurado para servir archivos estáticos?

---

### **4. Prueba Manual**

Abre el navegador y accede directamente a:

```
http://localhost:8080/uploads/nombre-del-archivo.jpg
```

Reemplaza `nombre-del-archivo.jpg` con el nombre real de una imagen que sepas que existe.

**Resultados posibles:**

✅ **Se muestra la imagen** → El backend está sirviendo correctamente
- El problema está en el frontend (revisa los logs)

❌ **Error 404** → El archivo no existe o la ruta es incorrecta
- Verifica que el archivo existe en `uploads/`
- Verifica el nombre del archivo

❌ **Error 403** → El backend no permite acceder a `/uploads/`
- Configura el backend para servir archivos estáticos

❌ **Error 500** → Error del servidor
- Revisa los logs del backend

---

### **5. Verificar Estructura de Respuesta del Backend**

Usa Bruno, Postman o curl para llamar a:

```
GET http://localhost:8080/api/v1/premios
```

**Respuesta esperada:**

```json
{
  "success": true,
  "premios": [
    {
      "id": 1,
      "nombre": "PlayStation 5",
      "descripcion": "Consola",
      "urlFoto": "/uploads/premio_123.jpg",  ← Este campo debe existir
      "anio": 2026,
      "enviado": false
    }
  ]
}
```

O directamente el array:

```json
[
  {
    "id": 1,
    "nombre": "PlayStation 5",
    "descripcion": "Consola",
    "urlFoto": "/uploads/premio_123.jpg",  ← Este campo debe existir
    "anio": 2026,
    "enviado": false
  }
]
```

**Verificar:**
- ✅ ¿El campo `urlFoto` existe?
- ✅ ¿El campo `urlFoto` tiene valor?
- ✅ ¿El valor es una URL relativa (`/uploads/...`) o absoluta?

---

### **6. Posibles Formatos de `urlFoto`**

El frontend soporta estos formatos:

#### **Formato 1: URL Relativa (RECOMENDADO)**
```json
"urlFoto": "/uploads/premio_123.jpg"
```
→ Se convierte a: `http://localhost:8080/uploads/premio_123.jpg`

#### **Formato 2: URL Absoluta**
```json
"urlFoto": "http://localhost:8080/uploads/premio_123.jpg"
```
→ Se usa tal cual

#### **Formato 3: Solo Nombre**
```json
"urlFoto": "premio_123.jpg"
```
→ Se convierte a: `http://localhost:8080/uploads/premio_123.jpg`

---

### **7. Verificar CORS en el Backend**

Si hay errores de CORS, el backend debe permitir:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 🔧 SOLUCIONES RÁPIDAS

### **Solución 1: Backend no sirve archivos estáticos**

Crear `WebConfig.java` en el backend:

```java
package com.particular.lottery.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir archivos estáticos de uploads/
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/")
                .setCachePeriod(3600);
    }
}
```

### **Solución 2: Error CORS**

Actualizar `CorsConfig.java`:

```java
registry.addMapping("/**")  // Permitir todo, incluyendo /uploads/
        .allowedOrigins("http://localhost:5173")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true);
```

### **Solución 3: Carpeta uploads/ no existe**

Crear la carpeta en el directorio raíz del backend:

```bash
cd C:\Workspace\Particular\TicketChecker
mkdir uploads
```

### **Solución 4: Permisos de la carpeta**

En Windows:
1. Click derecho en la carpeta `uploads/`
2. Propiedades → Seguridad
3. Asegúrate de que el usuario que ejecuta el backend tiene permisos de lectura

---

## 📊 CHECKLIST DE VERIFICACIÓN

- [ ] Los logs en consola muestran que `urlFoto` tiene valor
- [ ] La función `getImageUrl` devuelve una URL completa
- [ ] La pestaña Network muestra peticiones a `/uploads/...`
- [ ] Las peticiones a `/uploads/...` responden con 200 OK
- [ ] No hay errores de CORS en la consola
- [ ] La carpeta `uploads/` existe en el backend
- [ ] Hay archivos de imagen en `uploads/`
- [ ] El backend tiene configuración para servir archivos estáticos
- [ ] Puedo acceder directamente a `http://localhost:8080/uploads/imagen.jpg`

---

## 📞 PRÓXIMOS PASOS

1. **Abre la consola del navegador** (F12)
2. **Recarga la página de premios**
3. **Copia todos los logs** que empiecen con 🔍, 📊, 🖼️
4. **Ve a la pestaña Network** y verifica las peticiones a `/uploads/`
5. **Comparte los resultados** para análisis

---

**Creado:** 2026-04-01  
**Propósito:** Depurar problema de imágenes no visibles en tabla de premios

