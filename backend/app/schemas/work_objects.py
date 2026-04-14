import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class WorkObjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    status: str | None = Field(
        default=None,
        description="draft | open | in_progress — по умолчанию open",
    )
    address_or_region: str | None = None
    description: str | None = None
    work_type: str | None = None
    start_date: date | None = None
    duration_days: int | None = Field(default=None, ge=1)
    workers_needed: int = Field(default=1, ge=1)
    brigades_needed: int = Field(default=0, ge=0)
    required_skills_text: str | None = None
    conditions_text: str | None = None
    payment_format: str | None = None
    payment_amount_note: str | None = None
    urgency: str | None = None
    contact_override: str | None = None
    cover_image_url: str | None = Field(default=None, max_length=1024)


class WorkObjectUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    address_or_region: str | None = None
    description: str | None = None
    work_type: str | None = None
    start_date: date | None = None
    duration_days: int | None = Field(default=None, ge=1)
    workers_needed: int | None = Field(default=None, ge=1)
    brigades_needed: int | None = Field(default=None, ge=0)
    required_skills_text: str | None = None
    conditions_text: str | None = None
    payment_format: str | None = None
    payment_amount_note: str | None = None
    urgency: str | None = None
    contact_override: str | None = None
    status: str | None = None
    cover_image_url: str | None = Field(default=None, max_length=1024)


class WorkObjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_user_id: uuid.UUID
    title: str
    address_or_region: str | None
    description: str | None
    work_type: str | None
    start_date: date | None
    duration_days: int | None
    workers_needed: int
    brigades_needed: int
    required_skills_text: str | None
    conditions_text: str | None
    payment_format: str | None
    payment_amount_note: str | None
    urgency: str | None
    contact_override: str | None
    cover_image_url: str | None = None
    status: str
    created_at: datetime
    updated_at: datetime
    company_name: str | None = None
    company_city: str | None = None
    company_avatar_url: str | None = None


class WorkObjectListResponse(BaseModel):
    """Пагинированный список объектов для ленты."""

    items: list[WorkObjectRead]
    total: int
