---
title: "SecondBrain Runtime"
tags: [runtime, secondbrain]
created: 2026-04-13
updated: 2026-04-13
---

# SecondBrain Runtime

Core runtime conventions for session capture, docs ingest, and compile/query cycles in this repository.

## Key points

- Cursor hooks under `secondbrain/hooks/` append session context and trigger flushing to `daily/`.
- `scripts/sync_project_docs.py` ingests changed repo markdown (`README.md`, `docs/`, `assurance/`, `deploy/`) into daily logs.
- `scripts/compile.py` and related tools turn daily material into persistent wiki pages when run (including via maintenance).

## Related

- [[knowledge/concepts/agent-memory-and-session-notes]]
- [[knowledge/concepts/daily-ingestion-process]]
- [[knowledge/concepts/wiki-taxonomy-and-link-conventions]]
