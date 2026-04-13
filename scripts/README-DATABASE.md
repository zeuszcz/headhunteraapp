# База данных: первый запуск

Приложение ожидает PostgreSQL с базой **`headhunter`**, пользователем **`headhunter`**, паролем **`headhunter`**, хост **`127.0.0.1`**, порт **`5432`** (как в `docker-compose.yml` и `backend/.env.example`).

## Вариант A — Docker (рекомендуется)

1. Запустите **Docker Desktop** (Windows).
2. В корне репозитория:

**PowerShell (окно «Windows PowerShell» или терминал VS Code с профилем PowerShell):**

```powershell
.\scripts\dev-up.ps1
```

**Git Bash / WSL / Linux** — не используйте `.ps1` (bash не понимает PowerShell). Вместо этого:

```bash
bash scripts/dev-up.sh
```

Или вручную: `docker compose up -d`, подождать несколько секунд, затем `bash scripts/migrate.sh` (или `.\scripts\migrate.ps1` только из PowerShell).

## Вариант B — ваш PostgreSQL + DBeaver

1. Убедитесь, что служба PostgreSQL **запущена** (Службы Windows / pgAdmin / установщик).
2. В **DBeaver**: новое подключение к вашему серверу, пользователь с правами суперпользователя (часто `postgres`), база **`postgres`**.
3. Откройте и выполните **[init-local-db.sql](init-local-db.sql)**.
4. Подключитесь к базе **`headhunter`** как `postgres` и выполните **[grant-schema-headhunter.sql](grant-schema-headhunter.sql)** (права на `public`).
5. Скопируйте конфиг (если ещё нет):

```bash
cp backend/.env.example backend/.env
```

6. Примените миграции:

**PowerShell:**

```powershell
.\scripts\migrate.ps1
```

**Git Bash:**

```bash
bash scripts/migrate.sh
```

7. Запуск всего одной командой: **`bash scripts/start.sh`** (см. корневой [README.md](../README.md)).

Или только API: `cd backend && uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`

## Если логин/пароль другие

Отредактируйте `backend/.env`: строки `DATABASE_URL` и `DATABASE_URL_SYNC` (для Alembic нужен синхронный URL с `postgresql://` и `psycopg2`).

## Проверка в DBeaver

После миграций в схеме `public` должны появиться таблицы: `users`, `company_profiles`, `work_objects`, `object_responses`, и др.
