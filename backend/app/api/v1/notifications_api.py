import uuid
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import get_current_user
from app.models import Notification, User
from app.schemas.notifications import NotificationRead

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationRead])
async def list_notifications(
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
    unread_only: bool = False,
    limit: int = 50,
) -> list[Notification]:
    stmt = select(Notification).where(Notification.user_id == user.id)
    if unread_only:
        stmt = stmt.where(Notification.read_at.is_(None))
    stmt = stmt.order_by(Notification.created_at.desc()).limit(limit)
    result = await session.execute(stmt)
    return list(result.scalars().all())


@router.patch("/{notification_id}/read", response_model=NotificationRead)
async def mark_read(
    notification_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> Notification:
    row = await session.get(Notification, notification_id)
    if row is None or row.user_id != user.id:
        raise HTTPException(status_code=404, detail="Уведомление не найдено")
    row.read_at = datetime.now(timezone.utc)
    await session.flush()
    await session.refresh(row)
    return row
