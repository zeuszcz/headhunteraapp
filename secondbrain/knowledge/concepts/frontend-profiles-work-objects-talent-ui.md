---
title: "Фронт: полные профили, карточки объектов/исполнителей, редизайн"
tags: [frontend, profiles, work_objects, talent, ui, secondbrain]
created: 2026-04-13
updated: 2026-04-13
---

# Фронт: профили, объекты, каталог и UI-редизайн

Краткая фиксация реализации плана «полные профили, богатые карточки, редизайн» (без дублирования полного diff — ориентир для агентов и людей).

## Профили (форма = API)

- Бэкенд уже отдаёт полный профиль в `GET /api/v1/auth/me` (`profile_payload`); PATCH по ролям принимает все поля из `*ProfileUpdate` в `backend/app/schemas/profiles.py`.
- Фронт: `frontend/src/pages/ProfilePage.tsx` — секции `fieldset.form-section` для **компании / работника / бригады**, все редактируемые поля; типы и парсеры в `frontend/src/types/profiles.ts` (`parseCompanyProfile` / `parseWorkerProfile` / `parseBrigadeProfile`).
- Индикатор заполненности: блок `.profile-completion` (процент по эвристике важных полей).

## Объекты: компания, обложка, расширенная форма

- Миграция `backend/alembic/versions/004_work_object_cover_image.py` — колонка `work_objects.cover_image_url` (URL без файлового хранилища).
- Схема `WorkObjectRead`: `cover_image_url`, `company_name`, `company_city` (последние два из join с `CompanyProfile`, не из ORM).
- Сервис `backend/app/services/work_object_read.py`: `work_object_to_read`, `enrich_many_by_ids`.
- API `backend/app/api/v1/work_objects.py`: лента с `outerjoin` к `CompanyProfile`; ответы create/get/patch/mine — через обогащение.
- Фронт: тип `frontend/src/types/workObject.ts`; карточка ленты `frontend/src/components/FeedObjectCard.tsx` (обложка или плейсхолдер, строка компании); `NewObject.tsx` — поля из `WorkObjectCreate` (сроки, люди/бригады, условия, оплата, срочность, контакт, URL обложки); `ObjectDetail.tsx` — hero-обложка, блок компании, список фактов по объекту.

## Каталог и избранное

- Компоненты `WorkerCard.tsx`, `BrigadeCard.tsx` — полные данные из `WorkerProfileRead` / `BrigadeProfileRead`.
- `CompanyTalent.tsx` и `ShortlistPage.tsx`: парсинг ответов API через `parseWorkerProfile` / `parseBrigadeProfile`; shortlist уже отдаёт полные профили — доработка API не требовалась.

## Редизайн (CSS)

- Шрифт: **Plus Jakarta Sans** (`index.html` + `@import` в `frontend/src/index.css`).
- Токены: `--space-*`, обновлённый фон и акцент, шапка `.app-nav` без тяжёлого градиента; кнопки `.btn--primary` плоские с тенью.
- Новые/уточнённые классы: `.form-section`, `.feed-object-card*`, `.object-detail__*`, `.talent-card*`, `.badge`, минимальная высота кнопок.

## Операции

- После pull: `alembic upgrade head` (или эквивалент), чтобы применить `004` и колонку `cover_image_url`.
- Сборка фронта: `npm run build`, `npm run test:run`.

## Связанные страницы

- [[knowledge/concepts/workforce-marketplace-mvp]]
- [[knowledge/concepts/stack-fastapi-react-postgres]]
- [[knowledge/concepts/agent-memory-and-session-notes]]
