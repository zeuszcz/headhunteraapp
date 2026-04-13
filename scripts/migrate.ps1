# Применить миграции Alembic (из корня репозитория или отсюда)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location (Join-Path $root "backend")

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Создан backend/.env из .env.example"
}

Write-Host ">>> uv run alembic upgrade head"
uv run alembic upgrade head
Write-Host ">>> Готово."
