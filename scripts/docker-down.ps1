$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDir "..")
Set-Location $projectRoot

Write-Host "[UI] Stopping container" -ForegroundColor Cyan

# Try docker compose first, fallback to docker-compose
try {
    & docker compose down
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[UI] Fallback to docker-compose..." -ForegroundColor Yellow
        & docker-compose down
    }
} catch {
    Write-Host "[UI] Fallback to docker-compose..." -ForegroundColor Yellow
    & docker-compose down
}

Write-Host "[UI] Stopped" -ForegroundColor Green

