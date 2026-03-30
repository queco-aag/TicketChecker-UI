# Actualización: Premios Asociados a Año de Sorteo

**Fecha:** 2026-03-27  
**Estado:** ✅ Completado  
**Tipo:** Feature Enhancement

---

## 📋 Resumen

Se ha actualizado el sistema para que los premios ahora estén asociados a un año específico de sorteo. Esta asociación vincula los premios con las claves anuales de verificación HMAC, permitiendo una mejor organización y gestión de premios por temporada.

---

## 🔄 Cambios Implementados

### 1. **Modelo de Datos - Premio**

El objeto `Premio` ahora incluye el campo `anio`:

```typescript
{
  id: number;
  nombre: string;
  descripcion: string;
  urlFoto: string;
  anio: number;        // ⭐ NUEVO CAMPO
  enviado: boolean;
}
```

### 2. **CrearPremioRequest (OpenAPI Schema)**

El esquema de creación/actualización de premios ahora requiere el año:

```json
{
  "nombre": "PlayStation 5",
  "descripcion": "Consola de videojuegos de última generación",
  "urlFoto": "https://example.com/ps5.jpg",
  "anio": 2026
}
```

**Validaciones:**
- `nombre`: Requerido
- `descripcion`: Opcional
- `urlFoto`: Opcional
- `anio`: Requerido (debe existir una clave registrada para ese año)

---

## 🎯 Componentes Actualizados

### **PrizesManagementPage.jsx**

#### Cambios:
1. **Imports nuevos:**
   - `Dropdown` de PrimeReact
   - `clavesAPI` del cliente API

2. **Estados nuevos:**
   - `claves`: Array de años con claves registradas
   - `formData.anio`: Campo año en el formulario (por defecto año actual)

3. **Funcionalidad nueva:**
   - `loadClaves()`: Carga los años disponibles desde el endpoint `/api/v1/claves`
   - Dropdown de selección de año en el diálogo de creación/edición
   - Validación: el año es obligatorio al crear/actualizar un premio
   - El campo año está deshabilitado al editar (no se puede cambiar)

4. **UI actualizada:**
   - Nueva columna "Año" en el DataTable de premios
   - Campo de selección de año en el formulario (primer campo)
   - Mensaje de ayuda: "El premio estará asociado a este año de sorteo"

#### Flujo de creación:
1. Usuario hace clic en "Nuevo Premio"
2. Selecciona el año del sorteo (desplegable con años que tienen claves registradas)
3. Completa nombre, descripción y URL de foto
4. Guarda → El premio queda asociado a ese año

#### Comportamiento especial:
- Si no hay años registrados en "Claves por Año", el dropdown mostrará mensaje:  
  *"No hay años registrados. Vaya a Claves por Año para crear uno."*
- Al editar un premio existente, el campo año está deshabilitado (solo lectura)

---

### **NumberPrizeMatchingPage.jsx**

#### Cambios:
1. **Template actualizado:**
   - `premioTemplate()`: Ahora muestra el año debajo del nombre del premio
   - `premioOptionTemplate()`: Template personalizado para el dropdown que muestra año

2. **UI actualizada:**
   - El dropdown de selección de premio ahora muestra: 
     ```
     PlayStation 5
     Año: 2026
     ```
   - La columna "Año" en el DataTable (ya existente) ahora se poblará correctamente

---

## 📊 Impacto en la Base de Datos

### Migración esperada en Backend:

```sql
ALTER TABLE premio 
ADD COLUMN anio INT NOT NULL;

-- Índice para mejorar consultas por año
CREATE INDEX idx_premio_anio ON premio(anio);

-- Foreign key a la tabla de claves (opcional pero recomendado)
ALTER TABLE premio
ADD CONSTRAINT fk_premio_clave_anio 
FOREIGN KEY (anio) REFERENCES clave_sorteo(anio);
```

---

## 🔗 Relación con Claves de Sorteo

Los premios ahora están vinculados conceptualmente con las claves anuales:

```
Clave Sorteo (Año 2026)
    ↓
Premio 1: PlayStation 5 (2026)
Premio 2: Xbox Series X (2026)
    ↓
Número Premiado: 12345 → Premio 1
```

**Beneficios:**
- ✅ Organización clara de premios por temporada
- ✅ Permite reutilizar nombres de premios en diferentes años
- ✅ Facilita reportes y estadísticas por año
- ✅ Alineación con el sistema de validación HMAC por año

---

## 📡 Endpoints Afectados

