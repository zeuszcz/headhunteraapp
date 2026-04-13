"""Incremental ingestion of repository markdown docs into daily logs."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from pathlib import Path

from config import DAILY_DIR, DOCS_STATE_FILE, PROJECT_ROOT
from utils import ensure_structure, file_hash, load_json, save_json

DEFAULT_PROJECT_ROOT = PROJECT_ROOT
DOC_DIRS = ("docs", "assurance", "deploy")


def _collect_markdown_files(project_root: Path) -> list[Path]:
    files: list[Path] = []
    readme = project_root / "README.md"
    if readme.exists():
        files.append(readme)
    for folder in DOC_DIRS:
        base = project_root / folder
        if base.exists():
            files.extend(sorted(base.rglob("*.md"), key=lambda p: str(p).lower()))
    return files


def _snippet(text: str, max_len: int = 1200) -> str:
    clean = text.strip().replace("\r", "")
    if len(clean) <= max_len:
        return clean
    return clean[:max_len] + "\n...(truncated)"


def _append_daily_block(lines: list[str]) -> Path:
    ensure_structure()
    now = datetime.now(timezone.utc).astimezone()
    daily_path = DAILY_DIR / f"{now.strftime('%Y-%m-%d')}.md"
    if not daily_path.exists():
        daily_path.write_text(
            f"# Daily Log: {now.strftime('%Y-%m-%d')}\n\n## Sessions\n\n## Docs Ingest\n\n## Memory Maintenance\n\n",
            encoding="utf-8",
        )

    body = "\n".join(lines)
    with daily_path.open("a", encoding="utf-8") as f:
        f.write(f"### Docs Ingest ({now.strftime('%H:%M')})\n\n{body}\n\n")
    return daily_path


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync markdown docs into daily logs")
    parser.add_argument("--project-root", type=str, default=str(DEFAULT_PROJECT_ROOT))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ensure_structure()
    project_root = Path(args.project_root).resolve()
    state = load_json(DOCS_STATE_FILE, {"files": {}})
    tracked: dict = state.get("files", {})

    md_files = _collect_markdown_files(project_root)
    changed: list[tuple[Path, str]] = []
    for path in md_files:
        sig = file_hash(path)
        rel = str(path.relative_to(project_root)).replace("\\", "/")
        if tracked.get(rel) != sig:
            changed.append((path, rel))
            tracked[rel] = sig

    if not changed:
        print("No docs changes detected.")
        save_json(DOCS_STATE_FILE, {"files": tracked})
        return 0

    print(f"Docs changed: {len(changed)}")
    if args.dry_run:
        for _path, rel in changed:
            print(f" - {rel}")
        return 0

    lines: list[str] = [
        f"Project root: `{project_root}`",
        "",
        "**Changed markdown files:**",
    ]
    for path, rel in changed:
        content = path.read_text(encoding="utf-8", errors="ignore")
        lines.append(f"- `{rel}`")
        lines.append("")
        lines.append(f"#### Source: {rel}")
        lines.append("```markdown")
        lines.append(_snippet(content))
        lines.append("```")
        lines.append("")

    daily_file = _append_daily_block(lines)
    save_json(DOCS_STATE_FILE, {"files": tracked})
    print(f"Appended docs ingest to {daily_file}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

