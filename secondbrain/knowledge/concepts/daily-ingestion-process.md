---
title: "Daily Ingestion Process"
tags: [daily, ingestion]
created: 2026-04-13
updated: 2026-04-13
---

# Daily Ingestion Process

How session and docs events are appended into `daily/YYYY-MM-DD.md` before compilation into `knowledge/`.

## Flow

1. **Session hooks** write or flush conversation excerpts into the daily file (see `secondbrain/hooks/`).
2. **Docs sync** (`scripts/sync_project_docs.py`) appends snippets when tracked markdown at the repo root changes.
3. **Compile / maintenance** promotes stable facts into `knowledge/concepts/`, `connections/`, and `qa/` according to project scripts.

## Related

- [[knowledge/concepts/secondbrain-runtime]]
