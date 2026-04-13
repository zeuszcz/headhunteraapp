"""Каталог исполнителей (только для компании)."""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import require_roles
from app.enums import UserRole
from app.models import BrigadeProfile, User, WorkerProfile
from app.schemas.profiles import BrigadeProfileRead, WorkerProfileRead

router = APIRouter(prefix="/talent", tags=["talent"])


@router.get("/workers", response_model=list[WorkerProfileRead])
async def list_workers(
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
    city: str | None = Query(None),
    q: str | None = Query(None, description="Имя, профессия, навыки"),
    min_rating: float | None = Query(None, ge=0, le=5),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> list[WorkerProfile]:
    stmt = select(WorkerProfile).join(User, WorkerProfile.user_id == User.id).where(User.role == UserRole.WORKER.value)
    if city:
        stmt = stmt.where(WorkerProfile.city.ilike(f"%{city}%"))
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(
                WorkerProfile.full_name.ilike(like),
                WorkerProfile.profession.ilike(like),
                WorkerProfile.skills_text.ilike(like),
                WorkerProfile.specialization.ilike(like),
            )
        )
    if min_rating is not None:
        stmt = stmt.where(WorkerProfile.rating_avg >= min_rating)
    stmt = stmt.order_by(WorkerProfile.rating_avg.desc()).limit(limit).offset(offset)
    result = await session.execute(stmt)
    return list(result.scalars().all())


@router.get("/brigades", response_model=list[BrigadeProfileRead])
async def list_brigades(
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
    q: str | None = Query(None, description="Название, специализация, регионы"),
    min_rating: float | None = Query(None, ge=0, le=5),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> list[BrigadeProfile]:
    stmt = select(BrigadeProfile).join(User, BrigadeProfile.user_id == User.id).where(User.role == UserRole.BRIGADE.value)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(
                BrigadeProfile.name.ilike(like),
                BrigadeProfile.specialization.ilike(like),
                BrigadeProfile.regions_text.ilike(like),
                BrigadeProfile.roles_composition_text.ilike(like),
            )
        )
    if min_rating is not None:
        stmt = stmt.where(BrigadeProfile.rating_avg >= min_rating)
    stmt = stmt.order_by(BrigadeProfile.rating_avg.desc()).limit(limit).offset(offset)
    result = await session.execute(stmt)
    return list(result.scalars().all())


@router.get("/workers/{user_id}", response_model=WorkerProfileRead)
async def get_worker_for_company(
    user_id: uuid.UUID,
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> WorkerProfile:
    u = await session.get(User, user_id)
    if not u or u.role != UserRole.WORKER.value:
        raise HTTPException(status_code=404, detail="Работник не найден")
    p = await session.get(WorkerProfile, user_id)
    if not p:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    return p


@router.get("/brigades/{user_id}", response_model=BrigadeProfileRead)
async def get_brigade_for_company(
    user_id: uuid.UUID,
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> BrigadeProfile:
    u = await session.get(User, user_id)
    if not u or u.role != UserRole.BRIGADE.value:
        raise HTTPException(status_code=404, detail="Бригада не найдена")
    p = await session.get(BrigadeProfile, user_id)
    if not p:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    return p
