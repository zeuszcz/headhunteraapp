import uuid
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import get_current_user, require_roles
from app.enums import UserRole
from app.models import BrigadeProfile, CompanyProfile, User, WorkerProfile
from app.schemas.profiles import (
    BrigadeProfileRead,
    BrigadeProfileUpdate,
    CompanyProfileRead,
    CompanyProfileUpdate,
    WorkerProfileRead,
    WorkerProfileUpdate,
)

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/companies/{user_id}", response_model=CompanyProfileRead)
async def get_company_public(
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
) -> CompanyProfile:
    u = await session.get(User, user_id)
    if not u or u.role != UserRole.COMPANY.value:
        raise HTTPException(status_code=404, detail="Компания не найдена")
    p = await session.get(CompanyProfile, user_id)
    if not p:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    return p


@router.patch("/company", response_model=CompanyProfileRead)
async def patch_company(
    payload: CompanyProfileUpdate,
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> CompanyProfile:
    p = await session.get(CompanyProfile, user.id)
    if not p:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
    p.updated_at = datetime.now(timezone.utc)
    await session.flush()
    await session.refresh(p)
    return p


@router.get("/workers/{user_id}", response_model=WorkerProfileRead)
async def get_worker_public(
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
) -> WorkerProfile:
    u = await session.get(User, user_id)
    if not u or u.role != UserRole.WORKER.value:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    p = await session.get(WorkerProfile, user_id)
    if not p:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    return p


@router.patch("/worker", response_model=WorkerProfileRead)
async def patch_worker(
    payload: WorkerProfileUpdate,
    user: Annotated[User, Depends(require_roles(UserRole.WORKER))],
    session: AsyncSession = Depends(get_db),
) -> WorkerProfile:
    p = await session.get(WorkerProfile, user.id)
    if not p:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
    p.updated_at = datetime.now(timezone.utc)
    await session.flush()
    await session.refresh(p)
    return p


@router.get("/brigades/{user_id}", response_model=BrigadeProfileRead)
async def get_brigade_public(
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
) -> BrigadeProfile:
    u = await session.get(User, user_id)
    if not u or u.role != UserRole.BRIGADE.value:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    p = await session.get(BrigadeProfile, user_id)
    if not p:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    return p


@router.patch("/brigade", response_model=BrigadeProfileRead)
async def patch_brigade(
    payload: BrigadeProfileUpdate,
    user: Annotated[User, Depends(require_roles(UserRole.BRIGADE))],
    session: AsyncSession = Depends(get_db),
) -> BrigadeProfile:
    p = await session.get(BrigadeProfile, user.id)
    if not p:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
    p.updated_at = datetime.now(timezone.utc)
    await session.flush()
    await session.refresh(p)
    return p
