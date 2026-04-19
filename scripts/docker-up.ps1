$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDir "..")
Set-Location $projectRoot

Write-Host "[UI] Starting container with docker compose" -ForegroundColor Cyan

# Try docker compose first, fallback to docker-compose
$composeCmd = "docker"
$composeArgs = @("compose", "up", "-d")

try {
    & $composeCmd @composeArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[UI] Fallback to docker-compose..." -ForegroundColor Yellow
        $composeCmd = "docker-compose"
        & $composeCmd up -d
    }
} catch {
    Write-Host "[UI] Fallback to docker-compose..." -ForegroundColor Yellow
    $composeCmd = "docker-compose"
    & $composeCmd up -d
}

Write-Host "[UI] Running at http://localhost:3000" -ForegroundColor Green
Write-Host "[UI] Logs: $composeCmd logs -f" -ForegroundColor Yellow
Write-Host "[UI] Stop: $composeCmd down" -ForegroundColor Yellow

