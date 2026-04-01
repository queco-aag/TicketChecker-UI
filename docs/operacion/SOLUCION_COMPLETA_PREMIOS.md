# ✅ Solución Completa - Creación de Premios con Multipart/Form-Data

**Fecha:** 1 de Abril, 2026  
**Problema Original:** Error 403 al crear premios (el backend esperaba multipart/form-data pero recibía JSON)

---

## 🎯 PROBLEMA IDENTIFICADO

El usuario descubrió que el endpoint `POST /premios` del backend estaba configurado para recibir `multipart/form-data`, pero:

1. ❌ El OpenAPI indicaba que aceptaba `application/json`
2. ❌ El cliente API no construía correctamente el FormData
3. ❌ El componente UI no manejaba la carga de imágenes

---

## ✅ SOLUCIONES APLICADAS

### **1. Actualización del Cliente API** ✅
**Archivo:** `src/shared/api/client.js`

Ya estaba parcialmente correcto, pero se verificó que incluye:

```javascript
crearPremio: (premio) => {
  const formData = new FormData();
  formData.append('anio', premio.anio);
  formData.append('nombre', premio.nombre);
  if (premio.descripcion) {
    formData.append('descripcion', premio.descripcion);
  }
  if (premio.imagen) {
    formData.append('imagen', premio.imagen);
  }
  return api.post('/premios', formData, {
    requiresAuth: true,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
},

actualizarPremio: (id, premio) => {
  const formData = new FormData();
  if (premio.nombre) {
    formData.append('nombre', premio.nombre);
  }
  if (premio.descripcion) {
    formData.append('descripcion', premio.descripcion);
  }
  if (premio.imagen) {
    formData.append('imagen', premio.imagen);
  }
  return api.put(`/premios/${id}`, formData, {
    requiresAuth: true,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
```

---

### **2. Actualización del Componente UI** ✅
**Archivo:** `src/features/admin/PrizesManagementPage.jsx`

Se agregaron las funciones faltantes:

#### **A. Función `handleImageChange`**
- Valida el tipo de archivo (JPG, PNG, GIF, WEBP)
- Valida el tamaño máximo (5MB)
- Crea una vista previa usando FileReader
- Guarda el archivo en el estado `formData.imagen`

```javascript
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validar tipo de archivo
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    toast.current.show({
      severity: 'warn',
      summary: 'Formato no válido',
      detail: 'Solo se permiten imágenes JPG, PNG, GIF o WEBP.',
      life: 3000
    });
    e.target.value = '';
    return;
  }

  // Validar tamaño (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    toast.current.show({
      severity: 'warn',
      summary: 'Archivo muy grande',
      detail: 'El tamaño máximo permitido es 5MB.',
      life: 3000
    });
    e.target.value = '';
    return;
  }

  // Crear vista previa
  const reader = new FileReader();
  reader.onloadend = () => {
    setPreviewUrl(reader.result);
  };
  reader.readAsDataURL(file);

  // Guardar el archivo
  setFormData({ ...formData, imagen: file });
};
```

#### **B. Función `handleRemoveImage`**
- Limpia el archivo de imagen del estado
- Limpia la vista previa
- Resetea el input file del DOM

```javascript
const handleRemoveImage = () => {
  setFormData({ ...formData, imagen: null, urlFoto: '' });
  setPreviewUrl(null);
  const fileInput = document.getElementById('imagen');
  if (fileInput) {
    fileInput.value = '';
  }
};
```

#### **C. Actualización de `openNewDialog` y `openEditDialog`**
- Se aseguran de inicializar correctamente el campo `imagen` como `null`
- Se gestiona correctamente la vista previa al editar

---

### **3. Actualización del OpenAPI** ✅
**Archivo:** `docs/api/openapi.yaml`

Se actualizaron los endpoints:

#### **POST /premios**
```yaml
requestBody:
  required: true
  content:
    multipart/form-data:
      schema:
        type: object
        required:
          - anio
          - nombre
        properties:
          anio:
            type: integer
            example: 2026
          nombre:
            type: string
            example: "PlayStation 5"
          descripcion:
            type: string
            example: "Consola de videojuegos"
          imagen:
            type: string
            format: binary
            description: Archivo de imagen (JPG/PNG/GIF/WEBP, máx 5MB)
```

#### **PUT /premios/{id}**
```yaml
requestBody:
  required: true
  content:
    multipart/form-data:
      schema:
        type: object
        properties:
          nombre:
            type: string
          descripcion:
            type: string
          imagen:
            type: string
            format: binary
```

---

## 📊 ANTES vs DESPUÉS

### **ANTES (Incorrecto):**
```http
POST /api/v1/premios HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJ...

{
  "nombre": "PlayStation 5",
  "descripcion": "Consola de videojuegos",
  "anio": 2026
}
```
**Resultado:** ❌ 403 Forbidden o 415 Unsupported Media Type

---

### **DESPUÉS (Correcto):**
```http
POST /api/v1/premios HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
Authorization: Bearer eyJ...

------WebKitFormBoundary...
Content-Disposition: form-data; name="anio"

2026
------WebKitFormBoundary...
Content-Disposition: form-data; name="nombre"

PlayStation 5
------WebKitFormBoundary...
Content-Disposition: form-data; name="descripcion"

Consola de videojuegos de última generación
------WebKitFormBoundary...
Content-Disposition: form-data; name="imagen"; filename="ps5.jpg"
Content-Type: image/jpeg

[binary data]
------WebKitFormBoundary...--
```
**Resultado:** ✅ 201 Created

---

## 🎉 FUNCIONALIDADES IMPLEMENTADAS

