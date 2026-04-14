# Build Log

## [2026-04-13] ingest | Initialized SecondBrain for headhunteraapp (empty domain wiki, standard layout).

## [2026-04-13] ingest | Policy: agents must persist meaningful work to SecondBrain first (index + concepts + log) to avoid full-repo rescans; see concepts/agent-memory-and-session-notes.md.

## [2026-04-13] ingest | Added Cursor rule engineering-roles-and-handoffs.mdc + wiki concept engineering-roles-and-agent-hats (RACI-style roles and handoffs).

## [2026-04-13] ingest | MVP stack: backend (FastAPI+Alembic+asyncpg), frontend (React+Vite), Postgres via docker-compose; docs README.md + docs/ARCHITECTURE.md; domain job_applications.

## [2026-04-13] ingest | Workforce marketplace MVP: JWT auth, company/worker/brigade profiles, work_objects, object_responses, conversations/messages, reviews; migration 002; React Router UI; concept workforce-marketplace-mvp.

## [2026-04-13] ingest | DB bootstrap: scripts/init-local-db.sql, grant-schema-headhunter.sql, migrate.ps1/migrate.sh, dev-up.ps1, scripts/README-DATABASE.md; backend/.env from example for local Postgres/Docker.

## [2026-04-13] ingest | Single-command dev: scripts/start.sh (bash: docker+migrate+uvicorn+vite), scripts/start.ps1 (delegates to bash or two cmd windows).

## [2026-04-13] ingest | Тесты: backend pytest (6 тестов: security, health, integration с БД), frontend vitest (3 теста); политика SecondBrain — фиксировать в вики; добавлена статья concepts/testing-backend-and-frontend.

## [2026-04-13] ingest | Enterprise roadmap: docs/DOMAIN_MODEL.md, concepts domain-roles-and-flows + domain-enterprise-extensions; миграция 003 (орги, shortlist, notifications, audit, api keys, webhooks, plans, SSO/2FA flags); каталог talent, аналитика, админ, биллинг, экспорт данных.

## [2026-04-13] ingest | Реализация плана Enterprise: UI /talent, /shortlist, /analytics/company, /notifications; лимиты тарифов; назначение платформенного админа вручную через SQL (is_platform_admin).

## [2026-04-13] ingest | UI: полные профили (ProfilePage + types/profiles.ts), объекты с company_name/company_city и cover_image_url (миграция 004, work_object_read, FeedObjectCard, NewObject/ObjectDetail), WorkerCard/BrigadeCard + Shortlist, редизайн Plus Jakarta Sans и токены; вики: concepts/frontend-profiles-work-objects-talent-ui.md + index.

## [2026-04-13] ingest | UI/UX фазы 1–2: GET /objects возвращает {items,total} с offset/limit; Feed — сетка, Pagination, query page+фильтры; палитра stone+indigo в :root; WorkObjectForm + EditObject (/objects/:id/edit); Settings (/settings) + PATCH /auth/me/password; ToastProvider; Protected skeleton на всю ширину; Modal Tab-focus trap; Breadcrumbs с опциональным to.

## [2026-04-13] ingest | UI/UX фазы 3–4: GET /notifications/unread-count; GET /objects sort=new|old; /help, /onboarding (после регистрации), /u/company/:userId, catch-all 404; Feed — сохранённые фильтры localStorage, сортировка; бейдж непрочитанных в навбаре; ссылка «Профиль компании» на объекте; ThemeProvider + тёмная тема в настройках; MobileBottomNav ≤900px; аналитика компании — KPI-сетка и полоса pending; ThemeProvider в тестах.

## [2026-04-14] ingest | Чаты: `ConversationRead` дополнен полями `work_object_title`, `peer_display_name`, `peer_role` (батч в `services/conversation_list.py`); `GET /chat/conversations` и `POST /chat/conversations` отдают обогащённые записи; добавлен `GET /chat/conversations/{id}` для шапки комнаты; UI списка чатов и `ChatRoom` показывают название объекта и собеседника.
