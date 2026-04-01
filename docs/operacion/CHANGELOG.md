# Changelog

Todos los cambios notables del proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### 🐛 Corregido

#### Corrección CRÍTICA: API Premios Requiere multipart/form-data (2026-03-30)
- **Problema:** Error 403/415 al crear/actualizar premios - Backend esperaba multipart/form-data pero recibía JSON
- **Causa raíz:** Descubierta por el usuario - El `PremioController.java` tiene `@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)`
- **Solución:** Modificado `client.js` para enviar FormData en lugar de JSON
- **Funciones afectadas:**
  - `crearPremio()` - Ahora construye FormData con los campos anio, nombre, descripcion, imagen
  - `actualizarPremio()` - Ahora construye FormData con los campos opcionales
- **Resultado:** Premios se pueden crear y actualizar correctamente (201 Created)
- Ver: `docs/operacion/SOLUCION_MULTIPART_FORMDATA.md`

### ⚡ Cambiado

#### Eliminación del Proxy de Vite - Llamadas Directas al Backend (2026-03-30)
- **Cambio:** Eliminado el proxy de Vite, ahora se hacen llamadas directas al backend
- **Razón:** El proxy estaba causando errores 403 Forbidden
- **Archivos modificados:**
  - `src/shared/api/client.js` - URL absoluta `http://localhost:8080/api/v1`
  - `.env` - `VITE_API_URL=http://localhost:8080/api/v1`
- **Requisito CRÍTICO:** El backend DEBE tener CORS configurado para `http://localhost:5173`
- **Beneficio:** Comunicación más directa y transparente con el backend
- Ver: `CONFIGURACION_CORS_BACKEND.md` y `INSTRUCCIONES_SIN_PROXY.txt`

### 📚 Documentación

#### Actualización OpenAPI: Endpoints CRUD de Premios (2026-03-30)
- **Agregado:** Documentación completa de 5 endpoints CRUD de premios faltantes en `openapi.yaml`
  - `GET /api/v1/premios` - Listar todos los premios
  - `POST /api/v1/premios` - Crear premio individual (JSON, no requiere archivo)
  - `GET /api/v1/premios/{id}` - Obtener premio por ID
  - `PUT /api/v1/premios/{id}` - Actualizar premio
  - `DELETE /api/v1/premios/{id}` - Eliminar premio
- **Agregado:** 3 nuevos schemas: `CrearPremioRequest`, `ActualizarPremioRequest`, `PremioDetallado`
- **Aclaración:** El endpoint `POST /premios` usa `application/json`, NO `multipart/form-data`
- **Resultado:** OpenAPI ahora refleja todos los endpoints implementados en el backend
- Ver: `docs/api/ACTUALIZACION_OPENAPI_PREMIOS.md`

### 🐛 Corregido

#### Corrección Crítica: Token no se guardaba después del Login (2026-03-30)
- **Problema:** El token JWT no se almacenaba en localStorage después del login, causando errores 403 en todas las peticiones autenticadas
- **Causa 1:** Las peticiones se hacían directamente a `localhost:8080` ignorando el proxy de Vite
- **Causa 2:** La estructura de la respuesta del backend no se manejaba correctamente
- **Solución 1:** Forzar uso del proxy con URL relativa `/api/v1` en lugar de URL absoluta
- **Solución 2:** Mejorar el manejo de respuestas del login con validación y logs de debugging
- **Resultado:** Login funcional, token se guarda correctamente, autenticación JWT operativa
- Ver: `SOLUCION_TOKEN_LOGIN.md`

### ✨ Agregado

#### Premios Asociados a Año de Sorteo (2026-03-27)
- **Campo nuevo:** Premios ahora incluyen campo `anio` (año del sorteo)
- **PrizesManagementPage:** Dropdown de selección de año basado en claves registradas
- **NumberPrizeMatchingPage:** Template actualizado para mostrar año del premio
- **Validación:** El año es obligatorio al crear un premio
- **UI:** Nueva columna "Año" en tabla de premios
- Campo año inmutable al editar (no se puede cambiar)
- Integración con sistema de claves anuales
- Ver: `docs/operacion/ACTUALIZACION_PREMIOS_POR_AÑO.md`

