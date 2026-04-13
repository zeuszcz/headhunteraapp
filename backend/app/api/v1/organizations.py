"""Организации (B2B компании)."""

import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import require_roles
from app.enums import OrgMemberRole, SubscriptionStatus, UserRole
from app.models import Organization, OrganizationMember, OrganizationSubscription, Plan, User

router = APIRouter(prefix="/organizations", tags=["organizations"])


class OrganizationCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)


class MemberRead(BaseModel):
    user_id: uuid.UUID
    role: str
    email: str


class OrganizationMeRead(BaseModel):
    id: uuid.UUID
    name: str
    members: list[MemberRead]


@router.post("", status_code=201, response_model=OrganizationMeRead)
async def create_organization(
    payload: OrganizationCreate,
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> Any:
    if user.organization_id:
        raise HTTPException(status_code=400, detail="Пользователь уже в организации")
    org = Organization(name=payload.name)
    session.add(org)
    await session.flush()
    await session.refresh(org)

    member = OrganizationMember(
        organization_id=org.id,
        user_id=user.id,
        role=OrgMemberRole.ADMIN.value,
    )
    session.add(member)
    user.organization_id = org.id

    plan_r = await session.execute(select(Plan).where(Plan.slug == "free").limit(1))
    plan = plan_r.scalar_one()
    sub = OrganizationSubscription(
        organization_id=org.id,
        plan_id=plan.id,
        status=SubscriptionStatus.ACTIVE.value,
    )
    session.add(sub)
    await session.flush()
    return OrganizationMeRead(
        id=org.id,
        name=org.name,
        members=[MemberRead(user_id=user.id, role=OrgMemberRole.ADMIN.value, email=user.email)],
    )


@router.get("/me", response_model=OrganizationMeRead)
async def get_my_organization(
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> Any:
    if not user.organization_id:
        raise HTTPException(status_code=404, detail="Компания не в организации")
    org = await session.get(Organization, user.organization_id)
    if org is None:
        raise HTTPException(status_code=404, detail="Организация не найдена")
    r = await session.execute(
        select(OrganizationMember, User)
        .join(User, OrganizationMember.user_id == User.id)
        .where(OrganizationMember.organization_id == org.id)
    )
    members = []
    for mrow, u in r.all():
        members.append(MemberRead(user_id=u.id, role=mrow.role, email=u.email))
    return OrganizationMeRead(id=org.id, name=org.name, members=members)
