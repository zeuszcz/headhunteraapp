import uuid
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import get_current_user, require_roles
from app.enums import ApplicantKind, UserRole
from app.models import ObjectResponse, User, WorkObject
from app.services.notifications import notify_user
from app.schemas.object_responses import ObjectResponseCreate, ObjectResponseRead, ObjectResponseUpdate

router = APIRouter(tags=["responses"])


def _applicant_kind(user: User) -> str:
    if user.role == UserRole.WORKER.value:
        return ApplicantKind.WORKER.value
    if user.role == UserRole.BRIGADE.value:
        return ApplicantKind.BRIGADE.value
    raise HTTPException(status_code=403, detail="Только работник или бригада может откликаться")


@router.post(
    "/objects/{object_id}/responses",
    response_model=ObjectResponseRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_response(
    object_id: uuid.UUID,
    payload: ObjectResponseCreate,
    user: Annotated[User, Depends(require_roles(UserRole.WORKER, UserRole.BRIGADE))],
    session: AsyncSession = Depends(get_db),
) -> ObjectResponse:
    obj = await session.get(WorkObject, object_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="Объект не найден")
    if obj.status not in ("open", "in_progress"):
        raise HTTPException(status_code=400, detail="Объект не принимает отклики")
    if obj.company_user_id == user.id:
        raise HTTPException(status_code=400, detail="Нельзя откликаться на свой объект")

    existing = await session.execute(
        select(ObjectResponse).where(
            ObjectResponse.object_id == object_id,
            ObjectResponse.applicant_user_id == user.id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Вы уже откликались")

    row = ObjectResponse(
        object_id=object_id,
        applicant_user_id=user.id,
        applicant_kind=_applicant_kind(user),
        proposed_price_note=payload.proposed_price_note,
        proposed_timeline_text=payload.proposed_timeline_text,
        message_text=payload.message_text,
    )
    session.add(row)
    await session.flush()
    await session.refresh(row)
    await notify_user(
        session,
        user_id=obj.company_user_id,
        kind="response_new",
        title="Новый отклик на объект",
        body=obj.title,
        meta={"object_id": str(object_id), "response_id": str(row.id)},
    )
    return row


@router.get("/objects/{object_id}/responses", response_model=list[ObjectResponseRead])
async def list_responses_for_object(
    object_id: uuid.UUID,
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> list[ObjectResponse]:
    obj = await session.get(WorkObject, object_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="Объект не найден")
    if obj.company_user_id != user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    result = await session.execute(
        select(ObjectResponse)
        .where(ObjectResponse.object_id == object_id)
        .order_by(ObjectResponse.created_at.desc())
    )
    return list(result.scalars().all())


@router.get("/my/responses", response_model=list[ObjectResponseRead])
async def list_my_responses(
    user: Annotated[User, Depends(require_roles(UserRole.WORKER, UserRole.BRIGADE))],
    session: AsyncSession = Depends(get_db),
) -> list[ObjectResponse]:
    result = await session.execute(
        select(ObjectResponse)
        .where(ObjectResponse.applicant_user_id == user.id)
        .order_by(ObjectResponse.created_at.desc())
    )
    return list(result.scalars().all())


@router.patch("/responses/{response_id}", response_model=ObjectResponseRead)
async def patch_response(
    response_id: uuid.UUID,
    payload: ObjectResponseUpdate,
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> ObjectResponse:
    row = await session.get(ObjectResponse, response_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Отклик не найден")
    obj = await session.get(WorkObject, row.object_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="Объект не найден")

    data = payload.model_dump(exclude_unset=True)
    new_status = data.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Укажите status")

    if user.role == UserRole.COMPANY.value and obj.company_user_id == user.id:
        if new_status not in ("accepted", "rejected"):
            raise HTTPException(status_code=400, detail="Недопустимый статус")
        row.status = new_status
    elif user.id == row.applicant_user_id:
        if new_status != "withdrawn":
            raise HTTPException(status_code=400, detail="Можно только withdrawn")
        row.status = new_status
    else:
        raise HTTPException(status_code=403, detail="Нет доступа")

    row.updated_at = datetime.now(timezone.utc)
    await session.flush()
    await session.refresh(row)
    return row
