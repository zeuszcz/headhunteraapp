# headhunteraapp — project context

Compact orientation for agents. Expand `knowledge/concepts/` as the app grows.

## Product

- **headhunteraapp** — job search / career workflow tooling (scope to be filled in as the codebase lands).

## Repository layout

- **`backend/`** — FastAPI app (`app.main:app`), API under `/api/v1`, PostgreSQL via async SQLAlchemy.
- **`frontend/`** — React + Vite dev server `:5173`, proxies `/api` to backend `:8000`.
- **`docker-compose.yml`** — PostgreSQL 16 for local dev (requires Docker Desktop running on Windows).
- **`docs/ARCHITECTURE.md`** — architecture and data flow.
- **SecondBrain** (`secondbrain/`) — durable project memory: `knowledge/`, `daily/`, `raw/`.

## Agent memory (mandatory)

- Treat SecondBrain as the **primary project memory**: record meaningful work in `knowledge/` so future sessions do not rely on full-repo scans.
- **Before** digging into code: read `secondbrain/knowledge/index.md` and this file, then only the concept pages that match the task.
- **After** non-trivial work: update or add a concept page, bump `knowledge/index.md` if the article is new, append `knowledge/log.md` with `ingest | …`. Details: [[knowledge/concepts/agent-memory-and-session-notes]].

## Engineering process

- Role separation (Product, Tech Lead, Backend, Frontend, QA, DevOps): see [[knowledge/concepts/engineering-roles-and-agent-hats]] and `.cursor/rules/engineering-roles-and-handoffs.mdc`.

## Conventions

- Start from `knowledge/index.md`, then open relevant concept pages.
- After impactful work, update concepts + `index.md` + `log.md` per `secondbrain/AGENTS.md` and Cursor rules.