### 🐛 Corregido

#### Corrección de Endpoints de API (2026-03-22)
- **Usuarios:** Corregido `/api/v1/users` → `/api/v1/usuarios`
- **Emparejamientos:** Corregido `/api/v1/emparejamientos` → `/api/v1/numeros-premiados`
- **Premios Disponibles:** Corregido `/api/v1/premios/disponibles` → `/api/v1/premios`
- Todos los endpoints ahora están alineados con el contrato OpenAPI del backend
- Ver: `docs/operacion/CORRECCION_ENDPOINTS.md`

#### Corrección de Imports Faltantes (2026-03-22)
- Agregado `numerosAPI` en NumbersVerificationListPage
- Agregados `emparejamientosAPI` y `rewardsAPI` en NumberPrizeMatchingPage
- Agregado `clavesAPI` en YearKeysManagementPage
- Agregado `rewardsAPI` en PrizesManagementPage
- Agregado `useCallback` en NumbersVerificationListPage

#### Protección contra Error DataTable (2026-03-22)
- Todas las funciones de carga validan `Array.isArray(data)` antes de asignar
- En caso de error, se establece array vacío `[]` para evitar `data.slice is not a function`
- 8 páginas con DataTable ahora son resilientes a errores de API
- Ver: `docs/operacion/CORRECCION_DATATABLE_ERROR.md`

### ✨ Agregado

#### Especificación API
- `docs/api/openapi.yaml` - Especificación OpenAPI 3.0 del contrato de API incluida en el proyecto
- `docs/api/README.md` - Índice de documentación de API con guía de uso del archivo OpenAPI

#### Nuevos Flujos y Páginas
- `src/features/public/HomePage.jsx` - Nueva página principal con décimo visual y login integrado
- `src/features/public/VerifyResultPage.jsx` - Página dedicada para mostrar resultados de verificación
- `src/features/admin/UsersManagementPage.jsx` - Gestión completa de usuarios administradores
- `src/features/admin/PrizesManagementPage.jsx` - CRUD completo de premios
- `src/features/admin/NumberPrizeMatchingPage.jsx` - Emparejamiento manual números-premios
- `src/features/admin/YearKeysManagementPage.jsx` - Gestión de claves por año de concurso
- `src/features/admin/NumbersVerificationListPage.jsx` - Listado completo con códigos de verificación

#### Documentación Técnica
- `docs/tecnico/NUEVOS_FLUJOS.md` - Documentación completa de flujos rediseñados
- `docs/tecnico/CAMPOS_MANTENIMIENTOS.md` - Detalle de todos los campos en mantenimientos

#### Funcionalidades Nuevas
- Login administrativo integrado en homepage mediante diálogo modal
- Dashboard con selector de año para estadísticas por período
- Sistema de mantenimiento de usuarios con roles
- CRUD completo de premios con vista previa de imágenes
- Emparejamiento manual de números con premios
- Gestión de claves de concurso por año (activar/desactivar)
- Exportación CSV de números con códigos de verificación
- Copiar código de verificación al portapapeles

#### Campos Adicionales en Mantenimientos

**Usuarios (11 campos en listado, 8 en formulario):**
- Teléfono de contacto
- Cargo en la organización
- Estado activo/inactivo con switch
- Rol seleccionable (USER/ADMIN)
- Fecha de creación
- Último acceso
- Filtros en usuario, nombre y email

**Premios (8 campos en listado, 6 en formulario):**
- Categoría del premio
- Valor estimado con formato de moneda
- Control de stock con spinners
- Tracking de asignados vs disponibles
- Indicador visual de disponibilidad con colores
- Filtros en nombre y categoría

**Emparejamientos (9 campos en listado):**
- Categoría del premio
- Año del concurso
- Fecha de asignación
- Nombre del reclamante
- Fecha de reclamación
- Filtros múltiples (número, premio, reclamante)

**Claves por Año (8 campos en listado, 7 en formulario):**
- Fechas de inicio y fin con Calendar
- Estadísticas completas (total, asignados, reclamados con %)
- Switch para activar/desactivar
- Fecha de creación
- Validación de período

