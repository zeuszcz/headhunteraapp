---
title: "Стек MVP: FastAPI, React, PostgreSQL"
tags: [architecture, fastapi, react, postgres]
created: 2026-04-13
updated: 2026-04-13
---

# Стек MVP: FastAPI, React, PostgreSQL

## Расположение в репозитории

- **Бэкенд:** `backend/` — FastAPI, SQLAlchemy async (asyncpg), Alembic, префикс API `/api/v1`.
- **Фронтенд:** `frontend/` — React + Vite + TypeScript; в dev прокси `/api` → `http://127.0.0.1:8000`.
- **БД:** `docker-compose.yml` — PostgreSQL 16, volume `headhunter_pgdata`, порт **5432**.

## Домен MVP

Таблица `job_applications`: компания, роль, статус отклика, заметки, даты. CRUD через REST; UI — форма и список.

## Документация

- Запуск: корневой `README.md`.
- Архитектура и диаграмма: `docs/ARCHITECTURE.md`.

## Связанные страницы

- [[knowledge/concepts/engineering-roles-and-agent-hats]]
- [[knowledge/concepts/agent-memory-and-session-notes]]
