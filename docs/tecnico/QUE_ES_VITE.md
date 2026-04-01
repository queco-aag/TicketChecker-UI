# 📦 ¿Qué es Vite y qué hace en este proyecto?

**Fecha:** 1 de Abril, 2026  
**Pregunta del usuario:** "¿Qué es lo que hace Vite exactamente en el proyecto?"

---

## 🔷 ¿Qué es Vite?

**Vite** es una herramienta de desarrollo moderna para proyectos frontend que proporciona:

1. **Servidor de desarrollo ultrarrápido**
2. **Compilación (build) optimizada para producción**
3. **Hot Module Replacement (HMR)** - recarga automática en desarrollo

**Sitio oficial:** https://vitejs.dev/

---

## 🎯 ¿Qué hace Vite en TicketChecker-UI?

### **1. En modo DESARROLLO (npm run dev):**

Cuando ejecutas:
```powershell
npm run dev
```

Vite hace lo siguiente:

#### **A. Inicia un servidor de desarrollo**
```
Local:   http://localhost:5173/
Network: use --host to expose
```

- 🚀 Servidor HTTP local en el puerto **5173**
- 🔥 Hot Module Replacement (HMR) activado
- ⚡ Compilación on-demand (solo compila lo que necesitas)
- 🔄 Recarga automática cuando cambias archivos

#### **B. Transforma tu código**
- **JSX → JavaScript:** Convierte código React JSX a JavaScript
- **ES Modules:** Sirve módulos ES6 nativos al navegador
- **CSS:** Procesa y aplica estilos en caliente
- **Assets:** Maneja imágenes, fuentes, etc.

#### **C. Hot Module Replacement (HMR)**
Cuando modificas un archivo:
```
src/features/admin/PrizesManagementPage.jsx
```

1. Vite detecta el cambio
2. Compila solo ese módulo
3. Envía el cambio al navegador vía WebSocket
4. El navegador actualiza solo ese componente
5. ✅ NO recarga toda la página
6. ✅ Mantiene el estado de la aplicación

**Resultado:** Desarrollo súper rápido sin perder el estado.

---

### **2. En modo PRODUCCIÓN (npm run build):**

Cuando ejecutas:
```powershell
npm run build
```

Vite hace lo siguiente:

#### **A. Compila toda la aplicación**
```
src/
  ├── App.jsx
  ├── main.jsx
  ├── features/
  ├── services/
  └── ...
```
↓ **Vite + Rollup** ↓
```
dist/
  ├── index.html
  ├── assets/
  │   ├── index-a1b2c3d4.js    (código minificado)
  │   ├── index-e5f6g7h8.css   (estilos minificados)
  │   └── logo-i9j0k1l2.svg    (assets optimizados)
  └── ...
```

#### **B. Optimizaciones aplicadas:**
- ✅ **Minificación:** Reduce el tamaño del código
- ✅ **Tree-shaking:** Elimina código no usado
- ✅ **Code splitting:** Divide el código en chunks
- ✅ **Hashing de archivos:** Cacheo eficiente (index-a1b2c3d4.js)
- ✅ **Compresión de assets:** Optimiza imágenes, fuentes
- ✅ **Sourcemaps:** Para debugging (opcional)

#### **C. Resultado:**
Carpeta `dist/` lista para desplegar en:
- Servidor web (Nginx, Apache)
- CDN (Cloudflare, AWS S3)
- Hosting estático (Vercel, Netlify)
- Docker container

---

## 📊 Comparación con otras herramientas

| Herramienta | Velocidad | Configuración | Uso |
|-------------|-----------|---------------|-----|
| **Vite** | ⚡⚡⚡ Muy rápido | 📝 Mínima | ✅ Recomendado para proyectos nuevos |
| **Create React App (CRA)** | 🐌 Lento | 📝 Automática | ⚠️ Ya no se recomienda |
| **Webpack** | 🐢 Más lento | 📚 Compleja | ⚠️ Para proyectos legacy |
| **Parcel** | ⚡ Rápido | 📝 Cero config | ✅ Alternativa a Vite |

---

## 🔧 Configuración en TicketChecker-UI

### **Archivo: `vite.config.js`**

**ANTES (con proxy):**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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

**AHORA (sin proxy - más simple):**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})
```

**¿Por qué quitamos el proxy?**
- El cliente API (`client.js`) ya llama directamente a `http://localhost:8080/api/v1`
- El proxy no se estaba usando
- Simplifica la configuración
- Requiere que el backend tenga CORS configurado (lo cual ya está hecho)

