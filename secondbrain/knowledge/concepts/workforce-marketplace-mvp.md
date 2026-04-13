---
title: "MVP: двусторонний рынок труда (компании / работники / бригады)"
tags: [product, mvp, marketplace, workforce]
created: 2026-04-13
updated: 2026-04-13
---

# MVP: workforce marketplace

## Продукт

Компании публикуют **объекты и задачи** (`work_objects`), исполнители отправляют **отклики с условиями** (`object_responses`). Есть **профили** трёх типов, **чат** по объекту (`conversations`/`messages`), **отзывы** (`reviews`) с обновлением `rating_avg` в профиле цели.

## Техническая карта

- Бэкенд: `backend/app/` — роутеры `auth`, `profiles`, `work_objects`, `object_responses`, `chat`, `reviews`.
- Миграции: `backend/alembic/versions/002_workforce_marketplace.py` (после `001`).
- Фронтенд: `frontend/src/pages/*`, авторизация в `context/AuthContext.tsx`, HTTP в `api/http.ts`.

## Что сознательно упростили

- Нет загрузки файлов/фото (поля `*_note` под текстовые заметки).
- Нет отдельной модерации и верификации компаний.
- Нет подписок/оплаты (см. product vision в корневом README).

## Связанные страницы

- [[knowledge/concepts/stack-fastapi-react-postgres]]
- [[knowledge/concepts/engineering-roles-and-agent-hats]]
