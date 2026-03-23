# Guía de Uso de PrimeFlex

## Introducción

PrimeFlex es una biblioteca CSS de utilidades que ya está integrada en el proyecto. Proporciona clases de utilidad para crear layouts flexibles y responsivos de manera rápida y eficiente.

## Configuración Actual

### Instalación
PrimeFlex ya está instalado en el proyecto (versión 4.0.0) y está importado en `src/main.jsx`:

```javascript
import 'primeflex/primeflex.css'
```

### Tamaño de Fuente
El tamaño de fuente base se ha configurado a **14px** para mejorar la legibilidad y aprovechar mejor el espacio en pantalla.

## Clases de Utilidad Principales

### Flexbox

#### Contenedores Flex
- `.flex` - Activa flexbox
- `.inline-flex` - Flexbox inline
- `.flex-row` - Dirección horizontal (por defecto)
- `.flex-column` - Dirección vertical

#### Alineación
- `.justify-content-start` - Alinear al inicio
- `.justify-content-end` - Alinear al final
- `.justify-content-center` - Centrar horizontalmente
- `.justify-content-between` - Espacio entre elementos
- `.justify-content-around` - Espacio alrededor de elementos
- `.align-items-start` - Alinear arriba
- `.align-items-center` - Centrar verticalmente
- `.align-items-end` - Alinear abajo

#### Envoltura
- `.flex-wrap` - Permitir salto de línea
- `.flex-nowrap` - No permitir salto de línea

### Espaciado

#### Margin
- `.m-0` a `.m-8` - Margin en todos los lados
- `.mt-0` a `.mt-8` - Margin top
- `.mb-0` a `.mb-8` - Margin bottom
- `.ml-0` a `.ml-8` - Margin left
- `.mr-0` a `.mr-8` - Margin right
- `.mx-0` a `.mx-8` - Margin horizontal (left + right)
- `.my-0` a `.my-8` - Margin vertical (top + bottom)

#### Padding
- `.p-0` a `.p-8` - Padding en todos los lados
- `.pt-0` a `.pt-8` - Padding top
- `.pb-0` a `.pb-8` - Padding bottom
- `.pl-0` a `.pl-8` - Padding left
- `.pr-0` a `.pr-8` - Padding right
- `.px-0` a `.px-8` - Padding horizontal
- `.py-0` a `.py-8` - Padding vertical

#### Gap
- `.gap-1` a `.gap-8` - Espacio entre elementos flex

### Ancho y Alto

- `.w-full` - width: 100%
- `.w-auto` - width: auto
- `.h-full` - height: 100%
- `.h-screen` - height: 100vh

### Texto

#### Tamaño
- `.text-xs` - Extra pequeño (0.75rem)
- `.text-sm` - Pequeño (0.875rem)
- `.text-base` - Base (1rem)
- `.text-lg` - Grande (1.125rem)
- `.text-xl` - Extra grande (1.25rem)
- `.text-2xl` - 2X grande (1.5rem)
- `.text-3xl` - 3X grande (1.875rem)

#### Peso
- `.font-light` - Ligero
- `.font-normal` - Normal
- `.font-semibold` - Semi negrita
- `.font-bold` - Negrita

#### Alineación
- `.text-left` - Alinear a la izquierda
- `.text-center` - Centrar
- `.text-right` - Alinear a la derecha

#### Colores
- `.text-primary` - Color primario
- `.text-500` a `.text-900` - Tonos de gris

### Grid

- `.grid` - Activa CSS Grid
- `.col-1` a `.col-12` - Columnas
- `.col` - Columna flexible

### Display

- `.hidden` - Ocultar elemento
- `.block` - Display block
- `.inline` - Display inline
- `.inline-block` - Display inline-block

### Posición

- `.relative` - position: relative
- `.absolute` - position: absolute
- `.fixed` - position: fixed
- `.sticky` - position: sticky

### Bordes

- `.border-1` a `.border-3` - Grosor del borde
- `.border-round` - Bordes redondeados
- `.border-circle` - Borde circular
- `.border-none` - Sin borde

### Sombras

