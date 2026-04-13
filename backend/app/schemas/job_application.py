import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class JobApplicationBase(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=255)
    role_title: str = Field(..., min_length=1, max_length=255)
    status: str = Field(default="applied", max_length=64)
    notes: str | None = None


class JobApplicationCreate(JobApplicationBase):
    pass


class JobApplicationUpdate(BaseModel):
    company_name: str | None = Field(default=None, min_length=1, max_length=255)
    role_title: str | None = Field(default=None, min_length=1, max_length=255)
    status: str | None = Field(default=None, max_length=64)
    notes: str | None = None


class JobApplicationRead(JobApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    applied_at: datetime
    created_at: datetime
    updated_at: datetime
