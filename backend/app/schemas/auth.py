import uuid
from typing import Any

from pydantic import BaseModel, EmailStr, Field

from app.enums import UserRole


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    role: UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserMeResponse(BaseModel):
    id: uuid.UUID
    email: str
    role: str
    profile: dict[str, Any]
    organization_id: uuid.UUID | None = None
    is_platform_admin: bool = False