- `.shadow-1` a `.shadow-8` - Diferentes niveles de sombra

## Ejemplos de Uso

### Layout de Página con Header y Botón

```jsx
<div className="p-4">
  <div className="flex justify-content-between align-items-center mb-4">
    <div>
      <h2 className="m-0 mb-2 text-2xl">Título de la Página</h2>
      <p className="m-0 text-600">Descripción de la página</p>
    </div>
    <Button label="Acción" icon="pi pi-plus" />
  </div>
</div>
```

### Formulario Vertical

```jsx
<div className="flex flex-column gap-3">
  <div className="flex flex-column gap-2">
    <label className="font-semibold">Nombre</label>
    <InputText className="w-full" />
  </div>
  
  <div className="flex flex-column gap-2">
    <label className="font-semibold">Email</label>
    <InputText className="w-full" />
  </div>
  
  <div className="flex justify-content-end gap-2">
    <Button label="Cancelar" outlined />
    <Button label="Guardar" />
  </div>
</div>
```

### Grid de Cards

```jsx
<div className="grid">
  <div className="col-12 md:col-6 lg:col-4">
    <Card>Contenido 1</Card>
  </div>
  <div className="col-12 md:col-6 lg:col-4">
    <Card>Contenido 2</Card>
  </div>
  <div className="col-12 md:col-6 lg:col-4">
    <Card>Contenido 3</Card>
  </div>
</div>
```

### Botones con Gap

```jsx
<div className="flex gap-2">
  <Button icon="pi pi-pencil" rounded text />
  <Button icon="pi pi-trash" rounded text severity="danger" />
</div>
```

## Responsive Design

PrimeFlex incluye breakpoints para diseño responsivo:

- `sm:` - Small (≥576px)
- `md:` - Medium (≥768px)
- `lg:` - Large (≥992px)
- `xl:` - Extra Large (≥1200px)

Ejemplo:
```jsx
<div className="col-12 md:col-6 lg:col-4">
  {/* 12 columnas en móvil, 6 en tablet, 4 en desktop */}
</div>
```

## Buenas Prácticas

1. **Usa clases de utilidad en lugar de CSS personalizado** cuando sea posible
2. **Combina clases** para crear layouts complejos
3. **Piensa en mobile-first**: diseña primero para móviles y luego usa breakpoints
4. **Usa gap** en lugar de margins para espaciar elementos flex
5. **Evita estilos inline** cuando puedas usar clases de PrimeFlex

## Recursos

- [Documentación oficial de PrimeFlex](https://primeflex.org/)
- [Cheat Sheet de Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Documentación de PrimeReact](https://primereact.org/)

## Cambios Aplicados

### Tamaños de Fuente Reducidos

- **Body**: 14px (anteriormente sin especificar)
- **Títulos de Card**: 1.15rem (anteriormente 1.3rem)
- **Títulos de Página**: 1.35rem (anteriormente 1.5rem)
- **Números de Estadísticas**: 1.7rem (anteriormente 1.9rem)
- **Iconos de Navegación**: 0.9rem (anteriormente 0.95rem)

### Archivos Modificados

1. **src/main.jsx**: Importación de PrimeFlex CSS
2. **src/index.css**: Tamaño de fuente base a 14px
3. **src/App.css**: Ajustes de tamaños de fuente en varios componentes
4. **src/features/admin/YearKeysManagementPage.jsx**: Migrado a clases de PrimeFlex

## Migración de Componentes Existentes

Para migrar componentes que usan CSS personalizado a PrimeFlex:

### Antes (CSS personalizado)
```jsx
<div className="page-header">
  <div>
    <h2>Título</h2>
    <p>Descripción</p>
  </div>
  <Button label="Acción" />
</div>
```

```css
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
```

### Después (PrimeFlex)
```jsx
<div className="flex justify-content-between align-items-start gap-4 mb-4">
  <div>
    <h2 className="m-0 mb-2">Título</h2>
    <p className="m-0 text-600">Descripción</p>
  </div>
  <Button label="Acción" />
</div>
```

Esto reduce la cantidad de CSS personalizado y hace el código más mantenible y consistente.

