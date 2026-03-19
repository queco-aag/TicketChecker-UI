# Migracion y validacion

## Alcance de la reescritura

- Router y layouts renovados.
- Flujo publico de verificacion/reclamacion renovado.
- Flujo admin (login, dashboard, tablas, carga CSV) renovado.
- Cliente API unificado por OpenAPI.

## Validacion tecnica recomendada

1. `npm install`
2. `npm run lint`
3. `npm run build`

## Smoke test manual

1. Verificar ticket valido e invalido.
2. Reclamar ticket premiado.
3. Login admin y acceso a dashboard.
4. Subida CSV y refresco de listados.
5. Marcar premio como enviado en pendientes.

## Riesgos conocidos

- El backend debe exponer `/api/v1` para coincidir con OpenAPI.
- La autenticacion admin depende de que el backend entregue `token` en `/auth/login`.

