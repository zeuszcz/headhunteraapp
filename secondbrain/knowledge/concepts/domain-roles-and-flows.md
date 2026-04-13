---
title: "Домен: роли, видимость, потоки компания ↔ исполнители"
tags: [domain, product, headhunteraapp]
sources:
  - docs/DOMAIN_MODEL.md
created: 2026-04-13
updated: 2026-04-13
---

# Домен: роли и потоки

Каноничное описание — в репозитории: [docs/DOMAIN_MODEL.md](../../../docs/DOMAIN_MODEL.md).

Кратко:

- **Компания** выставляет объекты и смотрит **каталог работников и бригад** (API только для роли `company`), плюс отклики и чаты.
- **Работник и бригада** смотрят **ленту объектов** (вакансии/задачи), откликаются, общаются.
- Черновики объектов (`draft`) не видны в ленте исполнителям; карточка черновика — только владельцу.

Связанно: [[knowledge/concepts/domain-enterprise-extensions]], [[knowledge/concepts/workforce-marketplace-mvp]].
