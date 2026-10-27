
$ErrorActionPreference = "Stop"

$Server = "basti@187.127.75.110"
$RemoteStage = "/home/basti/portfolio-upload"
$BuildDir = Join-Path $PSScriptRoot "dist\Portfolio\browser"

Set-Location $PSScriptRoot

Write-Host "Baue Angular..." -ForegroundColor Cyan

npm run build

if ($LASTEXITCODE -ne 0) {
    throw "Angular-Build fehlgeschlagen."
}

if (-not (Test-Path (Join-Path $BuildDir "index.csr.html"))) {
    throw "index.csr.html wurde nicht gefunden."
}

Write-Host "Bereite Upload-Verzeichnis vor..." -ForegroundColor Cyan

ssh $Server "mkdir -p $RemoteStage && find $RemoteStage -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +"

if ($LASTEXITCODE -ne 0) {
    throw "Upload-Verzeichnis konnte nicht vorbereitet werden."
}

Write-Host "Lade Angular-Dateien hoch..." -ForegroundColor Cyan

# Wechselt in den Build-Ordner, damit SCP nur dessen Inhalt kopiert
Push-Location $BuildDir

try {
    scp -r . "${Server}:${RemoteStage}/"
    if ($LASTEXITCODE -ne 0) {
        throw "SCP-Upload fehlgeschlagen."
    }
}
finally {
    Pop-Location
}

Write-Host "Starte Deployment auf VPS..." -ForegroundColor Cyan

ssh -t $Server "bash ~/deploy-portfolio.sh"

if ($LASTEXITCODE -ne 0) {
    throw "Deployment auf VPS fehlgeschlagen."
}

Write-Host "Deployment abgeschlossen!" -ForegroundColor Green
