"""Админка платформы."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import require_platform_admin
from app.models import AuditLog, Notification, User, WorkObject

router = APIRouter(prefix="/admin", tags=["admin"])


class PlatformStats(BaseModel):
    users_total: int
    work_objects_total: int
    notifications_total: int
    audit_logs_total: int


@router.get("/stats", response_model=PlatformStats)
async def platform_stats(
    user: Annotated[User, Depends(require_platform_admin)],
    session: AsyncSession = Depends(get_db),
) -> Any:
    u = await session.scalar(select(func.count()).select_from(User))
    o = await session.scalar(select(func.count()).select_from(WorkObject))
    n = await session.scalar(select(func.count()).select_from(Notification))
    a = await session.scalar(select(func.count()).select_from(AuditLog))
    return PlatformStats(
        users_total=int(u or 0),
        work_objects_total=int(o or 0),
        notifications_total=int(n or 0),
        audit_logs_total=int(a or 0),
    )
