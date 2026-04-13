# SecondBrain (Repo-local)

Team-ready memory system for **headhunteraapp**. Knowledge and wiki are **versioned in Git** — the team shares the same `knowledge/`, `daily/`, and `raw/` via `git pull` / merge.

## What lives in the repository

| Path                               | Purpose                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `knowledge/`                       | Compiled wiki: `index.md`, `log.md`, `concepts/`, `connections/`, `qa/`     |
| `daily/`                           | Daily session logs and ingest (append-only by day)                           |
| `raw/`                             | Immutable snapshots of external/supplementary sources                      |
| `scripts/`, `hooks/`, `templates/` | Logic, Cursor hooks, templates                                               |
| `AGENTS.md`                        | Schema and conventions                                                       |

**Not committed locally** (see `.gitignore`): script state files, logs, `tmp/`, `reports/`.

## Setup

```bash
cd secondbrain
uv sync
python scripts/init_workspace.py
```

Or from the project root:

```bash
./scripts/setup-secondbrain.sh
```

Project hooks: `.cursor/hooks.json`.

### Live capture in Cursor

- `afterAgentResponse` flushes during an active session (you do not need to close the chat to see updates in `daily/`).
- Live events are throttled (dedup) to avoid log spam.
- Heavy compile/maintenance runs on `sessionEnd` / `preCompact`.

## Git: syncing knowledge

1. **Before a session:** `git pull` (or `git pull --rebase`) so the wiki is current.
2. **After meaningful wiki edits** (new concepts, `index.md`, answers in `qa/`): same commit as the feature, or a separate commit like `docs(secondbrain): short summary`.
3. **Markdown conflicts:**
   - `daily/*.md` and `knowledge/log.md` use **`merge=union`** (see `.gitattributes`) — Git merges lines; fix odd duplicates by hand if needed.
   - Other pages: resolve conflicts normally; keep facts from both sides and remove duplicates.
4. **Branches:** large wiki restructures can use a branch like code; small additions can go to `main` by team agreement.

## Backend mode

`SECOND_BRAIN_LLM_BACKEND`:

- `cursor` (default)
- `claude`
- `none`

### Cursor backend note (Windows)

If `cursor agent` from the IDE CLI does not support `-p/--output-format`, install the standalone agent CLI:

```powershell
irm 'https://cursor.com/install?win32=true' | iex
```

SecondBrain auto-detects `agent`, `cursor-agent`, paths under `%LOCALAPPDATA%`. Auth: `agent login` or `CURSOR_API_KEY`.

```bash
uv run python scripts/check_sdk.py
```

## Additional workflows

- Web to raw: `uv run python scripts/ingest_web.py "https://example.com/article"`
- Maintenance: `uv run python scripts/maintenance.py`