**Listado Números/Códigos (9 campos):**
- Categoría del premio
- Nombre del reclamante
- Clave del concurso
- Fecha de asignación con hora
- Búsqueda global en todos los campos
- Filtro independiente por año

#### Mejoras Visuales Premium
- Décimo/papeleta simulado en homepage con gradientes
- Header con logo ASPADIF y diseño profesional
- Espaciado generoso y consistente (1.5rem)
- Sombras y bordes redondeados profesionales
- Diálogos modales mejorados con grid responsive
- Tags y estados visuales claros con iconos
- Menú administrativo expandido con 10 opciones
- Formularios con grid responsive (2 columnas en desktop)
- Vista previa de imágenes en tiempo real
- Códigos con formato monospace y botón copiar
- Estadísticas con porcentajes calculados
- Columnas congeladas en tablas anchas

### 🔄 Actualizado

#### Documentación
- README principal actualizado con referencia al archivo `openapi.yaml` local
- `docs/api/API_CONTRATO_OPENAPI.md` actualizado con enlace al archivo OpenAPI
- `docs/tecnico/NUEVOS_FLUJOS.md` - Documentación completa de los nuevos flujos
- Documentación de migración actualizada para referenciar el archivo local
- Enlaces a la especificación OpenAPI normalizados en toda la documentación

#### Componentes
- `src/app/AppRouter.jsx` - Actualizado con 7 nuevas rutas administrativas
- `src/app/AppLayout.jsx` - Simplificado para soportar HomePage standalone
- `src/app/AdminLayout.jsx` - Menú expandido de 5 a 10 opciones de navegación
- `src/features/admin/AdminDashboardPage.jsx` - Añadido selector de año

#### Estilos
- `src/App.css` - Nuevos estilos para HomePage, décimo, diálogos y páginas admin
- Espaciado premium en todos los componentes (padding: 1.5rem)
- Mejoras en DataTables y formularios
- Estilos para códigos de verificación con botón de copiar

### 🎨 Diseño

- Página principal completamente rediseñada con enfoque visual
- Décimo/papeleta mockup con gradiente dorado
- Login administrativo mediante diálogo modal (UX mejorada)
- Navegación admin reorganizada por categorías lógicas
- Espaciado y padding profesional en todos los componentes
- Colores y tipografía mejorados

### ⚙️ Infraestructura

- Node.js en WSL actualizado a v20.20.1
- Eliminado warning de compatibilidad de Vite

## [2.0.0] - 2025-12-23

### 🎉 Cambios Importantes

Esta versión representa una adaptación completa del frontend para integrarse con una API REST moderna y estándar.

### ✨ Agregado

#### Nuevos Archivos
- `src/services/apiMappers.js` - Sistema de mapeo de datos entre API y frontend
- `.env.example` - Plantilla de configuración de variables de entorno
- `API_INTEGRATION.md` - Documentación de la estructura de la API
- `docs/API_INTEGRATION_GUIDE.md` - Guía completa de integración con la API
- `docs/README.md` - Índice de documentación
- `MIGRATION_GUIDE.md` - Guía detallada de migración
- `SUMMARY.md` - Resumen ejecutivo de cambios
- `CHANGELOG.md` - Este archivo

#### Nuevos Servicios API
- `ticketsAPI` - Servicios para verificar y reclamar tickets (endpoints públicos)
- `rewardsAPI` - Servicios para gestión de premios (endpoints administrativos)
- `authAPI` - Servicios de autenticación (preparado para futuro)

#### Nuevos Endpoints Soportados
- `GET /api/tickets/{numero}/verify` - Verificar ticket
- `POST /api/tickets/{numero}/claim` - Reclamar premio
- `POST /api/admin/rewards/upload` - Cargar premios CSV
- `GET /api/admin/rewards/claimed` - Obtener premios reclamados
- `GET /api/admin/rewards/pending` - Obtener premios pendientes
- `GET /api/admin/rewards/shipped` - Obtener premios enviados
- `PUT /api/admin/rewards/{id}/ship` - Marcar como enviado
- `GET /api/admin/rewards` - Obtener todos los premios
- `DELETE /api/admin/rewards/{id}` - Eliminar premio

