param(
    [string]$ApiUrl = "http://localhost:8080/api/v1",
    [string]$ApiTimeout = "30000",
    [switch]$NoCache,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Host "Usage: .\scripts\docker-build.ps1 [-ApiUrl <url>] [-ApiTimeout <ms>] [-NoCache]" -ForegroundColor Cyan
    exit 0
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDir "..")
Set-Location $projectRoot

$env:VITE_API_URL = $ApiUrl
$env:VITE_API_TIMEOUT = $ApiTimeout

Write-Host "[UI] Building Docker image with docker compose" -ForegroundColor Cyan
Write-Host "VITE_API_URL=$ApiUrl" -ForegroundColor Yellow
Write-Host "VITE_API_TIMEOUT=$ApiTimeout" -ForegroundColor Yellow

$composeArgs = @("compose", "build")
if ($NoCache) {
    $composeArgs += "--no-cache"
}

# Try docker compose first, fallback to docker-compose
try {
    & docker @composeArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[UI] Fallback to docker-compose..." -ForegroundColor Yellow
        $composeArgs = @("build")
        if ($NoCache) {
            $composeArgs += "--no-cache"
        }
        & docker-compose @composeArgs
    }
} catch {
    Write-Host "[UI] Fallback to docker-compose..." -ForegroundColor Yellow
    $composeArgs = @("build")
    if ($NoCache) {
        $composeArgs += "--no-cache"
    }
    & docker-compose @composeArgs
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "[UI] ERROR: docker compose build failed" -ForegroundColor Red
    exit 1
}

Write-Host "[UI] Build completed" -ForegroundColor Green

