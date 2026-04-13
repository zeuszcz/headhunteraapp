# headhunteraapp

Двусторонний рынок труда для строительных и смежных ниш: **компании** публикуют объекты и задачи, **работники** и **бригады** откликаются с условиями (цена, сроки, текст). Есть **профили** сторон, **лента с фильтрами**, **отклики**, **чат** и **отзывы с рейтингом**.

Стек: **FastAPI** + **PostgreSQL** + **React (Vite)** + **JWT** (bcrypt).

Подробное описание сущностей и потоков: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Требования

- **PostgreSQL** — либо через **Docker Desktop** (`docker compose`), либо **установленный на ПК** сервер (удобно настраивать через **DBeaver**).
- **Python 3.11+** и **[uv](https://docs.astral.sh/uv/getting-started/installation/)**
- **Node.js 20+** и **npm**

Полная инструкция по созданию БД и миграциям: **[scripts/README-DATABASE.md](scripts/README-DATABASE.md)**.

## Запуск всего одной командой

**Git Bash** (из корня репозитория):

```bash
bash scripts/start.sh
```

**PowerShell:**

```powershell
.\scripts\start.ps1
```

Поднимется Docker (Postgres), миграции, затем API и фронт. Откройте в браузере **http://127.0.0.1:5173** — это приложение. Swagger: **http://127.0.0.1:8000/docs**. Остановка: **Ctrl+C** в том же терминале (в Git Bash). Если `start.ps1` открыл два окна cmd — закройте их.

## Быстрый старт (пошагово)

### 1. База данных

**Docker** (запустите Docker Desktop, затем):

PowerShell:

```powershell
.\scripts\dev-up.ps1
```

Git Bash:

```bash
bash scripts/dev-up.sh
```

Или только контейнер и миграции вручную:

```bash
docker compose up -d
```

**Локальный PostgreSQL + DBeaver:** один раз выполните SQL из [scripts/init-local-db.sql](scripts/init-local-db.sql) и [scripts/grant-schema-headhunter.sql](scripts/grant-schema-headhunter.sql), затем:

```powershell
.\scripts\migrate.ps1
```

### 2. Переменные окружения

Скопируйте пример и при необходимости задайте `JWT_SECRET`:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

`JWT_SECRET` в продакшене должен быть длинной случайной строкой.

### 3. Миграции и API

```bash
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Health: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- Swagger: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Миграции: `001` создаёт устаревшую демо-таблицу, `002` переводит схему на полноценный маркетплейс (пользователи, профили, объекты, отклики, чаты, отзывы). На пустой БД применяются обе подряд.

### 4. Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Откройте [http://127.0.0.1:5173](http://127.0.0.1:5173). Запросы к `/api` проксируются на порт `8000`.

## Сценарий проверки MVP

1. Зарегистрируйте **компанию**, заполните **профиль** (раздел «Профиль»), создайте **объект** («Кабинет» → новый объект или `/objects/new`).
2. В другом браузере (или инкогнито) зарегистрируйте **работника** или **бригаду**, заполните профиль.
3. В ленте **Объекты** найдите карточку, откройте её, отправьте **отклик** с условиями; при необходимости нажмите **Написать компании** для чата.
4. Под компанией откройте тот же объект: увидите **отклики**, сможете **принять/отклонить**, открыть **чат с исполнителем**.
5. После контакта можно оставить **отзыв** о компании с карточки объекта (исполнитель).

## Остановка

- `Ctrl+C` в терминалах API и фронта.
- `docker compose down` (данные в volume сохраняются; `docker compose down -v` — удалить БД).

## SecondBrain

Память проекта для команды и агентов: [secondbrain/README.md](secondbrain/README.md).
