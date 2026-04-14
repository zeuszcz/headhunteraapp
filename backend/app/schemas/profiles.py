import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CompanyProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: uuid.UUID
    company_name: str
    description: str | None
    city: str | None
    regions_text: str | None
    project_types: str | None
    years_on_market: int | None
    contact_person: str | None
    phone: str | None
    messengers_text: str | None
    email_public: str | None
    cooperation_terms: str | None
    avg_budget_note: str | None
    payment_methods_text: str | None
    media_note: str | None
    avatar_url: str | None
    rating_avg: float
    reviews_count: int
    created_at: datetime
    updated_at: datetime


class CompanyProfileUpdate(BaseModel):
    company_name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    city: str | None = None
    regions_text: str | None = None
    project_types: str | None = None
    years_on_market: int | None = Field(default=None, ge=0, le=200)
    contact_person: str | None = None
    phone: str | None = None
    messengers_text: str | None = None
    email_public: str | None = None
    cooperation_terms: str | None = None
    avg_budget_note: str | None = None
    payment_methods_text: str | None = None
    media_note: str | None = None
    avatar_url: str | None = None


class WorkerProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: uuid.UUID
    full_name: str
    profession: str | None
    specialization: str | None
    experience_years: int | None
    skills_text: str | None
    city: str | None
    willing_to_travel: bool
    desired_rate_note: str | None
    work_format: str | None
    bio: str | None
    documents_note: str | None
    portfolio_note: str | None
    avatar_url: str | None
    rating_avg: float
    reviews_count: int
    created_at: datetime
    updated_at: datetime


class WorkerProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=255)
    profession: str | None = None
    specialization: str | None = None
    experience_years: int | None = Field(default=None, ge=0, le=80)
    skills_text: str | None = None
    city: str | None = None
    willing_to_travel: bool | None = None
    desired_rate_note: str | None = None
    work_format: str | None = None
    bio: str | None = None
    documents_note: str | None = None
    portfolio_note: str | None = None
    avatar_url: str | None = None


class BrigadeProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: uuid.UUID
    name: str
    leader_name: str | None
    headcount: int
    roles_composition_text: str | None
    specialization: str | None
    past_objects_note: str | None
    regions_text: str | None
    has_tools: bool
    has_transport: bool
    avg_price_note: str | None
    availability_note: str | None
    bio: str | None
    portfolio_note: str | None
    avatar_url: str | None
    rating_avg: float
    reviews_count: int
    created_at: datetime
    updated_at: datetime


class BrigadeProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    leader_name: str | None = None
    headcount: int | None = Field(default=None, ge=1, le=500)
    roles_composition_text: str | None = None
    specialization: str | None = None
    past_objects_note: str | None = None
    regions_text: str | None = None
    has_tools: bool | None = None
    has_transport: bool | None = None
    avg_price_note: str | None = None
    availability_note: str | None = None
    bio: str | None = None
    portfolio_note: str | None = None
    avatar_url: str | None = None
