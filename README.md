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

Producto:

- `docs/producto/RESUMEN_EJECUTIVO.md`
- `docs/producto/SUMMARY.md`

API:

- `docs/api/README.md` - Índice de documentación de API y especificación OpenAPI
- `docs/api/openapi.yaml` - **Especificación OpenAPI 3.0 del contrato de API**
- `docs/api/REFERENCIA_ENDPOINTS.md` - **Referencia rápida de endpoints correctos** ⭐
- `docs/api/API_CONTRATO_OPENAPI.md`
- `docs/api/API_ENDPOINTS.md`
- `docs/api/API_INTEGRATION.md`
- `docs/api/API_INTEGRATION_GUIDE.md`

Migracion:

- `docs/migracion/MIGRATION_GUIDE.md`
- `docs/migracion/ADAPTACION_API.md`
- `docs/migracion/INTEGRACION_COMPLETADA.md`
- `docs/migracion/MIGRACION_Y_VALIDACION.md`

Tecnico:

- `docs/tecnico/ARQUITECTURA_FRONTEND.md`
- `docs/tecnico/NUEVOS_FLUJOS.md` - Documentación completa de flujos rediseñados
- `docs/tecnico/CAMPOS_MANTENIMIENTOS.md` - Detalle de todos los campos en mantenimientos
- `docs/tecnico/FILE_INDEX.md`
- `docs/tecnico/README_PROJECT_RESOURCES.md`

Operacion y QA:

- `docs/operacion/GETTING_STARTED.md`
- `docs/operacion/VERIFICATION_CHECKLIST.md`
- `docs/operacion/CHANGELOG.md`
- `docs/operacion/CORRECCION_RESPUESTAS_ANIDADAS.md` - **✅ Corrección final - Todas las tablas muestran datos**
- `docs/operacion/CORRECCIONES_OPENAPI_APLICADAS.md` - ⭐ Correcciones aplicadas - Frontend 100% alineado con backend
- `docs/operacion/ANALISIS_OPENAPI_ACTUALIZADO.md` - Análisis del openapi.yaml actualizado
- `docs/operacion/ALERTA_ENDPOINTS_NO_IMPLEMENTADOS.md` - ⚠️ Alerta: 20 endpoints no implementados en backend (OBSOLETO)
- `docs/operacion/INTEGRACION_ENDPOINTS_COMPLETA.md` - Integración completa de endpoints del backend
- `docs/operacion/ESTADO_ENDPOINTS_BACKEND.md` - Estado actual de endpoints implementados
- `docs/operacion/RESUMEN_CORRECCIONES_ENDPOINTS.md` - Resumen de correcciones de endpoints (usuarios, emparejamientos, premios)
- `docs/operacion/CORRECCION_ENDPOINTS.md` - Corrección detallada de endpoints incorrectos
- `docs/operacion/CORRECCION_DATATABLE_ERROR.md` - Corrección del error data.slice is not a function
- `docs/operacion/ANALISIS_DISCREPANCIAS_OPENAPI.md` - Análisis de discrepancias entre client.js y openapi.yaml (OBSOLETO)
- `docs/operacion/GUIA_SINCRONIZACION_OPENAPI.md` - Guía para sincronizar openapi.yaml con el backend
- `docs/operacion/INSTRUCCIONES_VERIFICACION_BACKEND.md` - Checklist para verificar endpoints del backend

## Contrato OpenAPI de referencia

El contrato OpenAPI que define la especificación de la API consumida por este frontend está incluido en el proyecto:

- **Especificación local:** [`docs/api/openapi.yaml`](docs/api/openapi.yaml)
- **Fuente compartida con backend:** `C:\Workspace\Particular\TicketChecker\src\main\resources\openapi.yaml`

La especificación local es una copia sincronizada del contrato del backend.
