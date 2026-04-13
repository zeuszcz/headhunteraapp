"""Избранные исполнители у компании."""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import require_roles
from app.enums import UserRole
from app.models import BrigadeProfile, ShortlistEntry, User, WorkerProfile
from app.schemas.profiles import BrigadeProfileRead, WorkerProfileRead

router = APIRouter(prefix="/shortlist", tags=["shortlist"])


@router.get("/workers", response_model=list[WorkerProfileRead])
async def list_shortlist_workers(
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> list[WorkerProfile]:
    sub = select(ShortlistEntry.target_user_id).where(ShortlistEntry.owner_user_id == user.id)
    stmt = (
        select(WorkerProfile)
        .join(User, WorkerProfile.user_id == User.id)
        .where(User.role == UserRole.WORKER.value, WorkerProfile.user_id.in_(sub))
    )
    result = await session.execute(stmt)
    return list(result.scalars().all())


@router.get("/brigades", response_model=list[BrigadeProfileRead])
async def list_shortlist_brigades(
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> list[BrigadeProfile]:
    sub = select(ShortlistEntry.target_user_id).where(ShortlistEntry.owner_user_id == user.id)
    stmt = (
        select(BrigadeProfile)
        .join(User, BrigadeProfile.user_id == User.id)
        .where(User.role == UserRole.BRIGADE.value, BrigadeProfile.user_id.in_(sub))
    )
    result = await session.execute(stmt)
    return list(result.scalars().all())


@router.post("/{target_user_id}", status_code=204)
async def add_to_shortlist(
    target_user_id: uuid.UUID,
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> None:
    if target_user_id == user.id:
        raise HTTPException(status_code=400, detail="Нельзя добавить себя")
    target = await session.get(User, target_user_id)
    if not target or target.role not in (UserRole.WORKER.value, UserRole.BRIGADE.value):
        raise HTTPException(status_code=400, detail="Можно добавлять только работников и бригады")
    session.add(ShortlistEntry(owner_user_id=user.id, target_user_id=target_user_id))
    try:
        await session.flush()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=400, detail="Уже в избранном") from None


@router.delete("/{target_user_id}", status_code=204)
async def remove_from_shortlist(
    target_user_id: uuid.UUID,
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> None:
    await session.execute(
        delete(ShortlistEntry).where(
            ShortlistEntry.owner_user_id == user.id,
            ShortlistEntry.target_user_id == target_user_id,
        )
    )
    await session.flush()
