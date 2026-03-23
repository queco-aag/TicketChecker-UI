# ✅ Limpieza de Campos Sobrantes en PrizesManagementPage

## 🔍 Problema Identificado

El componente `PrizesManagementPage` tenía campos en el formulario que **NO existen en el modelo de la API**.

### Modelo Real de Premio (según OpenAPI)

Según la especificación `CrearPremioRequest` en el OpenAPI, el modelo `Premio` solo tiene **3 campos**:

```javascript
{
  "nombre": "string",        // REQUIRED
  "descripcion": "string",   // OPTIONAL
  "urlFoto": "string"        // OPTIONAL
}
```

### Campos que Existían en el Formulario

El formulario tenía **6 campos**:

```javascript
{
  nombre: '',           // ✅ Existe en API
  descripcion: '',      // ✅ Existe en API
  urlFoto: '',          // ✅ Existe en API
  categoria: '',        // ❌ NO existe en API
  valorEstimado: 0,     // ❌ NO existe en API
  stock: 0              // ❌ NO existe en API
}
```

## 🗑️ Campos Eliminados

### 1. `categoria` (string)
- **Formulario anterior:** Campo de texto para categoría (ej: "Electrónica")
- **Razón de eliminación:** No existe en el modelo `Premio` de la API
- **Ubicación:** Campo col-12 md:col-4

### 2. `valorEstimado` (number)
- **Formulario anterior:** InputNumber con modo currency (€)
- **Razón de eliminación:** No existe en el modelo `Premio` de la API
- **Ubicación:** Campo col-12 md:col-6

### 3. `stock` (number)
- **Formulario anterior:** InputNumber con botones de incremento/decremento
- **Razón de eliminación:** No existe en el modelo `Premio` de la API
- **Ubicación:** Campo col-12 md:col-6

## ✅ Cambios Realizados

### 1. Estado Inicial Simplificado

**Antes:**
```javascript
const [formData, setFormData] = useState({
  nombre: '',
  descripcion: '',
  urlFoto: '',
  categoria: '',        // ❌ Eliminado
  valorEstimado: 0,     // ❌ Eliminado
  stock: 0              // ❌ Eliminado
});
```

**Después:**
```javascript
const [formData, setFormData] = useState({
  nombre: '',
  descripcion: '',
  urlFoto: ''
});
```

### 2. Función `openNewDialog` Actualizada

**Antes:**
```javascript
const openNewDialog = () => {
  setFormData({
    nombre: '',
    descripcion: '',
    urlFoto: '',
    categoria: '',
    valorEstimado: 0,
    stock: 0
  });
  // ...
};
```

**Después:**
```javascript
const openNewDialog = () => {
  setFormData({
    nombre: '',
    descripcion: '',
    urlFoto: ''
  });
  // ...
};
```

### 3. Imports Optimizados

**Eliminado:**
```javascript
import { InputNumber } from 'primereact/inputnumber'; // ❌ Ya no se usa
```

### 4. Formulario del Dialog Simplificado

**Antes:** (6 campos)
```jsx
<div className="p-fluid grid">
  <div className="field col-12 md:col-8">
    <label>Nombre del Premio *</label>
    <InputText ... />
  </div>
  
  <div className="field col-12 md:col-4">
    <label>Categoría</label>
    <InputText ... />  {/* ❌ Eliminado */}
  </div>
  
  <div className="field col-12">
    <label>Descripción *</label>
    <InputTextarea ... />
  </div>
  
  <div className="field col-12 md:col-6">
    <label>Valor Estimado (€)</label>
    <InputNumber ... />  {/* ❌ Eliminado */}
  </div>
  
  <div className="field col-12 md:col-6">
    <label>Stock Disponible</label>
    <InputNumber ... />  {/* ❌ Eliminado */}
  </div>
  
  <div className="field col-12">
    <label>URL de la Foto</label>
    <InputText ... />
  </div>
</div>
```

**Después:** (3 campos - coincide con la API)
```jsx
<div className="p-fluid grid">
  <div className="field col-12">
    <label>Nombre del Premio *</label>
    <InputText
      id="nombre"
      value={formData.nombre}
      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
      placeholder="Ej: PlayStation 5"
    />
  </div>

  <div className="field col-12">
    <label>Descripción *</label>
    <InputTextarea
      id="descripcion"
      value={formData.descripcion}
      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
      rows={4}
      placeholder="Descripción detallada del premio"
    />
  </div>

  <div className="field col-12">
    <label>URL de la Foto</label>
    <InputText
      id="urlFoto"
      value={formData.urlFoto}
      onChange={(e) => setFormData({ ...formData, urlFoto: e.target.value })}
      placeholder="https://ejemplo.com/imagen.jpg"
    />
    {formData.urlFoto && (
      <div className="mt-3 text-center">
        <Image src={formData.urlFoto} alt="Vista previa" width="200" preview />
      </div>
    )}
  </div>
</div>
```

