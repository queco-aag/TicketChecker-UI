# 🐳 Scripts Docker para TicketChecker-UI

Este documento describe los scripts de compilación y despliegue Docker disponibles en `TicketChecker-UI`.

## Estructura de Scripts

```
scripts/
├── docker-build.ps1          # Compilar imagen (PowerShell)
├── docker-build.bat          # Compilar imagen (CMD)
├── docker-build.sh           # Compilar imagen (Bash/WSL)
├── build-and-run.ps1         # Compilar e iniciar (PowerShell)
├── build-and-run.bat         # Compilar e iniciar (CMD)
├── build-and-run.sh          # Compilar e iniciar (Bash/WSL)
├── docker-up.ps1             # Iniciar contenedor (PowerShell)
├── docker-up.bat             # Iniciar contenedor (CMD)
├── docker-up.sh              # Iniciar contenedor (Bash/WSL)
├── docker-down.ps1           # Detener contenedor (PowerShell)
├── docker-down.bat           # Detener contenedor (CMD)
└── docker-down.sh            # Detener contenedor (Bash/WSL)
```

## Flujo Típico en WSL

### 1️⃣ Compilar la imagen (primera vez)

```bash
cd /mnt/c/Workspace/Particular/Lottery/TicketChecker-UI
./scripts/docker-build.sh
```

### 2️⃣ Iniciar el contenedor

```bash
./scripts/docker-up.sh
```

Accede en: **http://localhost:3000**

### 3️⃣ Ver logs

```bash
docker-compose logs -f
# o
docker-compose logs -f ticketchecker-ui
```

### 4️⃣ Detener

```bash
./scripts/docker-down.sh
```

## Flujo Típico en Windows PowerShell

> ⚠️ Nota: Docker debe estar disponible en PowerShell (requiere Docker Desktop en Windows o WSL integrado).

```powershell
cd C:\Workspace\Particular\Lottery\TicketChecker-UI

# Compilar e iniciar en un paso
.\scripts\build-and-run.ps1

# O paso a paso:
.\scripts\docker-build.ps1
.\scripts\docker-up.ps1
.\scripts\docker-down.ps1
```

## Parámetros Opcionales

### API URL y Timeout

```bash
# WSL - posicional
./scripts/docker-build.sh http://localhost:8090/api/v1 30000
./scripts/build-and-run.sh http://localhost:8090/api/v1 30000
```

```powershell
# PowerShell - named
.\scripts\docker-build.ps1 -ApiUrl "http://localhost:8090/api/v1" -ApiTimeout "30000"
.\scripts\build-and-run.ps1 -ApiUrl "http://localhost:8090/api/v1" -ApiTimeout "30000"
```

### Sin caché (rebuild forzado)

```bash
./scripts/docker-build.sh --no-cache
```

```powershell
.\scripts\docker-build.ps1 -NoCache
```

### Skip build (solo iniciar si ya compiló)

```powershell
.\scripts\build-and-run.ps1 -SkipBuild
```

## Compatibilidad: `docker compose` vs `docker-compose`

Los scripts detectan automáticamente cuál comando está disponible en tu entorno:

- **Modern (Docker ≥ 2.0):** `docker compose` (con espacio)
- **Legacy:** `docker-compose` (con guion)

Si tu entorno tiene `docker-compose`, el script usa ese. Si tiene `docker compose`, lo usa. No requiere configuración manual.

## npm Scripts

También puedes usar npm para ejecutar los scripts:

```bash
npm run docker:build      # Compilar
npm run docker:up         # Iniciar
npm run docker:down       # Detener
npm run docker:run        # Compilar e iniciar
```

## Desde IntelliJ IDEA

### Terminal integrado

Abre la terminal dentro de IntelliJ y ejecuta:

```bash
# Si es WSL
./scripts/docker-build.sh
./scripts/docker-up.sh

# Si es PowerShell
.\scripts\docker-build.ps1
.\scripts\build-and-run.ps1
```

### Run Configuration personalizada

1. Ir a **Run → Edit Configurations...**
2. Crear una nueva configuración **Shell Script**
3. Apuntar a `scripts/docker-build.sh` o `scripts/build-and-run.sh`
4. Asegurar que se ejecute en WSL o PowerShell según sea

### Variables de entorno

Si necesitas variables personalizadas, crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:8090/api/v1
VITE_API_TIMEOUT=30000
```

Los scripts `.ps1` y `.sh` usan valores por defecto si no se pasan parámetros.

## Troubleshooting

### ❌ `docker: unknown command: docker compose`

Tu entorno tiene `docker-compose` (legacy) pero no `docker compose`.

**Solución:** Los scripts detectan esto automáticamente. Asegúrate de que `docker-compose` esté en PATH:

```bash
which docker-compose
docker-compose --version
```

### ❌ `Permission denied` en WSL

Ejecuta el fix de permisos Docker:

```bash
cd /mnt/c/Workspace/Particular/Lottery/TicketChecker
./scripts/fix-docker-wsl-permissions.sh --apply
wsl --shutdown
```

### ❌ TLS certificate error al descargar imagen

Común en WSL con Docker Desktop. Requiere sincronizar certificados. Ver [GUIA-WSL.md](../TicketChecker/docs/GUIA-WSL.md).

### ❌ Puerto 3000 ya en uso

Cambia el puerto en `docker-compose.yml`:

```yaml
services:
  ticketchecker-ui:
    ports:
      - "3001:80"  # Cambiar 3000 a 3001
```

### ❌ `docker-compose version` falla en WSL

Verifica que Docker Desktop esté corriendo en Windows y WSL Integration activo:

1. Abre Docker Desktop en Windows
2. Settings → Resources → WSL Integration
3. Activa tu distro
4. Reinicia Docker

## Variables de Configuración

Dentro del Dockerfile, durante el build se aplican:

- `VITE_API_URL` - URL base del API (default: `http://localhost:8080/api/v1`)
- `VITE_API_TIMEOUT` - Timeout en ms (default: `30000`)

Estos son **build-time** (se aplican al compilar, no en runtime).

## Comparativa: Scripts Locales vs npm

| Escenario | Script Local | npm |
|-----------|-------------|-----|
| **Desarrollo (dev mode)** | `npm run dev` | Recomendado |
| **Build para producción** | `npm run build` | Recomendado |
| **Docker build** | `./scripts/docker-build.sh` | `npm run docker:build` |
| **Docker up** | `./scripts/docker-up.sh` | `npm run docker:up` |
| **Docker down** | `./scripts/docker-down.sh` | `npm run docker:down` |
| **Todo junto** | `./scripts/build-and-run.sh` | `npm run docker:run` |

## Documentación Relacionada

- [README.md](README.md) - Inicio rápido
- [TicketChecker/docs/DOCKER.md](../TicketChecker/docs/DOCKER.md) - Docker con Maven/Jib (backend)
- [TicketChecker/docs/GUIA-WSL.md](../TicketChecker/docs/GUIA-WSL.md) - Troubleshooting WSL