#### Características
- Interceptor de peticiones para agregar token de autenticación automáticamente
- Interceptor de respuestas para manejo centralizado de errores
- Sistema de mapeo flexible que soporta múltiples formatos de API
- Compatibilidad hacia atrás con `numerosAPI` y `premiosAPI`
- Mensajes de error mejorados y más descriptivos
- Redirección automática en caso de token expirado (401)
- Timeout configurable para peticiones HTTP
- Logging mejorado para debugging

### 🔄 Cambiado

#### Servicios API
- URLs de endpoints actualizadas a formato REST estándar en inglés
- Rutas administrativas ahora tienen prefijo `/admin`
- Nombres de servicios: `numerosAPI` → `ticketsAPI`, `premiosAPI` → `rewardsAPI`
- Formato de respuestas mapeado automáticamente al formato del frontend

#### Componentes Actualizados
- `src/components/public/VerificarNumero.jsx` - Usa nuevos servicios y mapeadores
- `src/components/public/ReclamarPremio.jsx` - Usa nuevos servicios
- `src/components/admin/AdminPanel.jsx` - Usa nuevos servicios
- `src/components/admin/CargarPremios.jsx` - Usa mapeadores para respuestas
- `src/components/admin/ListaPremios.jsx` - Usa nuevos servicios y mapeadores
- `src/components/admin/ListaPendientes.jsx` - Usa nuevos servicios y mapeadores
- `src/components/admin/ListaEnviados.jsx` - Usa nuevos servicios y mapeadores

#### Configuración
- `docker-compose.yml` - Agregada variable `VITE_API_TIMEOUT`
- `package.json` - Versión actualizada a 2.0.0, agregados scripts útiles
- `README.md` - Documentación de API actualizada con nuevos endpoints

#### Documentación
- README actualizado con nuevos endpoints y ejemplos de uso
- Documentación de formato CSV mejorada
- Ejemplos de peticiones/respuestas de la API

### 🐛 Corregido

- Manejo de errores mejorado en todas las peticiones API
- Mensajes de error ahora son más descriptivos y legibles
- Manejo de estados de carga en componentes mejorado
- Validación de respuestas de API más robusta

### 🔒 Seguridad

- Preparado para autenticación JWT con tokens
- Interceptor de autenticación para rutas administrativas
- Redirección automática cuando el token expira
- Validación de archivos mejorada (tipo y tamaño)

### 📚 Documentación

- Guía completa de integración con la API
- Guía de migración detallada con ejemplos
- Documentación de arquitectura y mapeadores
- Ejemplos de código para todas las funcionalidades
- Guía de troubleshooting

### ⚠️ Notas de Migración

- **Compatibilidad Total**: El código existente sigue funcionando sin cambios
- Los servicios `numerosAPI` y `premiosAPI` siguen disponibles
- Los componentes pueden migrar gradualmente a los nuevos servicios
- Ver `MIGRATION_GUIDE.md` para detalles completos

### 🔮 Preparado para el Futuro

- Sistema de autenticación JWT listo para implementar
- Estructura lista para agregar tests automatizados
- Arquitectura preparada para integración con React Query
- Hooks personalizados para gestión de estado (futuro)

---

## [1.0.0] - 2025-12-XX

### Versión Inicial

- Interfaz pública para verificar y reclamar premios
- Panel administrativo para gestión de premios
- Carga de premios desde CSV
- Gestión de premios reclamados, pendientes y enviados
- Diseño responsive con PrimeReact
- Docker y Docker Compose para despliegue

---

## Formato del Changelog

### Tipos de cambios
- **Agregado** - Para nuevas funcionalidades
- **Cambiado** - Para cambios en funcionalidades existentes
- **Deprecado** - Para funcionalidades que serán removidas
- **Removido** - Para funcionalidades removidas
- **Corregido** - Para corrección de bugs
- **Seguridad** - Para vulnerabilidades de seguridad

---

**Mantenido por:** Equipo de Desarrollo ASPADIF  
**Última actualización:** 23 de Diciembre, 2025

