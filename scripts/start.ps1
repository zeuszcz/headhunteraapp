# Одна команда: Docker → миграции → API + фронт.
# Если установлен Git Bash — делегируем start.sh (удобнее один терминал).
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $ScriptDir

$bash = Get-Command bash -ErrorAction SilentlyContinue
if ($bash) {
    bash (Join-Path $ScriptDir "start.sh")
    exit $LASTEXITCODE
}

Write-Host "Git Bash не найден в PATH — запуск без объединённого лога."
Set-Location $root
docker compose up -d
Start-Sleep -Seconds 10
& (Join-Path $ScriptDir "migrate.ps1")
Set-Location (Join-Path $root "backend")
uv sync
Set-Location $root
$fe = Join-Path $root "frontend"
if (-not (Test-Path (Join-Path $fe "node_modules"))) {
    Set-Location $fe
    npm install
    Set-Location $root
}

Write-Host ""
Write-Host "Приложение: http://127.0.0.1:5173"
Write-Host "Swagger:    http://127.0.0.1:8000/docs"
Write-Host "Откроются два окна cmd (API и фронт). Закройте их для остановки."
Write-Host ""

$be = Join-Path $root "backend"
Start-Process cmd -ArgumentList "/k", "cd /d `"$be`" && uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
Start-Process cmd -ArgumentList "/k", "cd /d `"$fe`" && npm run dev"
