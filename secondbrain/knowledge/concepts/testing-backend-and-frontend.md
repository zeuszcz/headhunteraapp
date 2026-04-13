---
title: "Testing backend and frontend"
tags: [qa, pytest, vitest, headhunteraapp]
sources:
  - backend/pytest.ini
  - backend/tests/conftest.py
  - frontend/package.json
created: 2026-04-13
updated: 2026-04-13
---

# Testing backend and frontend

## Backend (`backend/`)

- **Команда**: `uv sync --extra dev && uv run pytest -v` (из каталога `backend/`).
- **Что покрыто**:
  - `tests/test_security.py` — bcrypt: хеш/проверка, Unicode, мусорный хеш.
  - `tests/test_health.py` — `GET /health` через `TestClient`.
  - `tests/test_integration_api.py` — помечены `@pytest.mark.integration`: публичный список объектов, регистрация → `GET /auth/me` → логин. Нужны **PostgreSQL** и применённые миграции (таблица `public.users`).
- **Пропуск интеграции без БД**: фикстура `db_available` в `conftest.py` делает `pytest.skip`, если нет соединения или нет схемы. Явно: переменная окружения `SKIP_DB_TESTS=1`.
- **Windows + asyncpg**: после каждого теста с `TestClient` вызывается `await engine.dispose()` (см. `conftest.py`), иначе второй тест может упасть из‑за пула соединений и закрытого event loop.

## Frontend (`frontend/`)

- **Команда**: `npm run test:run` (или `npm run test` в watch-режиме).
- **Стек**: Vitest + Testing Library + jsdom; конфиг в `vite.config.ts` (`test.environment`, `setupFiles`).
- **Что покрыто**: смоук рендера приложения (`App.test.tsx`), разбор ошибок API для строкового и массивного `detail` (`api/http.test.ts`).

## Связанные темы

- Стек и деплой: [[knowledge/concepts/stack-fastapi-react-postgres]].
- Роли QA в процессе: [[knowledge/concepts/engineering-roles-and-agent-hats]].
