#!/usr/bin/env bash
# Одна команда: Docker → миграции → API + фронт (Ctrl+C останавливает всё).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo ""
echo "========== headhunteraapp: запуск =========="
echo ""

echo "[1/4] Docker: PostgreSQL..."
docker compose up -d

echo "[2/4] Ожидание готовности БД..."
READY=0
for _ in $(seq 1 45); do
  if docker exec headhunteraapp-db pg_isready -U headhunter -d headhunter >/dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 1
done
if [ "$READY" != "1" ]; then
  echo "Ошибка: PostgreSQL не ответил за 45 с. Проверьте Docker Desktop и контейнер headhunteraapp-db."
  exit 1
fi

echo "[3/4] Миграции Alembic..."
bash "$ROOT/scripts/migrate.sh"

echo "[3/4] Зависимости..."
(cd "$ROOT/backend" && uv sync)
if [ ! -d "$ROOT/frontend/node_modules" ]; then
  (cd "$ROOT/frontend" && npm install)
fi

echo ""
echo "[4/4] Запуск серверов..."
echo ""
echo "  Приложение (сайт):  http://127.0.0.1:5173"
echo "  API (Swagger):      http://127.0.0.1:8000/docs"
echo "  Health:             http://127.0.0.1:8000/health"
echo ""
echo "  Остановка: Ctrl+C"
echo "=========================================="
echo ""

cleanup() {
  echo ""
  echo "Остановка..."
  if [ -n "${API_PID:-}" ] && kill -0 "$API_PID" 2>/dev/null; then kill "$API_PID" 2>/dev/null || true; fi
  if [ -n "${WEB_PID:-}" ] && kill -0 "$WEB_PID" 2>/dev/null; then kill "$WEB_PID" 2>/dev/null || true; fi
}
trap cleanup INT TERM EXIT

(cd "$ROOT/backend" && exec uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000) &
API_PID=$!
(cd "$ROOT/frontend" && exec npm run dev) &
WEB_PID=$!

wait $API_PID $WEB_PID
