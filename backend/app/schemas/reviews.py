import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    target_user_id: uuid.UUID
    work_object_id: uuid.UUID | None = None
    rating: int = Field(..., ge=1, le=5)
    comment: str | None = None


class ReviewRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    reviewer_user_id: uuid.UUID
    target_user_id: uuid.UUID
    work_object_id: uuid.UUID | None
    rating: int
    comment: str | None
    created_at: datetime
