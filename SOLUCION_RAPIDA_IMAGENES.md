# 🚀 SOLUCIÓN RÁPIDA: Imágenes No Se Ven

## ⚡ PASOS INMEDIATOS

### **Paso 1: Ejecutar Script de Diagnóstico**

1. Abre la aplicación en el navegador: `http://localhost:5173`
2. Ve a la página de "Premios"
3. Abre las DevTools (F12)
4. Ve a la pestaña **Console**
5. Copia y pega el contenido del archivo `test-imagenes.js`
6. Presiona Enter

**Esto te dirá exactamente cuál es el problema.**

---

### **Paso 2: Revisar los Logs**

En la consola, busca estos mensajes:

```
📊 PREMIOS CARGADOS: [...]
📌 urlFoto del primer premio: /uploads/...
🔍 getImageUrl - Entrada: /uploads/...
✅ getImageUrl - URL con /uploads/ detectada: http://localhost:8080/uploads/...
```

**Copia y pégame todos los logs para analizarlos.**

---

## 🎯 PROBLEMA MÁS PROBABLE

Basándome en la información, el problema más probable es que:

### **El backend NO está sirviendo archivos estáticos de `/uploads/`**

**Síntomas:**
- ✅ `urlFoto` tiene valor en la respuesta del backend
- ✅ La URL se construye correctamente en el frontend
- ❌ Las imágenes no se muestran en la tabla
- ❌ Error 404 o 403 al intentar cargar las imágenes

---

## ✅ SOLUCIÓN

Necesitas configurar el backend para servir archivos estáticos.

### **Opción A: Crear WebConfig.java (SI NO EXISTE)**

Crea el archivo `src/main/java/com/particular/lottery/config/WebConfig.java`:

```java
package com.particular.lottery.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir archivos estáticos de la carpeta uploads/
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/")
                .setCachePeriod(3600);
    }
}
```

### **Opción B: Actualizar WebConfig.java (SI YA EXISTE)**

Si ya existe `WebConfig.java`, agrega el método `addResourceHandlers`:

```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:uploads/");
}
```

### **Paso 3: Reiniciar el Backend**

```bash
cd C:\Workspace\Particular\TicketChecker
mvnw spring-boot:run
```

O si usas el script:
```bash
.\scripts\start.bat
```

### **Paso 4: Verificar que Funciona**

Abre el navegador y accede directamente a:

```
http://localhost:8080/uploads/nombre-de-tu-imagen.jpg
```

Reemplaza `nombre-de-tu-imagen.jpg` con el nombre real de una imagen que esté en la carpeta `uploads/`.

**Si se muestra la imagen:** ✅ ¡Funcionó!  
**Si no se muestra:** ❌ Revisa los siguientes puntos

---

## 🔍 VERIFICACIONES ADICIONALES

### **1. Verificar que la carpeta `uploads/` existe**

```bash
cd C:\Workspace\Particular\TicketChecker
dir uploads
```

Debería mostrar los archivos de imagen.

**Si no existe:**
```bash
mkdir uploads
```

### **2. Verificar que hay imágenes en `uploads/`**

```bash
cd uploads
dir
```

Debería mostrar archivos como:
```
Captura_de_pantalla_2025-04-14_144716_1775050784595.png
```

**Si no hay archivos:** Sube una imagen usando el formulario de premios.

### **3. Verificar CORS**

Asegúrate de que CORS esté configurado para permitir `/uploads/`.

En `CorsConfig.java` o `SecurityConfig.java`, debe haber:

```java
registry.addMapping("/**")  // ← Esto permite TODO, incluyendo /uploads/
        .allowedOrigins("http://localhost:5173")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true);
```

---

## 🎯 VERIFICACIÓN FINAL

Después de aplicar la solución:

1. **Reinicia el backend**
2. **Recarga el frontend** (F5)
3. **Ve a la página de Premios**
4. **Las imágenes deberían aparecer** ✅

---

## 📞 SI SIGUE SIN FUNCIONAR

Copia y pega aquí:

1. **Logs de la consola del navegador** (todos los que empiezan con 🔍, 📊, 🖼️)
2. **Resultado del script de prueba** (test-imagenes.js)
3. **Errores de la pestaña Network** (si hay)
4. **Estructura de la respuesta del backend** (GET /api/v1/premios)

Con esa información podré darte una solución específica.

---

**Creado:** 2026-04-01  
**Archivo de diagnóstico:** `DEBUG_IMAGENES.md`  
**Script de prueba:** `test-imagenes.js`

