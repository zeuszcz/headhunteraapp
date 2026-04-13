# AGENTS.md - headhunteraapp SecondBrain Schema

This file defines how the repo-local SecondBrain is maintained.

## Purpose

The system compiles knowledge from:

- Cursor agent conversations (transcript logs)
- headhunteraapp markdown documentation (`README.md`, `docs/`, etc.)

Knowledge is accumulated into a persistent wiki, not re-derived on every query.

## Storage Model

**Git:** layers `knowledge/`, `daily/`, `raw/` **are versioned in the repository** — the team syncs the wiki via `git pull` / merge. Local machine-state files under `scripts/` stay in `.gitignore`. See `secondbrain/README.md` (Git section).

### Raw Layer

- `raw/` - immutable snapshots of ingested external/project markdown sources.
- `daily/YYYY-MM-DD.md` - append-only daily source logs.
- Each daily file can contain:
  - Session extraction blocks (from hooks)
  - Docs ingestion blocks (from repo markdown sync)

### Compiled Layer

- `knowledge/index.md` - catalog of all compiled knowledge articles.
- `knowledge/log.md` - append-only build/query/lint history.
- `knowledge/concepts/` - atomic knowledge pages.
- `knowledge/connections/` - cross-concept synthesis pages.
- `knowledge/qa/` - filed answers from queries.

### Runtime Layer

- `scripts/` - compiler, query, lint, sync, and utility logic.
- `hooks/` - Cursor hook entrypoints for `sessionStart`, `sessionEnd`, `preCompact`.
- `scripts/maintenance.py` - once-per-day (after configured hour) orchestration for sync -> compile -> backlinks repair -> lint.

## Domain Scope

When compiling, prioritize topics relevant to **headhunteraapp** (job search / career tooling, integrations with job boards, UX for applications, data privacy, and project-specific architecture and operations).

## Lint Rules

Run structural checks:

- Broken wikilinks
- Orphan pages
- Orphan daily sources
- Missing backlinks
- Sparse pages

Optionally run contradiction detection with LLM support.
