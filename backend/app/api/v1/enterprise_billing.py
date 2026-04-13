"""Тарифы и подписка (просмотр)."""

import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import require_roles
from app.enums import UserRole
from app.models import OrganizationSubscription, Plan, User

router = APIRouter(prefix="/billing", tags=["billing"])


class PlanRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    slug: str
    name: str
    max_objects_per_month: int
    max_api_calls_per_day: int


class SubscriptionRead(BaseModel):
    plan: PlanRead
    status: str
    current_period_end: str | None


@router.get("/plans", response_model=list[PlanRead])
async def list_plans(session: AsyncSession = Depends(get_db)) -> Any:
    r = await session.execute(select(Plan).order_by(Plan.max_objects_per_month.asc()))
    return list(r.scalars().all())


@router.get("/organization/subscription", response_model=SubscriptionRead | None)
async def get_org_subscription(
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> Any:
    if not user.organization_id:
        return None
    r = await session.execute(
        select(OrganizationSubscription).where(
            OrganizationSubscription.organization_id == user.organization_id
        )
    )
    sub = r.scalar_one_or_none()
    if sub is None:
        return None
    plan = await session.get(Plan, sub.plan_id)
    if plan is None:
        raise HTTPException(status_code=500, detail="План не найден")
    return SubscriptionRead(
        plan=PlanRead.model_validate(plan),
        status=sub.status,
        current_period_end=sub.current_period_end.isoformat() if sub.current_period_end else None,
    )
