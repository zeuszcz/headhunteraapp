from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import api_router
from app.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    # StaticFiles проверяет каталог при инициализации приложения.
    settings.upload_root.mkdir(parents=True, exist_ok=True)
    app = FastAPI(
        title=settings.app_name,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def health():
        return {"status": "ok", "service": settings.app_name}

    app.include_router(api_router, prefix=f"{settings.api_prefix}/v1")
    app.mount(
        f"{settings.api_prefix}/v1/files",
        StaticFiles(directory=str(settings.upload_root)),
        name="uploaded_files",
    )
    return app


app = create_app()
