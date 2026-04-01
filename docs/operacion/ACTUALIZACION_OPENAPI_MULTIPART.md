# ✅ Actualización OpenAPI - Endpoints de Premios con Multipart/Form-Data

**Fecha:** 1 de Abril, 2026  
**Actualización:** Corrección de la especificación OpenAPI para reflejar el formato real del backend

---

## 📋 RESUMEN

El archivo OpenAPI indicaba incorrectamente que los endpoints `POST /premios` y `PUT /premios/{id}` aceptaban `application/json`, cuando en realidad el backend los implementó con `multipart/form-data` para soportar la carga de imágenes.

---

## 🔄 CAMBIOS REALIZADOS

### **1. POST /premios**

#### **ANTES:**
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/CrearPremioRequest'
      example:
        nombre: "PlayStation 5"
        descripcion: "Consola de videojuegos de última generación"
        urlFoto: "https://example.com/ps5.jpg"
        anio: 2026
```

#### **AHORA:**
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
            description: Año del sorteo al que pertenece el premio
            example: 2026
          nombre:
            type: string
            description: Nombre del premio
            example: "PlayStation 5"
          descripcion:
            type: string
            description: Descripción detallada del premio (opcional)
            example: "Consola de videojuegos de última generación"
          imagen:
            type: string
            format: binary
            description: Archivo de imagen del premio (opcional, JPG/PNG/GIF/WEBP, máx 5MB)
```

---

### **2. PUT /premios/{id}**

#### **ANTES:**
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/ActualizarPremioRequest'
      example:
        nombre: "PlayStation 5 Pro"
        descripcion: "Versión mejorada de la consola"
        urlFoto: "https://example.com/ps5-pro.jpg"
```

#### **AHORA:**
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
            description: Nuevo nombre del premio (opcional)
            example: "PlayStation 5 Pro"
          descripcion:
            type: string
            description: Nueva descripción del premio (opcional)
            example: "Versión mejorada de la consola"
          imagen:
            type: string
            format: binary
            description: Nueva imagen del premio (opcional, JPG/PNG/GIF/WEBP, máx 5MB)
```

---

## 🎯 JUSTIFICACIÓN

### **Razón del cambio:**
El backend (`PremioController.java`) implementa estos endpoints con `@RequestParam` y acepta `MultipartFile` para las imágenes:

```java
@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Map<String, Object>> crear(
    @RequestParam Integer anio,
    @RequestParam String nombre,
    @RequestParam(required = false) String descripcion,
    @RequestParam(required = false) MultipartFile imagen) {
    // ...
}

@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Map<String, Object>> actualizar(
    @PathVariable Long id,
    @RequestParam(required = false) String nombre,
    @RequestParam(required = false) String descripcion,
    @RequestParam(required = false) MultipartFile imagen) {
    // ...
}
```

### **Beneficios:**
1. ✅ La especificación OpenAPI ahora coincide con la implementación real del backend
2. ✅ Se documenta correctamente el soporte de carga de imágenes
3. ✅ Se especifican los formatos de archivo aceptados y tamaños máximos
4. ✅ Los desarrolladores frontend tienen la información correcta desde el inicio

---

## 📝 NOTAS IMPORTANTES

1. **Campo `urlFoto` eliminado del request:**
   - Ya no se envía `urlFoto` en la petición
   - El backend genera automáticamente la URL después de guardar la imagen
   - El campo `urlFoto` solo aparece en las respuestas (cuando hay imagen)

2. **Campo `anio` requerido solo en creación:**
   - En `POST /premios`: El campo `anio` es **obligatorio**
   - En `PUT /premios/{id}`: El campo `anio` **no se puede cambiar** (no se incluye)

3. **Todos los campos son opcionales en actualización:**
   - Solo se actualizan los campos que se incluyan en el FormData
   - Si no se envía `imagen`, se mantiene la existente

4. **Validaciones del backend:**
   - Tipos de archivo permitidos: JPG, JPEG, PNG, GIF, WEBP
   - Tamaño máximo: 5MB
   - El backend retorna error si el archivo no cumple con estas restricciones

---

## 🔗 ARCHIVOS RELACIONADOS

- **Especificación OpenAPI:** `docs/api/openapi.yaml`
- **Cliente API:** `src/shared/api/client.js`
- **Componente UI:** `src/features/admin/PrizesManagementPage.jsx`
- **Documentación de solución:** `docs/operacion/SOLUCION_MULTIPART_FORMDATA.md`

---

## ✅ ESTADO ACTUAL

- ✅ OpenAPI actualizado
- ✅ Cliente API (client.js) ya estaba correcto
- ✅ Componente PrizesManagementPage actualizado con manejo de imágenes
- ✅ Validaciones de archivos implementadas en el frontend
- ✅ Vista previa de imágenes funcional

---

## 🚀 PRÓXIMOS PASOS

1. Generar la especificación OpenAPI formateada JSON si se usa para documentación automática
2. Actualizar cualquier cliente externo que pueda estar usando estos endpoints
3. Considerar agregar tests de integración que validen el contrato OpenAPI vs implementación real

---

**Documentado por:** GitHub Copilot  
**Revisado:** 1 de Abril, 2026

