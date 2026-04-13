#!/usr/bin/env bash
# Быстрый bootstrap SecondBrain для нового разработчика:
# - проверка uv
# - установка зависимостей secondbrain
# - init workspace
# - smoke-check hooks/scripts
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SB_DIR="$ROOT_DIR/secondbrain"

if [ ! -d "$SB_DIR" ]; then
  echo "Ошибка: каталог secondbrain не найден: $SB_DIR"
  exit 1
fi

if ! command -v uv >/dev/null 2>&1; then
  echo "Ошибка: uv не найден."
  echo "Установите uv: https://docs.astral.sh/uv/getting-started/installation/"
  exit 1
fi

echo "=== SecondBrain setup in: $SB_DIR ==="
cd "$SB_DIR"

echo "1) Установка зависимостей (uv sync)..."
uv sync

echo "2) Инициализация структуры (init_workspace.py)..."
python scripts/init_workspace.py

echo "3) Проверка SDK backend (check_sdk.py)..."
if ! uv run python scripts/check_sdk.py; then
  cat <<'EOF'

[ВНИМАНИЕ] SDK-check не прошёл.
Для Windows обычно нужно:
  1) установить standalone agent CLI:
     powershell -Command "irm 'https://cursor.com/install?win32=true' | iex"
  2) выполнить:
     agent login
Или выставить CURSOR_API_KEY.
EOF
fi

echo "4) Smoke test session-start hook..."
if uv run python hooks/session-start.py >/dev/null; then
  echo "   OK: session-start hook отвечает."
else
  echo "   WARN: session-start hook не прошёл smoke test."
fi

echo ""
echo "=== Готово ==="
echo "Следующие шаги:"
echo "  - Перезапустите Cursor в этом workspace."
echo "  - Напишите 1-2 сообщения агенту."
echo "  - Проверьте secondbrain/daily/$(date +%F).md (должен появиться новый блок Session)."
echo "  - Если пусто: проверьте логи secondbrain/scripts/flush.log и secondbrain/scripts/tmp/*.log"
