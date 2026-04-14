"""Сборка WorkObjectRead с данными компании для API."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CompanyProfile, WorkObject
from app.schemas.work_objects import WorkObjectRead


async def work_object_to_read(session: AsyncSession, row: WorkObject) -> WorkObjectRead:
    cp = await session.get(CompanyProfile, row.company_user_id)
    base = WorkObjectRead.model_validate(row)
    return base.model_copy(
        update={
            "company_name": cp.company_name if cp else None,
            "company_city": cp.city if cp else None,
            "company_avatar_url": cp.avatar_url if cp else None,
        }
    )


async def enrich_many_by_ids(session: AsyncSession, objects: list[WorkObject]) -> list[WorkObjectRead]:
    if not objects:
        return []
    ids = {o.company_user_id for o in objects}
    if not ids:
        return [WorkObjectRead.model_validate(o) for o in objects]
    cp_rows = (
        await session.execute(select(CompanyProfile).where(CompanyProfile.user_id.in_(ids)))
    ).scalars().all()
    by_id: dict[uuid.UUID, CompanyProfile] = {p.user_id: p for p in cp_rows}
    out: list[WorkObjectRead] = []
    for o in objects:
        cp = by_id.get(o.company_user_id)
        r = WorkObjectRead.model_validate(o)
        out.append(
            r.model_copy(
                update={
                    "company_name": cp.company_name if cp else None,
                    "company_city": cp.city if cp else None,
                    "company_avatar_url": cp.avatar_url if cp else None,
                }
            )
        )
    return out