## 📊 Comparación Visual

### Formulario Anterior (6 campos)
```
┌─────────────────────────────────────────────────┐
│ Nuevo Premio                                     │
├─────────────────────────────────────────────────┤
│ Nombre del Premio *  │ Categoría               │
│ [PlayStation 5......] [Electrónica.............] │
│                                                  │
│ Descripción *                                    │
│ [Consola de videojuegos........................] │
│ [..............................................] │
│                                                  │
│ Valor Estimado (€)   │ Stock Disponible        │
│ [500.00 €...........] [10 ▼▲.................]  │
│                                                  │
│ URL de la Foto                                   │
│ [https://example.com/ps5.jpg..................] │
│                                                  │
│ [Cancelar]                           [Guardar]  │
└─────────────────────────────────────────────────┘
```

### Formulario Nuevo (3 campos)
```
┌─────────────────────────────────────────────────┐
│ Nuevo Premio                                     │
├─────────────────────────────────────────────────┤
│ Nombre del Premio *                              │
│ [PlayStation 5.................................] │
│                                                  │
│ Descripción *                                    │
│ [Consola de videojuegos........................] │
│ [..............................................] │
│                                                  │
│ URL de la Foto                                   │
│ [https://example.com/ps5.jpg..................] │
│ [Vista previa de imagen]                         │
│                                                  │
│ [Cancelar]                           [Guardar]  │
└─────────────────────────────────────────────────┘
```

## 📝 Tabla de Premios (Sin Cambios)

La tabla sigue mostrando correctamente los campos que existen en la API:

| ID | Nombre | Descripción | Foto | Acciones |
|----|--------|-------------|------|----------|
| 1  | PlayStation 5 | Consola... | [img] | ✏️ 🗑️ |

**Nota:** Los campos `categoria`, `valorEstimado` y `stock` nunca se mostraban en la tabla porque no existen en los datos que devuelve la API.

## ✅ Validaciones Actualizadas

```javascript
const handleSave = async () => {
  if (!formData.nombre || !formData.descripcion) {
    toast.current.show({
      severity: 'warn',
      summary: 'Datos incompletos',
      detail: 'Nombre y descripción son obligatorios.',
      life: 3000
    });
    return;
  }
  // ...
};
```

**Campos validados:**
- ✅ `nombre` - Obligatorio (required en API)
- ✅ `descripcion` - Obligatorio en el frontend (opcional en API pero lo requerimos para mejor UX)
- ✅ `urlFoto` - Opcional

## 🎯 Resultado Final

### Campos del Formulario (3)
1. ✅ **Nombre del Premio** * (string) - Obligatorio
2. ✅ **Descripción** * (string) - Obligatorio
3. ✅ **URL de la Foto** (string) - Opcional con vista previa

### Datos Enviados a la API
```javascript
{
  "nombre": "PlayStation 5",
  "descripcion": "Consola de videojuegos de última generación",
  "urlFoto": "https://example.com/ps5.jpg"
}
```

## 📦 Archivos Modificados

```
✅ src/features/admin/PrizesManagementPage.jsx
   - Eliminados campos: categoria, valorEstimado, stock
   - Eliminado import: InputNumber
   - Simplificado formulario
   - Actualizado estado inicial
```

## 🚀 Beneficios

1. **Sincronización con la API** - El formulario ahora coincide exactamente con el modelo de la API
2. **Menos confusión** - No hay campos que se rellenen pero no se guarden
3. **Código más limpio** - Menos estado, menos imports, menos complejidad
4. **Mejor rendimiento** - Formulario más simple y ligero
5. **Mantenibilidad** - Cambios futuros en la API se reflejan correctamente

## ✅ Verificación

Para verificar los cambios:

1. Ir a `/admin/premios`
2. Click en "Nuevo Premio"
3. Verificar que solo aparecen 3 campos:
   - Nombre del Premio
   - Descripción
   - URL de la Foto
4. Llenar el formulario y guardar
5. Verificar que se crea correctamente

---

**Estado:** ✅ Campos sobrantes eliminados
**Fecha:** 2026-03-23
**Componente:** PrizesManagementPage
**Campos eliminados:** categoria, valorEstimado, stock