### **GET /api/v1/premios**
**Respuesta actualizada:**
```json
[
  {
    "id": 1,
    "nombre": "PlayStation 5",
    "descripcion": "Consola de videojuegos",
    "urlFoto": "https://...",
    "anio": 2026,
    "enviado": false
  }
]
```

### **POST /api/v1/premios**
**Request actualizado:**
```json
{
  "nombre": "PlayStation 5",
  "descripcion": "Consola de videojuegos",
  "urlFoto": "https://...",
  "anio": 2026
}
```

### **PUT /api/v1/premios/{id}**
**Request actualizado:**
```json
{
  "nombre": "PlayStation 5 Pro",
  "descripcion": "Consola mejorada",
  "urlFoto": "https://...",
  "anio": 2026  // No se puede modificar, debe coincidir
}
```

---

## ✅ Checklist de Verificación

- [x] Campo `anio` agregado a `formData` en PrizesManagementPage
- [x] Dropdown de años con datos de `/api/v1/claves`
- [x] Validación de año obligatorio en `handleSave`
- [x] Columna "Año" visible en DataTable de premios
- [x] Campo año deshabilitado al editar (inmutable)
- [x] Template de premio actualizado en NumberPrizeMatchingPage
- [x] Dropdown de premios muestra año en NumberPrizeMatchingPage
- [x] Imports actualizados (`Dropdown`, `clavesAPI`)
- [x] Documentación creada

---

## 🎨 Capturas de Pantalla Esperadas

### Mantenimiento de Premios
```
┌──────────────────────────────────────────────────┐
│ Mantenimiento de Premios        [Nuevo Premio] │
├────┬──────┬─────────────┬────────────────┬──────┤
│ ID │ Año  │ Nombre      │ Descripción    │ Foto │
├────┼──────┼─────────────┼────────────────┼──────┤
│ 1  │ 2026 │ PS5         │ Consola...     │ [🖼] │
│ 2  │ 2026 │ Xbox        │ Consola...     │ [🖼] │
│ 3  │ 2025 │ PS5         │ Consola...     │ [🖼] │
└────┴──────┴─────────────┴────────────────┴──────┘
```

### Formulario Nuevo Premio
```
┌─────────────────────────────────────────┐
│ Nuevo Premio                       [X] │
├─────────────────────────────────────────┤
│ Año del Sorteo *                       │
│ [▼ 2026                            ]   │
│ El premio estará asociado...           │
│                                        │
│ Nombre del Premio *                    │
│ [PlayStation 5                     ]   │
│                                        │
│ Descripción *                          │
│ [Consola de videojuegos...         ]   │
│                                        │
│ URL de la Foto                         │
│ [https://...                       ]   │
│                                        │
│     [Cancelar]  [Guardar]              │
└─────────────────────────────────────────┘
```

---

## 🚀 Próximos Pasos

### Backend
1. Agregar campo `anio` a la entidad `Premio`
2. Actualizar validación: verificar que existe clave para el año
3. Modificar endpoints de creación/actualización
4. Actualizar respuestas para incluir el campo `anio`

### Testing
1. Crear premio asociado a año 2026
2. Verificar que aparece en listado con año correcto
3. Intentar editar premio y verificar que año no cambia
4. Crear emparejamiento y verificar que muestra año del premio
5. Probar creación sin años disponibles (debe mostrar advertencia)

### Documentación
1. Actualizar `openapi.yaml` con el nuevo campo
2. Actualizar `API_ENDPOINTS.md`
3. Actualizar ejemplos en README

---

## 📝 Notas Importantes

⚠️ **Migración de datos existentes:**
- Los premios creados antes de esta actualización deberán tener un año asignado
- Backend debe manejar migración: asignar año actual o año por defecto
- Considerar script de migración si hay datos en producción

⚠️ **Dependencia de Claves:**
- Un premio solo puede crearse si existe una clave para ese año
- Flujo recomendado: 
  1. Crear clave anual en "Claves por Año"
  2. Crear premios asociados a ese año
  3. Generar códigos de verificación
  4. Asociar números a premios

---

## 🔧 Configuración Recomendada

### Valores por defecto
- Año actual (`new Date().getFullYear()`)
- Si no hay claves, mostrar mensaje guía al usuario

### Validaciones Frontend
- ✅ Año es obligatorio
- ✅ Año debe estar en lista de años disponibles
- ✅ No permitir cambiar año al editar

### Validaciones Backend (esperadas)
- ✅ Año debe existir en tabla `clave_sorteo`
- ✅ Foreign key constraint
- ✅ Año debe estar en rango válido (2000-2100)

---

**Última actualización:** 2026-03-27  
**Responsable:** Sistema de Gestión TicketChecker

