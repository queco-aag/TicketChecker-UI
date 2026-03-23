# Campos Completos de Mantenimientos

Fecha: 21 de marzo de 2026

Este documento detalla todos los campos implementados en las pantallas de mantenimiento administrativo.

## 👥 Mantenimiento de Usuarios

### Campos en el Listado (DataTable):

| Campo | Tipo | Descripción | Ordenable | Filtrable |
|-------|------|-------------|-----------|-----------|
| **ID** | Número | Identificador único del usuario | ✅ | ❌ |
| **Usuario** | Texto | Nombre de usuario (login) | ✅ | ✅ |
| **Nombre Completo** | Texto | Nombre y apellidos | ✅ | ✅ |
| **Email** | Email | Correo electrónico | ✅ | ✅ |
| **Teléfono** | Texto | Número de teléfono de contacto | ✅ | ❌ |
| **Cargo** | Texto | Puesto o función en ASPADIF | ✅ | ❌ |
| **Rol** | Tag | ADMIN / USER | ✅ | ❌ |
| **Estado** | Tag | ACTIVO / INACTIVO | ✅ | ❌ |
| **Fecha Creación** | Fecha | Cuándo se creó el usuario | ✅ | ❌ |
| **Último Acceso** | Fecha | Última vez que inició sesión | ✅ | ❌ |
| **Acciones** | Botones | Editar / Eliminar | ❌ | ❌ |

### Campos en el Formulario (Crear/Editar):

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| **Usuario** | Input | Sí (solo crear) | Nombre de usuario único |
| **Rol** | Dropdown | Sí | USER o ADMIN |
| **Nombre Completo** | Input | Sí | Nombre y apellidos |
| **Cargo** | Input | No | Puesto en la organización |
| **Email** | Input (email) | Sí | Correo electrónico único |
| **Teléfono** | Input (tel) | No | Número de contacto |
| **Contraseña** | Password | Sí (solo crear) | Mínimo 8 caracteres |
| **Usuario Activo** | Switch | Sí | Puede acceder al sistema |

### Validaciones:
- Username no editable en modo edición
- Contraseña opcional al editar (mantiene la anterior si se deja vacío)
- Email y username únicos
- Contraseña con feedback de fortaleza al crear

---

## 🎁 Mantenimiento de Premios

### Campos en el Listado (DataTable):

| Campo | Tipo | Descripción | Ordenable | Filtrable |
|-------|------|-------------|-----------|-----------|
| **ID** | Número | Identificador único del premio | ✅ | ❌ |
| **Foto** | Imagen | Vista previa clickeable de la imagen | ❌ | ❌ |
| **Nombre** | Texto | Nombre del premio | ✅ | ✅ |
| **Categoría** | Texto | Tipo de premio (Electrónica, Viajes, etc.) | ✅ | ✅ |
| **Descripción** | Texto | Descripción detallada | ✅ | ❌ |
| **Valor Estimado** | Moneda | Precio aproximado en € | ✅ | ❌ |
| **Stock** | Multi-línea | Stock total, asignados y disponibles | ❌ | ❌ |
| **Acciones** | Botones | Editar / Eliminar | ❌ | ❌ |

### Campos en el Formulario (Crear/Editar):

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| **Nombre del Premio** | Input | Sí | Nombre del premio |
| **Categoría** | Input | No | Tipo (Electrónica, Viajes, Deportes, etc.) |
| **Descripción** | Textarea | Sí | Descripción detallada (max 1000 caracteres) |
| **Valor Estimado** | InputNumber (currency) | No | Precio aproximado en euros |
| **Stock Disponible** | InputNumber (spinners) | No | Cantidad disponible |
| **URL de la Foto** | Input | No | URL de la imagen del premio |

### Características especiales:
- Vista previa de imagen en tiempo real
- Stock con código de colores (verde: >3, amarillo: 1-2, rojo: 0)
- Imagen ampliable en el listado
- Formato de moneda en euros

---

## 🔗 Emparejamiento Números-Premios

### Campos en el Listado (DataTable):

| Campo | Tipo | Descripción | Ordenable | Filtrable |
|-------|------|-------------|-----------|-----------|
| **Número** | Texto | Número de lotería | ✅ | ✅ |
| **Premio Asignado** | Texto | Nombre del premio | ✅ | ✅ |
| **Categoría** | Texto | Categoría del premio | ✅ | ❌ |
| **Año** | Número | Año del concurso | ✅ | ❌ |
| **Fecha Asignación** | Fecha | Cuándo se asignó | ✅ | ❌ |
| **Reclamante** | Texto | Nombre de quien lo reclamó | ✅ | ✅ |
| **Fecha Reclamación** | Fecha | Cuándo se reclamó | ✅ | ❌ |
| **Estado** | Tag | Pendiente/Reclamado/Enviado | ✅ | ❌ |
| **Acciones** | Botones | Eliminar (solo si no reclamado) | ❌ | ❌ |

