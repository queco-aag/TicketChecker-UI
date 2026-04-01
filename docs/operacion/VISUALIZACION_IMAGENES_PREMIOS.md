# ✅ Visualización de Imágenes en Premios

## 📋 RESUMEN

Se ha implementado correctamente la visualización de imágenes de premios en:
- ✅ Tabla de gestión de premios (DataTable)
- ✅ Formulario de creación de premios
- ✅ Formulario de edición de premios

---

## 🎯 COMPONENTES ACTUALIZADOS

### **1. Utilidad de Imágenes** (`src/shared/utils/imageUtils.js`)

Nueva utilidad que construye URLs completas de imágenes del backend:

```javascript
export const getImageUrl = (urlFoto) => {
  if (!urlFoto) return null;

  // Si ya es una URL completa (http:// o https://), devolverla tal cual
  if (urlFoto.startsWith('http://') || urlFoto.startsWith('https://')) {
    return urlFoto;
  }

  // Obtener la URL base del backend sin el /api/v1
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
  const baseUrl = apiUrl.replace('/api/v1', '');

  // Si la URL empieza con /uploads/, construir la URL completa
  if (urlFoto.startsWith('/uploads/')) {
    return `${baseUrl}${urlFoto}`;
  }

  // Si la URL empieza con /, construir la URL completa
  if (urlFoto.startsWith('/')) {
    return `${baseUrl}${urlFoto}`;
  }

  // Si es solo el nombre del archivo, asumir que está en /uploads/
  return `${baseUrl}/uploads/${urlFoto}`;
};
```

**Casos que maneja:**
- ✅ URLs absolutas: `https://example.com/image.jpg` → se devuelve tal cual
- ✅ URLs relativas: `/uploads/image.jpg` → se convierte a `http://localhost:8080/uploads/image.jpg`
- ✅ Solo nombres: `image.jpg` → se convierte a `http://localhost:8080/uploads/image.jpg`

---

### **2. Componente PrizesManagementPage**

#### **A. Tabla de Premios (DataTable)**

Se actualizado el template de imagen para mostrar imágenes de 100x100px con vista previa:

```javascript
const imageTemplate = (rowData) => {
  const imageUrl = getImageUrl(rowData.urlFoto);
  return imageUrl ? (
    <div className="flex align-items-center justify-content-center">
      <Image 
        src={imageUrl} 
        alt={rowData.nombre} 
        width="100" 
        height="100"
        preview 
        imageStyle={{ objectFit: 'cover', borderRadius: '4px' }}
      />
    </div>
  ) : (
    <div className="flex align-items-center justify-content-center" style={{ height: '100px' }}>
      <span className="text-muted text-sm">
        <i className="pi pi-image mr-2"></i>
        Sin imagen
      </span>
    </div>
  );
};
```

**Características:**
- ✅ Muestra imagen de 100x100px con bordes redondeados
- ✅ Vista previa al hacer clic (fullscreen)
- ✅ Mensaje amigable si no hay imagen
- ✅ Icono de imagen cuando no hay foto

#### **B. Formulario de Creación/Edición**

Se actualizo la función `openEditDialog` para cargar la imagen correctamente:

```javascript
const openEditDialog = (premio) => {
  setFormData({ ...premio, imagen: null });
  // Construir la URL completa de la imagen si existe
  const imageUrl = getImageUrl(premio.urlFoto);
  setPreviewUrl(imageUrl);
  setEditMode(true);
  setShowDialog(true);
};
```

**Vista previa mejorada:**
```javascript
{previewUrl && (
  <div className="mb-3 p-3 border-1 surface-border border-round" style={{ backgroundColor: '#f8f9fa' }}>
    <div className="flex justify-content-between align-items-center mb-2">
      <span className="text-sm font-semibold">Vista previa:</span>
      <Button
        icon="pi pi-times"
        rounded
        outlined
        severity="danger"
        size="small"
        onClick={handleRemoveImage}
        tooltip="Quitar imagen"
      />
    </div>
    <div className="text-center">
      <Image src={previewUrl} alt="Vista previa" width="250" preview />
      {formData.imagen && (
        <div className="mt-2">
          <small className="text-muted">
            📎 {formData.imagen.name} ({(formData.imagen.size / 1024).toFixed(2)} KB)
          </small>
        </div>
      )}
      {!formData.imagen && formData.urlFoto && (
        <div className="mt-2">
          <small className="text-muted">
            🖼️ Imagen actual del premio
          </small>
        </div>
      )}
    </div>
  </div>
)}
```

**Características:**
- ✅ Vista previa de imagen de 250px con zoom
- ✅ Botón para quitar la imagen
- ✅ Información del archivo seleccionado (nombre y tamaño)
- ✅ Diferencia entre imagen nueva y existente
- ✅ Diseño visual mejorado con fondo gris claro

---

## 🎨 MEJORAS VISUALES

### **Tabla de Premios:**
- ✅ Imágenes de 100x100px con `object-fit: cover`
- ✅ Bordes redondeados para un look más moderno
- ✅ Centrado vertical y horizontal
- ✅ Click para vista previa en pantalla completa
- ✅ Mensaje amigable con icono cuando no hay imagen

