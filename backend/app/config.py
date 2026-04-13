from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(
            _BACKEND_DIR / ".env",
            _REPO_ROOT / ".env",
        ),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "headhunteraapp"
    debug: bool = False
    api_prefix: str = "/api"

    database_url: str = "postgresql+asyncpg://headhunter:headhunter@127.0.0.1:5432/headhunter"
    database_url_sync: str = "postgresql://headhunter:headhunter@127.0.0.1:5432/headhunter"

    cors_origins: list[str] = [
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ]

    jwt_secret: str = "dev-change-me-use-env-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7


@lru_cache
def get_settings() -> Settings:
    return Settings()
