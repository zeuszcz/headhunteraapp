---
title: "Инженерные роли и шляпы агента"
tags: [process, roles, team, agent]
created: 2026-04-13
updated: 2026-04-13
---

# Инженерные роли и шляпы агента

Зеркало правила Cursor: `.cursor/rules/engineering-roles-and-handoffs.mdc`.

## Суть

В проекте принято явное разделение ответственности по ролям (как в IT-компании): Product/мысль, Tech Lead, Backend, Frontend, QA, DevOps (+ Security при необходимости). Агент обозначает активную роль и не смешивает слои без handoff.

## Роли (кратко)

- **Product / Discovery** — проблема, scope, критерии приёмки.
- **Tech Lead / Architecture** — границы системы, контракты, риски.
- **Backend** — сервер, API, данные, интеграции.
- **Frontend** — клиент, UI, вызовы API по контракту.
- **QA / Testing** — сценарии, автотесты, регрессия.
- **DevOps / SRE** — CI/CD, окружения, наблюдаемость.

## Handoff

При смене фокуса: `[Роль: X]` → `[Handoff → Y]` с явным списком ожиданий.

## Связь

- [[knowledge/concepts/agent-memory-and-session-notes]]
- [[knowledge/concepts/wiki-taxonomy-and-link-conventions]]
