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

1. **Autenticación** (`/auth/*`) — Login, registro, gestión de administradores
2. **Números** (`/numeros/*`) — Verificación y reclamación de premios
3. **Premios** (`/premios/*`) — CRUD, carga masiva CSV, listados por estado
4. **Usuarios** (`/usuarios/*`) — CRUD y toggle habilitado
5. **Emparejamientos** (`/numeros-premiados/*`) — Asignación número-premio
6. **Claves de sorteo** (`/claves/*`) — CRUD, generación de códigos HMAC, exportación CSV

## 📖 Documentación adicional

- [`REFERENCIA_ENDPOINTS.md`](./REFERENCIA_ENDPOINTS.md) - **⭐ Referencia rápida de endpoints**
- [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) - Referencia completa con ejemplos, interceptores y guía de integración

## 🔄 Sincronización con backend

Este archivo debe mantenerse sincronizado con el contrato del backend:

**Fuente:** `TicketChecker/src/main/resources/openapi.yaml`

Si el backend actualiza su especificación, actualizar también esta copia para mantener la documentación consistente.
Ver [`../operacion/GUIA_SINCRONIZACION_OPENAPI.md`](../operacion/GUIA_SINCRONIZACION_OPENAPI.md) para instrucciones detalladas.

## 🛠️ Herramientas recomendadas

- **Swagger Editor:** https://editor.swagger.io/
- **Postman:** Para importar y probar la API
- **VS Code OpenAPI Extension:** Para validación en el editor

## 📝 Uso

El frontend usa esta especificación como contrato de referencia. Los servicios implementados en `src/shared/api/client.js` siguen este contrato.
