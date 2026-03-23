# Nuevos Flujos del Frontend

Fecha: 21 de marzo de 2026

## 🎯 Resumen de Cambios

Se han rediseñado completamente los flujos del frontend para proporcionar una experiencia más profesional e intuitiva tanto para usuarios públicos como para administradores.

## 🌐 Flujo Público

### Página Principal (HomePage)

**Ruta:** `/`

#### Características:
- **Header Premium** con logo de ASPADIF y gradiente atractivo
- **Décimo/Papeleta Simulado** visual que representa el concurso
- **Buscador Principal** con diseño destacado para verificar números
- **Acceso Administrativo** mediante botón que abre un diálogo de login

#### Elementos visuales:
- Logo ASPADIF con icono de regalo
- Tagline "Lotería Solidaria"
- Décimo mockup con:
  - Header "LOTERÍA ASPADIF" + año actual
  - Display de número (00000)
  - Detalles del sorteo
- Input de búsqueda con icono de ticket
- Botón "Consultar Premio" prominente

#### Flujo de usuario:
1. Usuario ve la página principal con décimo visual
2. Introduce su número en el buscador
3. Al hacer clic en "Consultar Premio":
   - Si tiene premio → Navega a `/verificar/{numero}` con resultado
   - Si no tiene premio → Mensaje informativo en el sitio

### Página de Resultado (VerifyResultPage)

**Ruta:** `/verificar/:numero`

#### Características:
- Display grande del número consultado
- Tag visual indicando si está premiado o no
- Información completa del premio (si aplica)
- Botón destacado para reclamar premio
- Opción para nueva consulta

#### Flujo SI está premiado:
1. Muestra información del premio con imagen
2. Botón "Reclamar Premio Ahora" → navega a `/reclamar/{numero}`
3. Si ya fue reclamado → Muestra tag de advertencia

#### Flujo NO premiado:
1. Mensaje informativo
2. Botón para consultar otro número → vuelve a `/`

### Página de Reclamación

**Ruta:** `/reclamar/:numero`

Mantiene el flujo existente con formulario de datos personales y subida de comprobante.

## 🔐 Flujo Administrativo

### Acceso (Integrado en HomePage)

**Método:** Diálogo modal en la página principal

#### Características:
- Botón "Acceso Administración" en el header
- Diálogo modal con campos de usuario y contraseña
- Al autenticar correctamente → Redirección a `/admin`

### Dashboard Administrativo

**Ruta:** `/admin`

#### Características:
- **Selector de Año** para visualizar estadísticas por período
- **Estadísticas del año en curso:**
  - Total de premios reclamados
  - Premios pendientes de envío
  - Premios enviados
- Cards visuales con iconos y colores diferenciados

### Mantenimiento de Usuarios

**Ruta:** `/admin/usuarios`

#### Funcionalidades:
- ✅ Listar usuarios administradores
- ✅ Crear nuevo usuario administrador
- ✅ Editar usuarios existentes
- ✅ Eliminar usuarios
- ✅ Ver roles (ADMIN/USER)

#### Características:
- DataTable con paginación y ordenación
- Diálogo modal para crear/editar
- Confirmación antes de eliminar
- Tags para visualizar roles

### Mantenimiento de Premios

**Ruta:** `/admin/premios`

#### Funcionalidades:
- ✅ Listar catálogo de premios
- ✅ Crear nuevo premio
- ✅ Editar premios existentes
- ✅ Eliminar premios
- ✅ Gestionar nombre, descripción y URL de foto

#### Características:
- Vista previa de imágenes en tabla
- Imagen ampliable (preview de PrimeReact)
- Editor de premios con vista previa en tiempo real

### Carga Masiva CSV

**Ruta:** `/admin/cargar-csv`

Mantiene el flujo existente para carga masiva de números premiados desde CSV.

### Emparejamiento Números-Premios

**Ruta:** `/admin/emparejamiento`

#### Funcionalidades:
- ✅ Ver todos los emparejamientos existentes
- ✅ Crear nuevo emparejamiento manual (número → premio)
- ✅ Eliminar emparejamientos (solo si no están reclamados)
- ✅ Ver estado (Pendiente/Reclamado/Enviado)

#### Características:
- Dropdown con premios disponibles
- Filtros y búsqueda
- Protección contra eliminar premios reclamados
- Link rápido a carga masiva CSV

### Mantenimiento de Claves por Año

**Ruta:** `/admin/claves-ano`

#### Funcionalidades:
- ✅ Listar claves/códigos de concurso por año
- ✅ Crear nueva clave para un año
- ✅ Activar/desactivar claves
- ✅ Eliminar claves
- ✅ Ver estado (ACTIVO/INACTIVO)

#### Campos:
- Año del concurso
- Clave del concurso
- Descripción
- Estado activo/inactivo

### Listado de Números y Códigos de Verificación

**Ruta:** `/admin/numeros-codigos`

#### Funcionalidades:
- ✅ Ver todos los números premiados con sus códigos
- ✅ Filtrar por año
- ✅ Búsqueda global (número o código)
- ✅ Copiar código al portapapeles con un clic
- ✅ Exportar a CSV
- ✅ Ver estado de cada número

#### Características:
- Formato monospace para códigos
- Botón de copiar en cada fila
- Exportación con nombre de archivo dinámico
- Filtros múltiples (búsqueda global + año)

### Listas de Premios (Existentes - Mejoradas)

**Rutas:** 
- `/admin/reclamados` - Premios reclamados
- `/admin/pendientes` - Pendientes de envío
- `/admin/enviados` - Ya enviados

Mantienen su funcionalidad actual con mejoras visuales.

