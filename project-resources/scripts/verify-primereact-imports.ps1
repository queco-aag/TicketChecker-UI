# Verificación Automática de Componentes PrimeReact
# Este script verifica que todos los componentes usados estén importados

$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  VERIFICACION DE COMPONENTES PRIMEREACT" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

$srcPath = "C:\Workspace\Particular\TicketChecker-UI\src\features"
$archivos = Get-ChildItem -Path $srcPath -Include "*.jsx" -Recurse

$componentesPrimeReact = @(
    'Button', 'Card', 'Column', 'ConfirmDialog', 'DataTable', 'Dialog',
    'Divider', 'Dropdown', 'Image', 'InputSwitch', 'InputText', 'InputTextarea',
    'InputNumber', 'Password', 'ProgressSpinner', 'Calendar', 'Tag', 'Toast',
    'FileUpload', 'Message', 'ProgressBar', 'Checkbox', 'RadioButton', 'MultiSelect',
    'Slider', 'Rating', 'ToggleButton', 'SelectButton', 'TreeSelect', 'Chips'
)

$problemasEncontrados = 0
$archivosRevisados = 0

foreach ($archivo in $archivos) {
    $archivosRevisados++
    $contenido = Get-Content $archivo.FullName -Raw
    $nombreArchivo = $archivo.Name

    # Obtener imports
    $imports = [regex]::Matches($contenido, "import\s+{[^}]+}\s+from\s+'primereact/[^']+';") |
               ForEach-Object { $_.Value }

    $componentesImportados = @()
    foreach ($import in $imports) {
        $matches = [regex]::Matches($import, "\b([A-Z][a-zA-Z]+)\b")
        foreach ($match in $matches) {
            if ($match.Value -ne 'primereact') {
                $componentesImportados += $match.Value
            }
        }
    }

    # Buscar componentes usados en JSX
    $componentesUsados = @()
    foreach ($comp in $componentesPrimeReact) {
        if ($contenido -match "<$comp[\s>]") {
            $componentesUsados += $comp
        }
    }

    # Verificar si hay componentes usados pero no importados
    $faltantes = $componentesUsados | Where-Object { $componentesImportados -notcontains $_ }

    if ($faltantes.Count -gt 0) {
        $problemasEncontrados++
        Write-Host "❌ $nombreArchivo" -ForegroundColor Red
        Write-Host "   Componentes faltantes: $($faltantes -join ', ')" -ForegroundColor Yellow
        Write-Host ""
    } else {
        if ($componentesUsados.Count -gt 0) {
            Write-Host "✅ $nombreArchivo" -ForegroundColor Green -NoNewline
            Write-Host " ($($componentesUsados.Count) componentes)" -ForegroundColor Gray
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Archivos revisados: $archivosRevisados" -ForegroundColor Cyan
Write-Host "Problemas encontrados: $problemasEncontrados" -ForegroundColor $(if ($problemasEncontrados -eq 0) { "Green" } else { "Red" })
Write-Host "========================================" -ForegroundColor Cyan

if ($problemasEncontrados -eq 0) {
    Write-Host "`n✅ TODOS LOS COMPONENTES ESTAN CORRECTAMENTE IMPORTADOS`n" -ForegroundColor Green
} else {
    Write-Host "`n❌ SE ENCONTRARON $problemasEncontrados ARCHIVO(S) CON PROBLEMAS`n" -ForegroundColor Red
    exit 1
}

