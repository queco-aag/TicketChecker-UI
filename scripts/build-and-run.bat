@echo off
setlocal

set "API_URL=%~1"
if "%API_URL%"=="" set "API_URL=http://localhost:8080/api/v1"

set "API_TIMEOUT=%~2"
if "%API_TIMEOUT%"=="" set "API_TIMEOUT=30000"

powershell -ExecutionPolicy Bypass -File "%~dp0build-and-run.ps1" -ApiUrl "%API_URL%" -ApiTimeout "%API_TIMEOUT%"
exit /b %ERRORLEVEL%

