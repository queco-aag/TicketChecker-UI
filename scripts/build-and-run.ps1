param(
    [string]$ApiUrl = "http://localhost:8080/api/v1",
    [string]$ApiTimeout = "30000",
    [switch]$NoCache,
    [switch]$SkipBuild,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Host "Usage: .\scripts\build-and-run.ps1 [-ApiUrl <url>] [-ApiTimeout <ms>] [-NoCache] [-SkipBuild]" -ForegroundColor Cyan
    exit 0
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDir "..")
Set-Location $projectRoot

if (-not $SkipBuild) {
    $buildScript = Join-Path $scriptDir "docker-build.ps1"
    $buildArgs = @("-ApiUrl", $ApiUrl, "-ApiTimeout", $ApiTimeout)
    if ($NoCache) {
        $buildArgs += "-NoCache"
    }

    & $buildScript @buildArgs
    if ($LASTEXITCODE -ne 0) {
        exit 1
    }
}

Write-Host "[UI] Starting docker compose" -ForegroundColor Cyan

# Try docker compose first, fallback to docker-compose
try {
    & docker compose up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[UI] Fallback to docker-compose..." -ForegroundColor Yellow
        & docker-compose up -d
    }
} catch {
    Write-Host "[UI] Fallback to docker-compose..." -ForegroundColor Yellow
    & docker-compose up -d
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "[UI] Running at http://localhost:3000" -ForegroundColor Green
    Write-Host "[UI] Logs: docker compose logs -f (or docker-compose logs -f)" -ForegroundColor Yellow
    Write-Host "[UI] Stop: docker compose down (or docker-compose down)" -ForegroundColor Yellow
} else {
    Write-Host "[UI] ERROR: docker compose up failed" -ForegroundColor Red
    exit 1
}


