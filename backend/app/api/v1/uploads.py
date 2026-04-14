import uuid
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.db import get_db
from app.deps import get_current_user, require_roles
from app.enums import UserRole
from app.models import BrigadeProfile, CompanyProfile, User, WorkerProfile, WorkObject
from app.services.image_upload import read_uploaded_image, save_avatar_file, save_object_cover_file

router = APIRouter(prefix="/uploads", tags=["uploads"])


class UploadUrlResponse(BaseModel):
    url: str


@router.post("/avatar", response_model=UploadUrlResponse)
async def upload_avatar(
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
    file: UploadFile = File(...),
) -> UploadUrlResponse:
    settings = get_settings()
    data, ext = await read_uploaded_image(file, settings)
    url = save_avatar_file(user.id, data, ext, settings.upload_root)

    if user.role == UserRole.COMPANY.value:
        p = await session.get(CompanyProfile, user.id)
        if not p:
            raise HTTPException(status_code=404, detail="Профиль не найден")
        p.avatar_url = url
        p.updated_at = datetime.now(timezone.utc)
    elif user.role == UserRole.WORKER.value:
        p = await session.get(WorkerProfile, user.id)
        if not p:
            raise HTTPException(status_code=404, detail="Профиль не найден")
        p.avatar_url = url
        p.updated_at = datetime.now(timezone.utc)
    elif user.role == UserRole.BRIGADE.value:
        p = await session.get(BrigadeProfile, user.id)
        if not p:
            raise HTTPException(status_code=404, detail="Профиль не найден")
        p.avatar_url = url
        p.updated_at = datetime.now(timezone.utc)
    else:
        raise HTTPException(status_code=400, detail="Роль не поддерживает аватар")

    await session.commit()
    return UploadUrlResponse(url=url)


@router.post("/objects/{object_id}/cover", response_model=UploadUrlResponse)
async def upload_object_cover(
    object_id: uuid.UUID,
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
    file: UploadFile = File(...),
) -> UploadUrlResponse:
    row = await session.get(WorkObject, object_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Объект не найден")
    if row.company_user_id != user.id:
        raise HTTPException(status_code=403, detail="Нет доступа к объекту")

    settings = get_settings()
    data, ext = await read_uploaded_image(file, settings)
    url = save_object_cover_file(object_id, data, ext, settings.upload_root)
    row.cover_image_url = url
    row.updated_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(row)
    return UploadUrlResponse(url=url)