### Campos en el Formulario (Crear):

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| **Número de Lotería** | Input | Sí | Número a emparejar |
| **Premio** | Dropdown | Sí | Premio a asignar (con filtro) |

### Características especiales:
- Dropdown con búsqueda de premios
- No permite eliminar emparejamientos reclamados
- Muestra información completa del reclamante
- Estados visuales claros con iconos

---

## 🔑 Mantenimiento de Claves por Año

### Campos en el Listado (DataTable):

| Campo | Tipo | Descripción | Ordenable | Filtrable |
|-------|------|-------------|-----------|-----------|
| **Año** | Número | Año del concurso | ✅ | ✅ |
| **Clave** | Texto | Código identificador del concurso | ✅ | ✅ |
| **Descripción** | Texto | Descripción del concurso | ✅ | ❌ |
| **Inicio** | Fecha | Fecha de inicio del concurso | ✅ | ❌ |
| **Fin** | Fecha | Fecha de finalización | ✅ | ❌ |
| **Estadísticas** | Multi-línea | Total, asignados y reclamados con % | ❌ | ❌ |
| **Estado** | Tag | ACTIVO / INACTIVO | ✅ | ❌ |
| **Acciones** | Botones | Activar/Desactivar / Eliminar | ❌ | ❌ |

### Campos en el Formulario (Crear/Editar):

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| **Año** | Input (number) | Sí | Año del concurso (2020-2100) |
| **Clave del Concurso** | Input | Sí | Código único (ej: LOTERIA2026PRIMAVERA) |
| **Descripción** | Textarea | Sí | Descripción del concurso |
| **Fecha de Inicio** | Calendar | No | Inicio del período de validez |
| **Fecha de Fin** | Calendar | No | Fin del período de validez |
| **Concurso Activo** | Switch | Sí | Si está visible para usuarios |

### Características especiales:
- Solo un concurso activo por año
- Estadísticas con porcentajes calculados
- Fechas con selector de calendario
- Advertencia sobre activación única

---

## 📋 Listado de Números y Códigos de Verificación

### Campos en el Listado (DataTable):

| Campo | Tipo | Descripción | Ordenable | Filtrable |
|-------|------|-------------|-----------|-----------|
| **Número** | Texto | Número de lotería | ✅ | ✅ |
| **Código Verificación** | Código + Botón | Código con botón copiar | ✅ | ✅ |
| **Premio** | Texto | Premio asignado | ✅ | ✅ |
| **Categoría** | Texto | Categoría del premio | ✅ | ✅ |
| **Reclamante** | Texto | Quién lo reclamó | ✅ | ✅ |
| **Concurso** | Texto | Clave del concurso | ✅ | ✅ |
| **Año** | Número | Año del concurso | ✅ | ❌ |
| **Fecha Asignación** | Fecha/Hora | Cuándo se asignó | ✅ | ❌ |
| **Estado** | Tag | Pendiente/Reclamado/Enviado | ✅ | ❌ |

### Características especiales:
- Búsqueda global (todos los campos)
- Filtro por año independiente
- Botón copiar código en cada fila
- Exportación a CSV con nombre dinámico
- Códigos en formato monospace
- Scroll horizontal si es necesario

---

## 🎨 Mejoras Visuales Implementadas

### DataTables:
- ✅ **Filtros por fila** activados donde tiene sentido
- ✅ **Columnas congeladas** (frozen) para acciones en tablas anchas
- ✅ **Responsive** con scroll horizontal automático
- ✅ **Paginación** configurada (10/20/50/100 filas)
- ✅ **Ordenación** por defecto inteligente

### Formularios:
- ✅ **Grid responsive** (2 columnas en desktop, 1 en móvil)
- ✅ **Labels descriptivos** con asterisco para obligatorios
- ✅ **Placeholders** útiles en todos los campos
- ✅ **Validaciones visuales** antes de guardar
- ✅ **Feedback** con mensajes Toast

### Tags y Estados:
- ✅ **Código de colores** consistente (success/warning/danger/info)
- ✅ **Iconos** descriptivos en cada tag
- ✅ **Multi-línea** para información compleja (stock, estadísticas)

### Componentes Especiales:
- ✅ **InputNumber** con formato de moneda para precios
- ✅ **InputSwitch** para campos booleanos (activo/inactivo)
- ✅ **Calendar** con selector visual de fechas
- ✅ **Dropdown** con búsqueda para selecciones largas
- ✅ **Image** con preview clickeable

