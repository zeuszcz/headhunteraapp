import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class NotificationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    kind: str
    title: str
    body: str | None
    read_at: datetime | None
    meta: dict[str, Any] | None
    created_at: datetime