### **Formulario:**
- ✅ Vista previa grande de 250px
- ✅ Fondo gris claro para destacar la imagen
- ✅ Información del archivo (nombre y tamaño en KB)
- ✅ Distinción visual entre imagen nueva y existente
- ✅ Botón para quitar imagen fácil de usar

---

## 🔧 CONFIGURACIÓN DEL BACKEND

El backend debe:

1. ✅ Guardar las imágenes en la carpeta `uploads/`
2. ✅ Devolver el campo `urlFoto` en las respuestas
3. ✅ Configurar CORS para permitir el acceso a `/uploads/`
4. ✅ Servir archivos estáticos de la carpeta `uploads/`

**Ejemplo de respuesta del backend:**
```json
{
  "success": true,
  "premio": {
    "id": 1,
    "nombre": "PlayStation 5",
    "descripcion": "Consola de videojuegos",
    "urlFoto": "/uploads/premio_123456.jpg",  // ← Puede ser relativa
    "anio": 2026,
    "enviado": false
  }
}
```

O con URL absoluta:
```json
{
  "success": true,
  "premio": {
    "id": 1,
    "nombre": "PlayStation 5",
    "descripcion": "Consola de videojuegos",
    "urlFoto": "http://localhost:8080/uploads/premio_123456.jpg",  // ← O absoluta
    "anio": 2026,
    "enviado": false
  }
}
```

**Ambos formatos son soportados** gracias a la utilidad `getImageUrl()`.

---

## 📁 ARCHIVOS MODIFICADOS

1. ✅ `src/shared/utils/imageUtils.js` (nuevo)
   - Utilidad para construir URLs de imágenes

2. ✅ `src/features/admin/PrizesManagementPage.jsx`
   - Import de `getImageUrl`
   - Actualizado `imageTemplate` para tabla
   - Actualizado `openEditDialog` para formulario
   - Mejorada visualización de vista previa

---

## 🚀 CÓMO FUNCIONA

### **Flujo de Carga de Imagen:**

1. Usuario sube una imagen en el formulario
2. Frontend envía la imagen como `multipart/form-data`
3. Backend guarda la imagen en `uploads/`
4. Backend devuelve `urlFoto` en la respuesta
5. Frontend construye la URL completa con `getImageUrl()`
6. Imagen se muestra en tabla y formulario

### **Flujo de Visualización:**

1. Frontend recibe `urlFoto` del backend
2. `getImageUrl(urlFoto)` convierte a URL completa si es necesario
3. Componente `<Image>` de PrimeReact muestra la imagen
4. Usuario puede hacer clic para vista previa en pantalla completa

---

## ✅ VALIDACIONES

### **Frontend:**
- ✅ Solo permite JPG, PNG, GIF, WEBP
- ✅ Tamaño máximo 5MB
- ✅ Vista previa antes de subir

### **Backend:**
- ✅ Valida tipo de archivo
- ✅ Valida tamaño máximo
- ✅ Genera nombre único para evitar colisiones
- ✅ Guarda en sistema de archivos

---

## 🐛 TROUBLESHOOTING

### **Las imágenes no se muestran:**

1. Verificar que el backend esté sirviendo archivos estáticos de `/uploads/`
2. Verificar CORS permite acceso a `/uploads/`
3. Verificar que `urlFoto` se esté devolviendo en las respuestas
4. Abrir consola del navegador y revisar errores de red

### **Error 403 al cargar imágenes:**

1. Verificar que el usuario tiene rol ADMIN
2. Verificar que el token está presente en el header Authorization
3. Revisar logs del backend para más detalles

### **Error 404 en imágenes:**

1. Verificar que la carpeta `uploads/` existe en el backend
2. Verificar que el archivo existe en la carpeta
3. Verificar que la URL se está construyendo correctamente (console.log)

---

## 📌 NOTAS IMPORTANTES

- ✅ Las imágenes se almacenan en el **backend**, no en el frontend
- ✅ El frontend solo guarda la **URL** de la imagen
- ✅ La utilidad `getImageUrl()` es **reutilizable** para otros componentes
- ✅ El componente `<Image>` de PrimeReact incluye **vista previa integrada**
- ✅ En modo edición, se muestra la imagen actual del premio
- ✅ En modo creación, solo se muestra si el usuario selecciona un archivo

---

## 🎉 RESULTADO FINAL

✅ **Tabla de Premios:**
- Muestra imágenes miniatura de 100x100px
- Click para vista previa en pantalla completa
- Diseño limpio y profesional

✅ **Formulario de Creación:**
- Vista previa de la imagen seleccionada
- Información del archivo (nombre y tamaño)
- Botón para quitar imagen

✅ **Formulario de Edición:**
- Muestra la imagen actual del premio
- Permite cambiar por una nueva imagen
- Indica si es imagen nueva o existente

---

**Fecha de implementación:** 2026-04-01  
**Versión:** 2.0.0