---

## 📊 Estadísticas de Campos

### Por Mantenimiento:

| Mantenimiento | Campos Listado | Campos Formulario | Filtros | Acciones |
|---------------|----------------|-------------------|---------|----------|
| **Usuarios** | 11 | 8 | 3 | 2 |
| **Premios** | 8 | 6 | 3 | 2 |
| **Emparejamiento** | 9 | 2 | 3 | 1 |
| **Claves Año** | 8 | 7 | 2 | 2 |
| **Números/Códigos** | 9 | - | 7 | Copiar + Exportar |

### Total general:
- **45 columnas** en listados
- **23 campos** en formularios
- **18 filtros** activos
- **Responsive** en todos los componentes

---

## 🔄 Flujo de Datos

### Campos Compartidos entre Mantenimientos:

```
Usuario
  └── crea/edita → Premio
                    └── se asigna a → Número (Emparejamiento)
                                        └── pertenece a → Concurso (Clave Año)
                                                            └── aparece en → Listado Códigos
```

### Trazabilidad:
- Cada premio muestra cuántos están asignados
- Cada emparejamiento muestra el reclamante
- Cada concurso muestra estadísticas de uso
- El listado de códigos es la vista maestra de todo

---

## ⚡ Funcionalidades Añadidas

### Usuarios:
- ✅ Gestión de roles (USER/ADMIN)
- ✅ Activar/desactivar usuarios
- ✅ Teléfono y cargo
- ✅ Tracking de último acceso
- ✅ Validación de unicidad

### Premios:
- ✅ Categorización
- ✅ Valor estimado
- ✅ Control de stock
- ✅ Tracking de asignados vs disponibles
- ✅ Vista previa de imagen
- ✅ Indicador visual de disponibilidad

### Emparejamientos:
- ✅ Información del reclamante
- ✅ Fechas de asignación y reclamación
- ✅ Categoría del premio
- ✅ Año del concurso
- ✅ Protección contra eliminar reclamados

### Claves:
- ✅ Período de validez (inicio/fin)
- ✅ Estadísticas completas con porcentajes
- ✅ Control de concurso activo
- ✅ Tracking de uso

### Listado Códigos:
- ✅ Búsqueda global multi-campo
- ✅ Filtro por año
- ✅ Información del concurso
- ✅ Todas las fechas relevantes
- ✅ Exportación a CSV
- ✅ Copiar código con un clic

---

## 📝 Notas de Implementación

### Datos Mock Actuales:
Los componentes usan datos de ejemplo enriquecidos que simulan:
- 3 usuarios con diferentes roles y estados
- 4 premios con categorías y stock variado
- 3 emparejamientos en diferentes estados
- 3 concursos con estadísticas completas
- 5 números con información completa

### Endpoints Backend Requeridos:

Para que los nuevos campos funcionen con datos reales, el backend necesita:

1. **GET /api/v1/usuarios** - Incluir: telefono, cargo, activo, fechaCreacion, ultimoAcceso
2. **GET /premios** - Incluir: categoria, valorEstimado, stock, asignados, disponibles
3. **GET /api/v1/numeros-premiados** - Incluir: fechaAsignacion, nombreReclamante, fechaReclamacion, categoria
4. **GET /concursos** - Incluir: fechaInicio, fechaFin, totalNumeros, numerosAsignados, numerosReclamados
5. **GET /numeros/codigos** - Incluir: concurso, categoria, nombreReclamante, todas las fechas

### Persistencia:
Los campos adicionales deben almacenarse en la base de datos del backend. Algunos son calculados (disponibles, porcentajes) y otros persisten directamente (telefono, cargo, categoria, etc.).

---

## ✅ Beneficios de los Nuevos Campos

### Para Administradores:
- 📊 **Mejor visibilidad** del estado del sistema
- 🔍 **Búsquedas más precisas** con múltiples filtros
- 📈 **Métricas útiles** (porcentajes, disponibilidad)
- 📞 **Información de contacto** directa
- ⏱️ **Trazabilidad temporal** completa

### Para el Sistema:
- 🎯 **Datos estructurados** y normalizados
- 🔄 **Trazabilidad completa** de operaciones
- 📋 **Auditoría** facilitada
- 🚀 **Escalabilidad** preparada
- 💾 **Exportación** de datos lista

---

## 🎯 Próximos Pasos

1. [ ] Implementar endpoints backend con los nuevos campos
2. [ ] Conectar formularios con APIs reales
3. [ ] Añadir validaciones avanzadas en frontend
4. [ ] Implementar actualización de último acceso automática
5. [ ] Añadir filtros avanzados y búsqueda combinada
6. [ ] Implementar reportes descargables

