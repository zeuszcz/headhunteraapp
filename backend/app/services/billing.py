"""Лимиты тарифов на создание объектов."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.enums import SubscriptionStatus
from app.models import OrganizationMember, OrganizationSubscription, Plan, User, WorkObject


def _month_start_utc(now: datetime | None = None) -> datetime:
    n = now or datetime.now(timezone.utc)
    return n.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


def _next_month_start(start: datetime) -> datetime:
    if start.month == 12:
        return start.replace(year=start.year + 1, month=1)
    return start.replace(month=start.month + 1)


async def _default_free_plan(session: AsyncSession) -> Plan:
    r = await session.execute(select(Plan).where(Plan.slug == "free").limit(1))
    p = r.scalar_one_or_none()
    if p is None:
        raise HTTPException(status_code=500, detail="Тарифный план не настроен")
    return p


async def _company_user_ids_for_org(session: AsyncSession, organization_id: uuid.UUID) -> list[uuid.UUID]:
    r = await session.execute(select(OrganizationMember.user_id).where(OrganizationMember.organization_id == organization_id))
    return list(r.scalars().all())


async def assert_can_create_work_object(session: AsyncSession, user: User) -> None:
    if user.role != "company":
        return
    month_start = _month_start_utc()
    month_next = _next_month_start(month_start)

    limit: int
    if user.organization_id:
        sub_r = await session.execute(
            select(OrganizationSubscription).where(
                OrganizationSubscription.organization_id == user.organization_id
            )
        )
        sub = sub_r.scalar_one_or_none()
        if sub and sub.status == SubscriptionStatus.ACTIVE.value:
            pl = await session.get(Plan, sub.plan_id)
            if pl is None:
                pl = await _default_free_plan(session)
        else:
            pl = await _default_free_plan(session)
        limit = pl.max_objects_per_month
        ids = await _company_user_ids_for_org(session, user.organization_id)
        if not ids:
            ids = [user.id]
    else:
        pl = await _default_free_plan(session)
        limit = pl.max_objects_per_month
        ids = [user.id]

    cnt_r = await session.execute(
        select(func.count())
        .select_from(WorkObject)
        .where(
            WorkObject.company_user_id.in_(ids),
            WorkObject.created_at >= month_start,
            WorkObject.created_at < month_next,
        )
    )
    cnt = int(cnt_r.scalar_one() or 0)
    if cnt >= limit:
        raise HTTPException(
            status_code=402,
            detail=f"Достигнут лимит объектов в месяце ({limit}) для текущего тарифа.",
        )
