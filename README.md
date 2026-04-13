# headhunteraapp

Веб-приложение для учёта откликов на вакансии (MVP): **FastAPI** + **PostgreSQL** + **React (Vite)**. Всё можно запустить локально на Windows / macOS / Linux.

## Что внутри

| Компонент | Путь | Назначение |
|-----------|------|------------|
| API | `backend/` | REST на FastAPI, SQLAlchemy 2 async, Alembic |
| БД | Docker `postgres:16` | Данные откликов |
| UI | `frontend/` | React 19 + TypeScript, прокси `/api` → бэкенд |

Подробное описание потоков и слоёв: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Требования

- **Docker Desktop** (или Docker Engine + Compose) — для PostgreSQL. На Windows **запустите Docker Desktop** до команды `docker compose`; иначе появится ошибка про pipe `dockerDesktopLinuxEngine`.
- **Python 3.11+** и **[uv](https://docs.astral.sh/uv/getting-started/installation/)** — бэкенд  
- **Node.js 20+** и **npm** — фронтенд  

## Быстрый старт (локально)

### 1. Клонировать и перейти в каталог проекта

```bash
cd headhunteraapp
```

### 2. Поднять базу данных

```bash
docker compose up -d
```

Дождитесь статуса `healthy` (обычно несколько секунд). Порт **5432** на localhost.

### 3. Переменные окружения (опционально)

По умолчанию бэкенд подключается к `postgresql://headhunter:headhunter@127.0.0.1:5432/headhunter` (совпадает с `docker-compose.yml`).

При необходимости скопируйте:

```bash
cp .env.example .env
# или только для API:
cp backend/.env.example backend/.env
```

### 4. Бэкенд: зависимости и миграции

```bash
cd backend
uv sync
uv run alembic upgrade head
```

Запуск API (режим разработки с автоперезагрузкой):

```bash
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Проверка: откройте [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) — ожидается JSON `{"status":"ok",...}`.

Документация OpenAPI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 5. Фронтенд

Новый терминал:

```bash
cd frontend
npm install
npm run dev
```

Откройте [http://127.0.0.1:5173](http://127.0.0.1:5173) — форма добавляет отклики, список подгружается с API.

В режиме `npm run dev` запросы к `/api` проксируются на `http://127.0.0.1:8000` (см. `frontend/vite.config.ts`).

## Остановка

- Фронт / бэкенд: `Ctrl+C` в соответствующих терминалах  
- PostgreSQL: `docker compose down` (данные в volume сохраняются)  
- Удалить данные БД: `docker compose down -v`  

## Полезные команды

```bash
# новая миграция после изменения моделей (из каталога backend)
uv run alembic revision --autogenerate -m "describe change"
uv run alembic upgrade head

# прод-сборка фронта
cd frontend && npm run build && npm run preview
```

## SecondBrain

Память проекта для агентов и команды: каталог `secondbrain/` (см. `secondbrain/README.md`).
