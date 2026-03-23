# Correcciones de Espaciado - PrimeFlex y PrimeReact

## Problema Identificado

Después de reducir el tamaño de fuente base a 14px, se detectaron los siguientes problemas:

1. **Iconos en botones muy pegados al texto** - Los iconos no tenían suficiente margen derecho
2. **Cabeceras de tabla mal alineadas** - Faltaba alineamiento vertical y el tamaño de fuente era inconsistente
3. **Botones redondeados desproporcionados** - El padding no era el adecuado para botones icon-only

## Soluciones Aplicadas

### 1. Espaciado de Iconos en Botones

```css
.p-button .p-button-icon {
  font-size: 1rem;
}

.p-button .p-button-icon:not(:only-child) {
  margin-right: 0.5rem;  /* Espacio entre icono y texto */
}

.p-button.p-button-icon-only .p-button-icon {
  margin-right: 0;  /* Sin margen para botones solo-icono */
}
```

### 2. Alineamiento de Tablas

```css
.p-datatable .p-datatable-thead > tr > th {
  padding: 0.875rem 1rem;
  font-weight: 600;
  background: #f9fafb;
  vertical-align: middle;  /* Alineamiento vertical */
  font-size: 0.9rem;       /* Fuente consistente */
}

.p-datatable .p-datatable-tbody > tr > td {
  padding: 0.875rem 1rem;
  vertical-align: middle;  /* Alineamiento vertical */
  font-size: 0.9rem;       /* Fuente consistente */
}
```

### 3. Botones Redondeados (Icon-only)

```css
.p-button.p-button-rounded.p-button-text,
.p-button.p-button-rounded.p-button-outlined {
  padding: 0.65rem;  /* Padding uniforme para forma circular */
}

.p-button.p-button-rounded.p-button-text .p-button-icon,
.p-button.p-button-rounded.p-button-outlined .p-button-icon {
  font-size: 1.1rem;  /* Icono ligeramente más grande */
}
```

### 4. Inputs y Dropdowns Mejorados

```css
.p-inputtext,
.p-inputtextarea,
.p-dropdown {
  padding: 0.75rem 0.875rem;  /* Padding horizontal mayor */
  border-radius: 8px;
  font-size: 0.95rem;         /* Fuente ligeramente mayor que el body */
}

.p-inputnumber-input {
  padding: 0.75rem 0.875rem;
  font-size: 0.95rem;
}
```

### 5. Espaciado en Acciones de Tabla

```css
.table-actions .p-button {
  min-width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.table-actions .p-button-icon {
  margin: 0 !important;  /* Sin margen en iconos de tabla */
}
```

### 6. Tags con Mejor Proporción

```css
.p-tag {
  padding: 0.45rem 0.85rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.p-tag .p-tag-icon {
  font-size: 0.875rem;
  margin-right: 0.35rem;
}
```

## Tamaños de Fuente Ajustados

| Elemento | Tamaño |
|----------|--------|
| Body (base) | 14px |
| Inputs y Dropdowns | 0.95rem (~13.3px) |
| Labels de botones | 0.95rem |
| Celdas de tabla | 0.9rem (~12.6px) |
| Títulos de página (h2) | 1.35rem (~18.9px) |
| Títulos de Card | 1.15rem (~16.1px) |
| Estadísticas (números) | 1.7rem (~23.8px) |
| Tags | 0.875rem (~12.25px) |

## Espaciado de Iconos

| Componente | Tamaño de Icono | Margen |
|------------|-----------------|---------|
| Botón estándar (con texto) | 1rem | 0.5rem derecha |
| Botón solo-icono | 1rem | 0 |
| Botón redondeado | 1.1rem | 0 |
| Iconos de tabla | 1rem | 0 |
| Iconos de navegación admin | 0.95rem | 0.15rem derecha |
| Iconos de stat-card | 1.3rem | N/A (contenedor) |

## Mejoras Adicionales de Alineamiento

### Column Headers con Iconos de Ordenamiento

```css
.p-datatable .p-sortable-column .p-sortable-column-icon {
  margin-left: 0.35rem;
  font-size: 0.85rem;
}

.p-datatable .p-column-header-content {
  display: flex;
  align-items: center;
}
```

### Line Height para Mejor Legibilidad

```css
.p-datatable-tbody > tr > td {
  line-height: 1.5;  /* Mejora legibilidad en celdas */
}

.p-button-icon,
.pi {
  vertical-align: middle;
  line-height: 1;
}
```

## Resultados Esperados

Con estos cambios, deberías ver:

✅ **Iconos en botones con espacio adecuado** - Los iconos ya no están pegados al texto
✅ **Tablas bien alineadas** - Headers y celdas perfectamente alineados verticalmente
✅ **Botones redondeados proporcionados** - Forma circular perfecta en botones icon-only
✅ **Inputs con mejor legibilidad** - Padding horizontal mejorado
✅ **Fuentes consistentes** - Tamaños de fuente coherentes en toda la aplicación
✅ **Mejor jerarquía visual** - Relación clara entre títulos, texto y elementos

## Testing Recomendado

Para verificar que todo funcione correctamente, revisa:

1. **Página de Mantenimientos** - Verifica que los botones de acción en las tablas se vean bien
2. **Formularios en Diálogos** - Asegúrate de que los inputs tengan buen espaciado
3. **Dashboard de Admin** - Revisa que las tarjetas de estadísticas se vean proporcionales
4. **Navegación Admin** - Los enlaces con iconos deben estar bien espaciados
5. **Botones con iconos** - Tanto en headers como en formularios

## Archivos Modificados

- `src/App.css` - Todos los ajustes de espaciado y fuentes
- `src/index.css` - Tamaño de fuente base
- `src/main.jsx` - Importación de PrimeFlex

## Próximos Pasos

Si necesitas ajustar más el espaciado, estos son los valores clave para modificar:

- **Espacio icono-texto en botones**: `.p-button .p-button-icon:not(:only-child) { margin-right: X }` 
- **Padding de celdas**: `.p-datatable-tbody > tr > td { padding: X }`
- **Tamaño de fuente base**: `body { font-size: X }`
- **Padding de inputs**: `.p-inputtext { padding: X }`

¡Los cambios están aplicados y listos para pruebas!

