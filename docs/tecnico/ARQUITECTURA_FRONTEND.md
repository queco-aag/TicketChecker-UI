# Arquitectura del Frontend v3

## Stack

- React + Vite
- PrimeReact (tema `lara-light-blue`)
- React Router para rutas publicas y admin
- Axios para cliente HTTP

## Estructura

- `src/app`: layouts, router y guardas de autenticacion
- `src/features/public`: verificacion y reclamacion
- `src/features/admin`: login, dashboard y gestion de premios
- `src/shared/api`: cliente API + mapeadores alineados a OpenAPI
- `src/shared/auth`: persistencia de sesion admin en localStorage

## Flujos principales

1. Usuario verifica ticket con `GET /numeros/{numero}/verificar`.
2. Si tiene premio, reclama con `POST /numeros/{numero}/reclamar`.
3. Admin inicia sesion con `POST /auth/login`.
4. Admin gestiona CSV y estados de envio con endpoints `/premios/*`.

## Seguridad

- Las rutas `/admin/*` requieren token local.
- El interceptor envia `Authorization: Bearer <token>` cuando `requiresAuth=true`.
- En `401` se limpia sesion local.

