"""Сохранение загруженных изображений (аватары, обложки объектов)."""

from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

from app.config import Settings


def _public_url(relative_path: str) -> str:
    rel = relative_path.replace("\\", "/")
    return f"/api/v1/files/{rel}"


def validate_image_bytes(data: bytes, max_bytes: int) -> str:
    if len(data) > max_bytes:
        raise HTTPException(status_code=413, detail="Файл больше допустимого размера (макс. 2 МБ)")
    if len(data) < 12:
        raise HTTPException(status_code=400, detail="Недопустимый файл изображения")
    if data[:3] == b"\xff\xd8\xff":
        return "jpg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    raise HTTPException(status_code=400, detail="Допустимы только JPEG, PNG или WebP")


async def read_uploaded_image(file: UploadFile, settings: Settings) -> tuple[bytes, str]:
    data = await file.read()
    ext = validate_image_bytes(data, settings.max_upload_bytes)
    return data, ext


def save_avatar_file(user_id: uuid.UUID, data: bytes, ext: str, root: Path) -> str:
    name = f"{user_id}_{uuid.uuid4().hex}.{ext}"
    rel = f"avatars/{name}"
    path = root / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return _public_url(rel)


def save_object_cover_file(object_id: uuid.UUID, data: bytes, ext: str, root: Path) -> str:
    name = f"{object_id}_{uuid.uuid4().hex}.{ext}"
    rel = f"object_covers/{name}"
    path = root / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return _public_url(rel)
