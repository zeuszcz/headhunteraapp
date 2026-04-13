# Поднять Postgres в Docker (если Docker Desktop запущен) и применить миграции.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

try {
    docker compose up -d
    Write-Host "Ожидание PostgreSQL..."
    Start-Sleep -Seconds 6
} catch {
    Write-Host "Docker недоступен. Используйте локальный PostgreSQL: см. scripts/README-DATABASE.md"
    exit 1
}

& "$PSScriptRoot\migrate.ps1"
