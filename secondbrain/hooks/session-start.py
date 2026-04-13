"""Cursor/Claude Code sessionStart hook: inject SecondBrain context."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = ROOT_DIR / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

from config import DAILY_DIR, INDEX_FILE
from utils import ensure_structure

MAX_CONTEXT_CHARS = 28_000
MAX_RECENT_LOG_LINES = 40
PROJECT_CONTEXT_FILE = ROOT_DIR / "knowledge" / "project-context.md"


def _read_project_context() -> str:
    if PROJECT_CONTEXT_FILE.exists():
        return PROJECT_CONTEXT_FILE.read_text(encoding="utf-8")
    return ""


def _read_concept_articles() -> str:
    concepts_dir = ROOT_DIR / "knowledge" / "concepts"
    if not concepts_dir.exists():
        return ""
    parts: list[str] = []
    for article in sorted(concepts_dir.glob("*.md")):
        # Skip fallback-only stubs
        content = article.read_text(encoding="utf-8")
        if len(content) < 200:
            continue
        # Include only non-daily-summary articles (they're big) unless it's the only knowledge
        if "daily-" in article.stem:
            # Include but truncate to first 600 chars to save space
            parts.append(f"### {article.stem}\n{content[:600]}\n...(truncated)")
        else:
            parts.append(content)
    return "\n\n---\n\n".join(parts)


def _read_recent_daily_tail() -> str:
    today = datetime.now(timezone.utc).astimezone()
    for offset in range(3):
        day = today - timedelta(days=offset)
        path = DAILY_DIR / f"{day.strftime('%Y-%m-%d')}.md"
        if path.exists():
            lines = path.read_text(encoding="utf-8").splitlines()
            # Get only Session/decisions sections, skip raw docs ingest
            filtered: list[str] = []
            skip = False
            for line in lines:
                if line.startswith("### Docs Ingest"):
                    skip = True
                elif line.startswith("### ") and "Docs Ingest" not in line:
                    skip = False
                if not skip:
                    filtered.append(line)
            tail = filtered[-MAX_RECENT_LOG_LINES:] if len(filtered) > MAX_RECENT_LOG_LINES else filtered
            return "\n".join(tail)
    return "(no daily entries yet)"


def build_context() -> str:
    ensure_structure()
    today = datetime.now(timezone.utc).astimezone().strftime("%A, %Y-%m-%d")
    project_ctx = _read_project_context()
    recent_daily = _read_recent_daily_tail()

    parts: list[str] = [f"## Today\n{today}"]

    if project_ctx:
        parts.append(f"## Project Knowledge\n{project_ctx}")

    concepts = _read_concept_articles()
    if concepts:
        parts.append(f"## Recent Knowledge Articles\n{concepts}")

    if recent_daily.strip():
        parts.append(f"## Recent Session Activity\n{recent_daily}")

    context = "\n\n".join(parts)
    if len(context) > MAX_CONTEXT_CHARS:
        context = context[:MAX_CONTEXT_CHARS] + "\n\n...(truncated)"
    return context


def main() -> int:
    output = {
        "hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": build_context(),
        }
    }
    sys.stdout.buffer.write(json.dumps(output, ensure_ascii=True).encode("utf-8"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
