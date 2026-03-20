# Contrato API implementado

Base URL por defecto:

- `http://localhost:8080/api/v1`

Variables de entorno:

- `VITE_API_URL`
- `VITE_API_TIMEOUT`

## Endpoints publicos

- `GET /numeros/{numero}/verificar`
- `POST /numeros/{numero}/reclamar`

## Endpoints de autenticacion

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `POST /auth/first-admin`
- `POST /auth/register-admin`

## Endpoints administrativos de premios

- `POST /premios/cargar-csv`
- `GET /premios/reclamados`
- `GET /premios/pendientes`
- `GET /premios/enviados`
- `PUT /premios/{id}/marcar-enviado`

## Notas de mapeo

Los mapeadores se encuentran en `src/shared/api/mappers.js` y normalizan:

- `VerificarNumeroResponse`
- `NumeroPremiado`
- `Premio`

