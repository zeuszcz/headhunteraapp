import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ConversationCreate(BaseModel):
    work_object_id: uuid.UUID
    peer_user_id: uuid.UUID | None = None


class ConversationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    work_object_id: uuid.UUID
    company_user_id: uuid.UUID
    participant_user_id: uuid.UUID
    created_at: datetime
    work_object_title: str | None = None
    peer_display_name: str | None = None
    peer_role: str | None = None


class MessageCreate(BaseModel):
    body: str = Field(..., min_length=1, max_length=8000)


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    conversation_id: uuid.UUID
    sender_user_id: uuid.UUID
    body: str
    created_at: datetime
