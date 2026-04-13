#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/backend"
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created backend/.env from .env.example"
fi
echo ">>> uv run alembic upgrade head"
uv run alembic upgrade head
echo ">>> Done."
