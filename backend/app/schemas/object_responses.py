import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.enums import ApplicantKind


class ObjectResponseCreate(BaseModel):
    proposed_price_note: str | None = None
    proposed_timeline_text: str | None = None
    message_text: str | None = None


class ObjectResponseUpdate(BaseModel):
    status: str | None = None


class ObjectResponseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    object_id: uuid.UUID
    applicant_user_id: uuid.UUID
    applicant_kind: str
    proposed_price_note: str | None
    proposed_timeline_text: str | None
    message_text: str | None
    status: str
    created_at: datetime
    updated_at: datetime
