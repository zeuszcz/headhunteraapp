"""In-app уведомления."""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Notification


async def notify_user(
    session: AsyncSession,
    *,
    user_id: uuid.UUID,
    kind: str,
    title: str,
    body: str | None = None,
    meta: dict[str, Any] | None = None,
) -> Notification:
    row = Notification(
        user_id=user_id,
        kind=kind,
        title=title,
        body=body,
        meta=meta,
    )
    session.add(row)
    await session.flush()
    await session.refresh(row)
    return row
