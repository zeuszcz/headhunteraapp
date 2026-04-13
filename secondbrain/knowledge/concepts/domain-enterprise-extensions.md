---
title: "Enterprise-расширения: органы, аудит, API, биллинг"
tags: [enterprise, architecture, headhunteraapp]
sources:
  - backend/alembic/versions/003_enterprise_foundation.py
created: 2026-04-13
updated: 2026-04-13
---

# Enterprise-расширения (факты по репозиторию)

См. миграцию `003_enterprise_foundation` и роутеры `organizations`, `notifications`, `integrations`, `analytics`, `admin`, `billing`.

| Область | Сущности / поведение |
|--------|------------------------|
| Организации | `organizations`, `organization_members`; у `users` поле `organization_id` (компании в B2B). |
| Краткий список | `shortlist_entries` — избранные исполнители у пользователя-компании. |
| Уведомления | `notifications` — in-app; создание при отклике (хук в сервисе откликов). |
| Аудит | `audit_log` — действия для разбора (кто, что, сущность). |
| Интеграции | `api_keys` (хеш ключа), `webhook_subscriptions` — исходящие webhooks. |
| Безопасность | Флаги `users.two_factor_enabled`, `sso_subject` (заготовка под SSO/2FA). |
| Аналитика | `GET /api/v1/analytics/company/summary` — сводка по объектам и откликам. |
| Админка платформы | `GET /api/v1/admin/stats` при `is_platform_admin`. |
| Монетизация | `plans`, `organization_subscriptions`; лимит объектов в месяц при создании объекта. |

Политика данных: `GET /api/v1/me/export` — экспорт данных пользователя (JSON).
