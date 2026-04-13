"""Сводная аналитика для компании."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import require_roles
from app.enums import ObjectResponseStatus, UserRole
from app.models import ObjectResponse, User, WorkObject

router = APIRouter(prefix="/analytics", tags=["analytics"])


class CompanySummary(BaseModel):
    objects_total: int
    objects_open: int
    responses_pending: int
    responses_total: int


@router.get("/company/summary", response_model=CompanySummary)
async def company_summary(
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> Any:
    obj_total = await session.scalar(
        select(func.count()).select_from(WorkObject).where(WorkObject.company_user_id == user.id)
    )
    obj_open = await session.scalar(
        select(func.count())
        .select_from(WorkObject)
        .where(
            WorkObject.company_user_id == user.id,
            WorkObject.status.in_(("open", "in_progress")),
        )
    )
    sub = select(WorkObject.id).where(WorkObject.company_user_id == user.id)
    resp_total = await session.scalar(
        select(func.count()).select_from(ObjectResponse).where(ObjectResponse.object_id.in_(sub))
    )
    resp_pending = await session.scalar(
        select(func.count())
        .select_from(ObjectResponse)
        .where(
            ObjectResponse.object_id.in_(sub),
            ObjectResponse.status == ObjectResponseStatus.PENDING.value,
        )
    )
    return CompanySummary(
        objects_total=int(obj_total or 0),
        objects_open=int(obj_open or 0),
        responses_pending=int(resp_pending or 0),
        responses_total=int(resp_total or 0),
    )