## 🎨 Mejoras Visuales Implementadas

### Espaciado Premium:
- ✅ Padding consistente en todos los componentes (1.5rem)
- ✅ Gaps entre elementos (1rem - 1.5rem)
- ✅ Márgenes generosos en secciones

### Componentes:
- ✅ Botones con padding mejorado (0.65rem - 1.2rem)
- ✅ Inputs con altura cómoda (0.75rem padding)
- ✅ Cards con bordes redondeados (14px)
- ✅ Sombras suaves para profundidad

### Colores y Tipografía:
- ✅ Gradientes atractivos en header
- ✅ Colores diferenciados por tipo de acción
- ✅ Tipografía clara y legible
- ✅ Contraste apropiado

### Navegación Admin:
- ✅ Menú horizontal con scroll en móvil
- ✅ 10 opciones de menú claramente identificadas
- ✅ Iconos descriptivos para cada sección
- ✅ Indicador visual de sección activa

## 📱 Responsive

Todos los nuevos componentes son responsive y se adaptan a:
- Desktop (>768px)
- Tablet (768px - 1024px)
- Mobile (<768px)

## 🔄 Flujo de Navegación Completo

```
/ (HomePage)
├── [Usuario ingresa número]
│   ├── /verificar/:numero (VerifyResultPage)
│   │   ├── [Si premiado] → /reclamar/:numero (ClaimPrizePage)
│   │   └── [Si no premiado] → Mensaje + volver a /
│   │
│   └── [Click en "Acceso Administración"]
│       └── [Diálogo de Login]
│           └── [Login exitoso] → /admin (AdminDashboardPage)
│
└── /admin (Panel administrativo con navegación lateral)
    ├── /admin (Dashboard - año en curso)
    ├── /admin/usuarios (Mantenimiento de usuarios)
    ├── /admin/premios (Mantenimiento de premios)
    ├── /admin/cargar-csv (Carga masiva CSV)
    ├── /admin/emparejamiento (Números ↔ Premios)
    ├── /admin/claves-ano (Claves por año)
    ├── /admin/numeros-codigos (Listado + códigos)
    ├── /admin/reclamados (Premios reclamados)
    ├── /admin/pendientes (Pendientes envío)
    └── /admin/enviados (Ya enviados)
```

## 🛠️ Archivos Creados

### Páginas Públicas:
- `src/features/public/HomePage.jsx` - Nueva página principal
- `src/features/public/VerifyResultPage.jsx` - Página de resultado

### Páginas Administrativas:
- `src/features/admin/UsersManagementPage.jsx` - Gestión de usuarios
- `src/features/admin/PrizesManagementPage.jsx` - Gestión de premios
- `src/features/admin/NumberPrizeMatchingPage.jsx` - Emparejamiento
- `src/features/admin/YearKeysManagementPage.jsx` - Claves por año
- `src/features/admin/NumbersVerificationListPage.jsx` - Listado con códigos

## 📝 Archivos Modificados

- `src/app/AppRouter.jsx` - Rutas actualizadas con nuevos componentes
- `src/app/AppLayout.jsx` - Simplificado (sin header duplicado)
- `src/app/AdminLayout.jsx` - Menú expandido con 10 opciones
- `src/features/admin/AdminDashboardPage.jsx` - Selector de año añadido
- `src/App.css` - Estilos premium agregados

## ⚠️ Notas de Implementación

### Endpoints Pendientes en Backend:

Algunas funcionalidades requieren nuevos endpoints en el backend:

1. **Usuarios:**
   - `GET /api/v1/usuarios` - Listar usuarios
   - `PUT /api/v1/usuarios/{id}` - Actualizar usuario
   - `DELETE /api/v1/usuarios/{id}` - Eliminar usuario

2. **Premios:**
   - `GET /premios` - Listar todos los premios
   - `POST /premios` - Crear premio
   - `PUT /premios/{id}` - Actualizar premio
   - `DELETE /premios/{id}` - Eliminar premio

3. **Emparejamiento:**
   - `POST /numeros` - Crear emparejamiento manual
   - `DELETE /numeros/{id}` - Eliminar emparejamiento

4. **Claves por Año:**
   - `GET /concursos` - Listar concursos/claves
   - `POST /concursos` - Crear concurso/clave
   - `PUT /concursos/{id}` - Actualizar concurso
   - `DELETE /concursos/{id}` - Eliminar concurso

5. **Códigos de Verificación:**
   - `GET /numeros/codigos?year={year}` - Listado con códigos

### Datos Mock Temporales:

Los nuevos componentes usan datos de ejemplo mientras se implementan los endpoints. Los componentes muestran mensajes TODO indicando qué endpoints faltan.

## ✅ Testing

Para probar los nuevos flujos:

1. **Página principal:**
   ```
   http://localhost:5173/
   ```

2. **Verificar número:**
   - Introducir número en homepage
   - Ver resultado en página dedicada

3. **Login admin:**
   - Click en "Acceso Administración"
   - Usuario: (según tu backend)
   - Contraseña: (según tu backend)

4. **Navegar por secciones admin:**
   - Todos los menús deben ser accesibles
   - Componentes muestran interfaces funcionales

## 🎨 Personalización

Para personalizar el décimo/papeleta, editar en `HomePage.jsx`:
- Colores del gradiente
- Texto del header
- Número de ejemplo
- Detalles del sorteo

## 📚 Próximos Pasos

1. [ ] Implementar endpoints faltantes en backend
2. [ ] Conectar servicios API con endpoints reales
3. [ ] Implementar subida de imágenes para premios
4. [ ] Agregar validaciones adicionales
5. [ ] Tests E2E de los nuevos flujos