---

## 🚀 Comandos Vite en este proyecto

### **Desarrollo:**
```powershell
npm run dev
```
- Inicia servidor en http://localhost:5173
- HMR activado
- Logs en la terminal

### **Build:**
```powershell
npm run build
```
- Compila para producción
- Genera carpeta `dist/`
- Muestra tamaños de archivos

### **Preview:**
```powershell
npm run preview
```
- Previsualiza el build de producción localmente
- Sirve la carpeta `dist/`
- Útil para probar antes de desplegar

---

## 📂 Estructura de archivos con Vite

```
TicketChecker-UI/
├── index.html              ← Punto de entrada HTML
├── vite.config.js          ← Configuración de Vite
├── package.json            ← Scripts: dev, build, preview
├── src/
│   ├── main.jsx            ← Punto de entrada JavaScript
│   ├── App.jsx             ← Componente raíz de React
│   ├── index.css           ← Estilos globales
│   └── ...
├── public/                 ← Assets estáticos (se copian tal cual)
│   └── vite.svg
└── dist/                   ← Build de producción (generado)
    ├── index.html
    └── assets/
```

### **Importante:**
- **`index.html`** está en la raíz (no en `public/`)
- Vite usa `<script type="module">` para cargar el código
- Los imports se resuelven como ES Modules nativos

---

## ⚡ Ventajas de Vite en este proyecto

### **1. Velocidad de desarrollo**
```
❌ Webpack/CRA: 20-30 segundos para iniciar
✅ Vite: 1-2 segundos para iniciar
```

### **2. Hot Module Replacement instantáneo**
```
❌ Webpack/CRA: 3-5 segundos al guardar
✅ Vite: < 100ms al guardar
```

### **3. Menor configuración**
```
❌ Webpack: 200+ líneas de configuración
✅ Vite: 5 líneas de configuración
```

### **4. Build optimizado**
```
✅ Usa Rollup internamente
✅ Tree-shaking automático
✅ Code-splitting inteligente
```

---

## 🐛 Error que tuviste con Vite

```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

**Causa:**
- Estabas ejecutando desde WSL (Linux)
- Las dependencias nativas de Rollup no estaban instaladas correctamente

**Solución:**
```powershell
# Eliminar dependencias
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# O ejecutar desde Windows (no WSL)
```

---

## 📚 Variables de entorno con Vite

**Archivo: `.env` o `.env.local`**
```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_API_TIMEOUT=30000
```

**Uso en el código:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
```

**Importante:**
- Las variables DEBEN empezar con `VITE_`
- Se accede con `import.meta.env.VITE_XXX`
- NO usar `process.env.XXX` (eso es de Node.js)

---

## 🔄 Flujo completo de Vite

### **Desarrollo (npm run dev):**
```
1. Tu navegador solicita: http://localhost:5173/
2. Vite sirve: index.html
3. index.html carga: <script type="module" src="/src/main.jsx">
4. Vite transforma: main.jsx → JavaScript
5. El navegador carga los módulos bajo demanda
6. HMR activo: cada cambio se refleja instantáneamente
```

### **Producción (npm run build):**
```
1. Vite analiza: src/main.jsx (punto de entrada)
2. Construye el grafo de dependencias
3. Optimiza y minifica todo el código
4. Genera: dist/index.html y dist/assets/*
5. Listo para desplegar
```

---

## 🎯 Conclusión

**¿Qué hace Vite en TicketChecker-UI?**

1. ✅ **En desarrollo:** Servidor ultra-rápido con HMR para programar sin esperas
2. ✅ **En producción:** Compilador optimizado que genera una app lista para desplegar
3. ✅ **Configuración mínima:** Solo 5 líneas de configuración
4. ✅ **Soporte React:** Plugin oficial `@vitejs/plugin-react`
5. ✅ **ES Modules nativos:** Aprovecha las capacidades modernas del navegador

**En resumen:** Vite hace que desarrollar sea MÁS RÁPIDO y el resultado final sea MÁS OPTIMIZADO.

---

**Más información:**
- Documentación oficial: https://vitejs.dev/
- Guía de migración desde CRA: https://vitejs.dev/guide/migration.html
- Plugins: https://vitejs.dev/plugins/

---

**Documentado por:** GitHub Copilot  
**Fecha:** 1 de Abril, 2026

