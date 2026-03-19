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
- `docs/tecnico/FILE_INDEX.md`
- `docs/tecnico/README_PROJECT_RESOURCES.md`

Operacion y QA:

- `docs/operacion/GETTING_STARTED.md`
- `docs/operacion/VERIFICATION_CHECKLIST.md`
- `docs/operacion/CHANGELOG.md`

## Contrato OpenAPI de referencia

El contrato fuente compartido con backend se encuentra en:

- `C:\Workspace\Particular\TicketChecker\src\main\resources\openapi.yaml`
