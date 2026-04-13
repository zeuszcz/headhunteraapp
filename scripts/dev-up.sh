#!/usr/bin/env bash
# Git Bash / WSL / Linux: поднять Postgres в Docker и применить миграции.
# Не запускайте ./scripts/dev-up.ps1 из bash — это скрипт PowerShell.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo ">>> docker compose up -d"
docker compose up -d

echo ">>> Ожидание PostgreSQL (6 с)..."
sleep 6

echo ">>> миграции"
bash "$ROOT/scripts/migrate.sh"

echo ">>> Готово."
