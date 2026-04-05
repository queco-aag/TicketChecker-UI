# TicketChecker-UI

Frontend de verificacion y reclamacion de premios para ASPADIF, reescrito con React + PrimeReact y alineado con el contrato OpenAPI del backend.

## Resumen ejecutivo del frontal

- Portal publico para verificar si un numero esta premiado y registrar su reclamacion.
- Panel administrativo con autenticacion para carga masiva de premios, seguimiento de reclamados y control de envios.
- Integracion con API REST v1 con manejo de errores uniforme y mensajes para usuario final.
- Base preparada para evolucionar: documentacion centralizada, arquitectura por features y scripts operativos.

## Resumen tecnico del frontal

- Stack: React (Vite), PrimeReact, PrimeIcons, PrimeFlex, Axios y React Router.
- Arquitectura de codigo: `src/app` (router/layouts), `src/features` (public/admin), `src/shared` (api/auth/mappers).
- Cliente HTTP en `src/shared/api/client.js` con interceptores para token bearer y gestion centralizada de errores.
- Autenticacion admin persistida en `localStorage` con guard de rutas (`RequireAuth`).
- Base URL configurable por entorno (`VITE_API_URL`) y timeout (`VITE_API_TIMEOUT`).

## Arranque rapido

```bash
npm install
npm run dev
```

Variables recomendadas en `.env`:

- `VITE_API_URL=http://localhost:8080/api/v1`
- `VITE_API_TIMEOUT=30000`

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

Tambien disponibles scripts PowerShell en `project-resources/scripts/`.

## Ejecucion con Docker

Este frontend se entrega para ejecutarse como imagen Docker (Nginx + SPA compilada).

Importante: las variables `VITE_*` se aplican en build-time.

```bash
docker compose build \
  --build-arg VITE_API_URL=http://localhost:8080/api/v1 \
  --build-arg VITE_API_TIMEOUT=30000

docker compose up -d
```

URL de acceso esperada: `http://localhost:3000`.

## Documentacion (docs)

Indice principal:

- `docs/README.md`

API:

- `docs/api/README.md` - Índice de documentación de API y especificación OpenAPI
- `docs/api/openapi.yaml` - **Especificación OpenAPI 3.0 del contrato de API** ⭐
- `docs/api/REFERENCIA_ENDPOINTS.md` - **Referencia rápida de endpoints** ⭐
- `docs/api/API_ENDPOINTS.md` - Referencia completa con ejemplos y guía de integración

Migracion:

- `docs/migracion/MIGRACION_Y_VALIDACION.md`

Tecnico:

- `docs/tecnico/ARQUITECTURA_FRONTEND.md` ⭐
- `docs/tecnico/NUEVOS_FLUJOS.md` - Flujos de UI rediseñados
- `docs/tecnico/CAMPOS_MANTENIMIENTOS.md` - Detalle de campos en mantenimientos
- `docs/tecnico/GUIA_PRIMEFLEX.md` - Referencia PrimeFlex
- `docs/tecnico/QUE_ES_VITE.md`
- `docs/tecnico/README_PROJECT_RESOURCES.md`

Operacion y QA:

- `docs/operacion/GETTING_STARTED.md` - Arranque local y Docker
- `docs/operacion/CHANGELOG.md` - Historial de cambios ⭐
- `docs/operacion/ESTADO_ACTUAL_PROYECTO.md` - Estado completo del proyecto
- `docs/operacion/ESTADO_ENDPOINTS_BACKEND.md` - Inventario de endpoints del backend
- `docs/operacion/IMPLEMENTACION_API_COMPLETADA.md` - Detalle técnico de la implementación
- `docs/operacion/GUIA_SINCRONIZACION_OPENAPI.md` - Guía para sincronizar el contrato OpenAPI

## Contrato OpenAPI de referencia

El contrato OpenAPI que define la especificación de la API consumida por este frontend está incluido en el proyecto:

- **Especificación local:** [`docs/api/openapi.yaml`](docs/api/openapi.yaml)
- **Fuente compartida con backend:** `TicketChecker/src/main/resources/openapi.yaml`

La especificación local es una copia sincronizada del contrato del backend.
