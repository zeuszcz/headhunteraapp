"""Общие фикстуры: TestClient, опционально PostgreSQL."""

from __future__ import annotations

import asyncio
import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text

from app.db import engine as async_engine
from app.main import create_app


@pytest.fixture
def client() -> TestClient:
    """После теста сбрасываем пул asyncpg — иначе второй запрос ловит закрытый event loop (Windows)."""
    app = create_app()
    with TestClient(app) as c:
        yield c

    async def _dispose() -> None:
        await async_engine.dispose()

    asyncio.run(_dispose())


@pytest.fixture(scope="session")
def db_available() -> None:
    """Пропускает integration-тесты, если БД недоступна или задан SKIP_DB_TESTS."""
    if os.getenv("SKIP_DB_TESTS", "").lower() in ("1", "true", "yes"):
        pytest.skip("SKIP_DB_TESTS установлен")
    from app.config import get_settings

    settings = get_settings()
    try:
        eng = create_engine(settings.database_url_sync, pool_pre_ping=True)
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
            r = conn.execute(
                text(
                    "SELECT EXISTS (SELECT 1 FROM information_schema.tables "
                    "WHERE table_schema = 'public' AND table_name = 'users')"
                )
            )
            if not r.scalar():
                pytest.skip("Нет таблицы users — выполните: alembic upgrade head")
        eng.dispose()
    except Exception as exc:  # noqa: BLE001
        pytest.skip(f"PostgreSQL / схема недоступны: {exc}")
