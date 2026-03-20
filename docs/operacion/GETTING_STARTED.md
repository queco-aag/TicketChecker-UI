# Getting Started
Guia rapida para ejecutar el frontend TicketChecker-UI en local y en Docker.
## Requisitos
- Node.js 20.19+ (solo para desarrollo local)
- Docker y Docker Compose (entorno objetivo de despliegue)
## Variables de entorno
La SPA de Vite se compila en build-time. Por eso `VITE_API_URL` y `VITE_API_TIMEOUT` deben estar definidas al construir la imagen.
Valores recomendados:
- `VITE_API_URL=http://localhost:8080/api/v1`
- `VITE_API_TIMEOUT=30000`
## Desarrollo local
```bash
npm install
npm run dev
```
## Ejecucion con Docker (recomendada para entrega)
```bash
docker compose build \
  --build-arg VITE_API_URL=http://localhost:8080/api/v1 \
  --build-arg VITE_API_TIMEOUT=30000
docker compose up -d
```
UI disponible en `http://localhost:3000`.
## Actualizar URL de API en Docker
Opcion 1: usar `.env` en la raiz del proyecto:
```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_API_TIMEOUT=30000
```
Luego reconstruir:
```bash
docker compose build --no-cache
docker compose up -d
```
## Verificaciones rapidas
```bash
npm run lint
npm run build
```
Si trabajas exclusivamente con Docker, valida con:
```bash
docker compose build
```
## Referencias
- API: `docs/api/API_ENDPOINTS.md`
- Contrato OpenAPI: `docs/api/API_CONTRATO_OPENAPI.md`
- Arquitectura frontend: `docs/tecnico/ARQUITECTURA_FRONTEND.md`