### **En el Frontend:**

1. ✅ **Selección de imagen**
   - Input file con validación de tipo
   - Solo acepta: JPG, JPEG, PNG, GIF, WEBP
   - Tamaño máximo: 5MB

2. ✅ **Vista previa**
   - Se muestra la imagen seleccionada antes de enviar
   - Se muestra el nombre y tamaño del archivo
   - Componente Image de PrimeReact con capacidad de zoom

3. ✅ **Eliminar imagen**
   - Botón para quitar la imagen seleccionada
   - Resetea el input file y la vista previa

4. ✅ **Validaciones**
   - Tipo de archivo incorrecto → Toast de advertencia
   - Tamaño excedido → Toast de advertencia
   - Campos obligatorios → Toast de advertencia

5. ✅ **Envío correcto**
   - FormData construido correctamente
   - Header Content-Type: multipart/form-data
   - Token de autenticación incluido

### **En el Backend:**
(Ya implementado previamente)

1. ✅ Recibe multipart/form-data
2. ✅ Valida el archivo de imagen
3. ✅ Guarda la imagen en el sistema de archivos
4. ✅ Genera la URL de la foto automáticamente
5. ✅ Retorna la URL en la respuesta

---

## 🔍 VERIFICACIONES REALIZADAS

- ✅ No hay errores de compilación en `PrizesManagementPage.jsx`
- ✅ No hay errores en `client.js`
- ✅ Solo una advertencia menor sobre atributo deprecado en DataTable (no crítico)
- ✅ OpenAPI actualizado y documentado
- ✅ Documentación creada para referencia futura

---

## 📁 ARCHIVOS MODIFICADOS

1. ✅ `src/features/admin/PrizesManagementPage.jsx`
   - Agregadas funciones `handleImageChange` y `handleRemoveImage`
   - Actualizadas funciones `openNewDialog` y `openEditDialog`

2. ✅ `docs/api/openapi.yaml`
   - Actualizado `POST /premios` con multipart/form-data
   - Actualizado `PUT /premios/{id}` con multipart/form-data

3. ✅ `docs/operacion/ACTUALIZACION_OPENAPI_MULTIPART.md` (nuevo)
   - Documentación detallada de los cambios

4. ✅ `docs/operacion/SOLUCION_COMPLETA_PREMIOS.md` (este archivo)
   - Resumen completo de toda la solución

---

## 🚀 CÓMO PROBAR

1. **Iniciar el servidor de desarrollo:**
   ```powershell
   npm run dev
   ```

2. **Acceder a la gestión de premios:**
   - Ir a: http://localhost:5173
   - Login con usuario admin
   - Navegar a "Premios"

3. **Crear un premio nuevo:**
   - Click en "Nuevo Premio"
   - Rellenar nombre, descripción, año
   - Seleccionar una imagen (opcional)
   - Verificar la vista previa
   - Click en "Guardar"
   - ✅ Debería crearse correctamente sin error 403

4. **Actualizar un premio:**
   - Click en el botón de editar de un premio existente
   - Modificar datos
   - Cambiar la imagen (opcional)
   - Click en "Guardar"
   - ✅ Debería actualizarse correctamente

---

## ⚠️ NOTAS IMPORTANTES

1. **El campo `urlFoto` ya no se envía en las peticiones**
   - El backend genera automáticamente la URL después de guardar la imagen
   - Solo aparece en las respuestas GET

2. **El campo `anio` es inmutable**
   - Solo se puede establecer al crear el premio
   - No se puede cambiar en la actualización
   - El dropdown está deshabilitado en modo edición

3. **La imagen es siempre opcional**
   - Se puede crear un premio sin imagen
   - Se puede actualizar un premio sin cambiar la imagen
   - Si se envía una nueva imagen, reemplaza la anterior

4. **Validaciones del frontend vs backend**
   - Frontend: valida antes de enviar (mejor UX)
   - Backend: valida también (seguridad)
   - Ambas validaciones deben coincidir

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### **Si sigue dando error 403:**

1. **Verificar autenticación:**
   ```javascript
   // En la consola del navegador:
   localStorage.getItem('auth_token')
   // Debe retornar el token JWT
   ```

2. **Verificar roles del usuario:**
   ```javascript
   // En la consola del navegador:
   JSON.parse(atob(localStorage.getItem('auth_token').split('.')[1]))
   // Debe incluir roles: ["ROLE_ADMIN"] o ["ADMIN"]
   ```

3. **Verificar el Content-Type:**
   - Abrir DevTools → Network
   - Hacer la petición
   - Verificar que el header sea: `Content-Type: multipart/form-data; boundary=...`

4. **Verificar que se envíen los campos requeridos:**
   - `anio` (número, requerido)
   - `nombre` (string, requerido)
   - `descripcion` (string, opcional)
   - `imagen` (file, opcional)

### **Si la imagen no se sube:**

1. Verificar que el archivo cumpla con los requisitos
2. Verificar que el formData incluya el campo `imagen`
3. Verificar los permisos del backend para guardar archivos

---

## ✅ CONCLUSIÓN

El problema del error 403 al crear premios se debió a:
1. Mismatch entre el formato esperado por el backend (multipart/form-data) y el enviado por el frontend (JSON inicialmente)
2. Especificación OpenAPI incorrecta
3. Funciones faltantes en el componente para manejar imágenes

**Todas las correcciones han sido aplicadas y documentadas.** El sistema ahora debería funcionar correctamente.

---

**Documentado por:** GitHub Copilot  
**Fecha:** 1 de Abril, 2026  
**Estado:** ✅ Completado

