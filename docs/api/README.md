# Especificación API - TicketChecker

Esta carpeta contiene la documentación completa de la API consumida por el frontend TicketChecker-UI.

## 📄 Contrato OpenAPI

**Archivo principal:** [`openapi.yaml`](./openapi.yaml)

Este archivo contiene la especificación completa del contrato de API en formato OpenAPI 3.0. Es una copia sincronizada de la especificación del backend para referencia y validación.

### Características del contrato

- **Formato:** OpenAPI 3.0.3
- **Base URL desarrollo:** `http://localhost:8080/api/v1`
- **Autenticación:** Bearer JWT
- **Versión:** 1.0.0

### Categorías de endpoints

1. **Autenticación** (`/auth/*`)
   - Registro de usuarios
   - Login
   - Gestión de administradores

2. **Números** (`/numeros/*`)
   - Verificación de números premiados
   - Reclamación de premios

3. **Premios** (`/premios/*`)
   - Carga masiva CSV
   - Listados (reclamados, pendientes, enviados)
   - Actualización de estado

## 📖 Documentación adicional

- [`REFERENCIA_ENDPOINTS.md`](./REFERENCIA_ENDPOINTS.md) - **⭐ Referencia rápida de endpoints correctos**
- [`API_CONTRATO_OPENAPI.md`](./API_CONTRATO_OPENAPI.md) - Resumen del contrato implementado
- [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) - Referencia completa de endpoints con ejemplos
- [`API_INTEGRATION.md`](./API_INTEGRATION.md) - Guía de integración
- [`API_INTEGRATION_GUIDE.md`](./API_INTEGRATION_GUIDE.md) - Guía detallada de integración

## 🔄 Sincronización con backend

Este archivo debe mantenerse sincronizado con el contrato del backend:

**Fuente:** `TicketChecker/src/main/resources/openapi.yaml`

Si el backend actualiza su especificación, actualizar también esta copia para mantener la documentación consistente.

## 🛠️ Herramientas recomendadas

Para visualizar y trabajar con el archivo OpenAPI:

- **Swagger Editor:** https://editor.swagger.io/
- **Swagger UI:** Para generar documentación interactiva
- **Postman:** Para importar y probar la API
- **VS Code OpenAPI Extension:** Para validación en el editor

## 📝 Uso

El frontend usa esta especificación como contrato de referencia. Los servicios implementados en `src/shared/api/client.js` siguen este contrato.

