import uuid
from datetime import date, datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import get_current_user_optional, require_roles
from app.enums import UserRole, WorkObjectStatus
from app.models import CompanyProfile, User, WorkObject
from app.schemas.work_objects import (
    WorkObjectCreate,
    WorkObjectListResponse,
    WorkObjectRead,
    WorkObjectUpdate,
)
from app.services.audit_log import write_audit
from app.services.billing import assert_can_create_work_object
from app.services.work_object_read import enrich_many_by_ids, work_object_to_read

router = APIRouter(prefix="/objects", tags=["objects"])


@router.get("", response_model=WorkObjectListResponse)
async def list_objects(
    session: AsyncSession = Depends(get_db),
    city: str | None = Query(None, description="Подстрока в адресе/регионе"),
    q: str | None = Query(None, description="Поиск по названию, описанию, виду работ, навыкам"),
    payment: str | None = Query(None, description="Подстрока в условиях оплаты"),
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    status: str | None = Query(
        None,
        description="Если не указан — только open и in_progress (рынок для исполнителей)",
    ),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0, description="Смещение для пагинации"),
    sort: str = Query(
        "new",
        description="Сортировка по дате создания: new (новые первые) или old (старые первые)",
    ),
) -> WorkObjectListResponse:
    sort_key = sort if sort in ("new", "old") else "new"
    stmt = (
        select(WorkObject, CompanyProfile.company_name, CompanyProfile.city)
        .outerjoin(CompanyProfile, WorkObject.company_user_id == CompanyProfile.user_id)
    )
    conds = []
    market_statuses = (WorkObjectStatus.OPEN.value, WorkObjectStatus.IN_PROGRESS.value)
    if status:
        conds.append(WorkObject.status == status)
    else:
        conds.append(WorkObject.status.in_(market_statuses))
    if city:
        conds.append(WorkObject.address_or_region.ilike(f"%{city}%"))
    if payment:
        conds.append(WorkObject.payment_amount_note.ilike(f"%{payment}%"))
    if date_from:
        conds.append(
            or_(WorkObject.start_date.is_(None), WorkObject.start_date >= date_from),
        )
    if date_to:
        conds.append(
            or_(WorkObject.start_date.is_(None), WorkObject.start_date <= date_to),
        )
    if q:
        like = f"%{q}%"
        conds.append(
            or_(
                WorkObject.title.ilike(like),
                WorkObject.description.ilike(like),
                WorkObject.work_type.ilike(like),
                WorkObject.required_skills_text.ilike(like),
            ),
        )
    where_clause = and_(*conds) if conds else None
    if where_clause is not None:
        stmt = stmt.where(where_clause)

    count_stmt = select(func.count()).select_from(WorkObject)
    if where_clause is not None:
        count_stmt = count_stmt.where(where_clause)
    total = int((await session.execute(count_stmt)).scalar_one())

    order = WorkObject.created_at.desc() if sort_key != "old" else WorkObject.created_at.asc()
    stmt = stmt.order_by(order).offset(offset).limit(limit)
    result = await session.execute(stmt)
    out: list[WorkObjectRead] = []
    for wo, cn, cc in result.all():
        r = WorkObjectRead.model_validate(wo)
        out.append(r.model_copy(update={"company_name": cn, "company_city": cc}))
    return WorkObjectListResponse(items=out, total=total)


@router.get("/company/mine", response_model=list[WorkObjectRead])
async def list_my_company_objects(
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> list[WorkObjectRead]:
    result = await session.execute(
        select(WorkObject)
        .where(WorkObject.company_user_id == user.id)
        .order_by(WorkObject.created_at.desc())
    )
    rows = list(result.scalars().all())
    return await enrich_many_by_ids(session, rows)


@router.post("", response_model=WorkObjectRead, status_code=201)
async def create_object(
    payload: WorkObjectCreate,
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> WorkObjectRead:
    await assert_can_create_work_object(session, user)
    data = payload.model_dump()
    status_val = data.pop("status", None) or WorkObjectStatus.OPEN.value
    allowed = {s.value for s in WorkObjectStatus}
    if status_val not in allowed:
        raise HTTPException(status_code=400, detail="Недопустимый статус объекта")
    row = WorkObject(company_user_id=user.id, status=status_val, **data)
    session.add(row)
    await session.flush()
    await session.refresh(row)
    await write_audit(
        session,
        actor_user_id=user.id,
        action="work_object.create",
        entity_type="work_object",
        entity_id=row.id,
        meta={"status": status_val},
    )
    return await work_object_to_read(session, row)


@router.get("/{object_id}", response_model=WorkObjectRead)
async def get_object(
    object_id: uuid.UUID,
    viewer: Annotated[User | None, Depends(get_current_user_optional)],
    session: AsyncSession = Depends(get_db),
) -> WorkObjectRead:
    row = await session.get(WorkObject, object_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Объект не найден")
    if row.status == WorkObjectStatus.DRAFT.value:
        if viewer is None or viewer.id != row.company_user_id:
            raise HTTPException(status_code=404, detail="Объект не найден")
    return await work_object_to_read(session, row)


@router.patch("/{object_id}", response_model=WorkObjectRead)
async def patch_object(
    object_id: uuid.UUID,
    payload: WorkObjectUpdate,
    user: Annotated[User, Depends(require_roles(UserRole.COMPANY))],
    session: AsyncSession = Depends(get_db),
) -> WorkObjectRead:
    row = await session.get(WorkObject, object_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Объект не найден")
    if row.company_user_id != user.id:
        raise HTTPException(status_code=403, detail="Нет доступа к объекту")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(row, k, v)
    row.updated_at = datetime.now(timezone.utc)
    await session.flush()
    await session.refresh(row)
    return await work_object_to_read(session, row)
