# Changelog

Todos los cambios notables del proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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

