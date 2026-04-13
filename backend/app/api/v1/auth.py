from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import get_current_user, get_user_by_email
from app.enums import UserRole
from app.models import BrigadeProfile, CompanyProfile, User, WorkerProfile
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserMeResponse
from app.security import create_access_token, hash_password, verify_password
from app.services.profiles import profile_payload

router = APIRouter(prefix="/auth", tags=["auth"])


class SecurityPatch(BaseModel):
    two_factor_enabled: bool


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


@router.post("/register", response_model=TokenResponse)
async def register(
    payload: RegisterRequest,
    session: AsyncSession = Depends(get_db),
) -> TokenResponse:
    existing = await get_user_by_email(session, str(payload.email))
    if existing:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    user = User(
        email=str(payload.email).lower().strip(),
        password_hash=hash_password(payload.password),
        role=payload.role.value,
    )
    session.add(user)
    await session.flush()

    if payload.role == UserRole.COMPANY:
        session.add(CompanyProfile(user_id=user.id))
    elif payload.role == UserRole.WORKER:
        session.add(WorkerProfile(user_id=user.id))
    else:
        session.add(BrigadeProfile(user_id=user.id))

    try:
        await session.flush()
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован") from None

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    session: AsyncSession = Depends(get_db),
) -> TokenResponse:
    user = await get_user_by_email(session, str(payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Аккаунт отключён")
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserMeResponse)
async def me(
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> UserMeResponse:
    prof = await profile_payload(session, user)
    return UserMeResponse(
        id=user.id,
        email=user.email,
        role=user.role,
        profile=prof,
        organization_id=user.organization_id,
        is_platform_admin=user.is_platform_admin,
    )


@router.get("/me/export")
async def export_my_data(
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Экспорт данных пользователя (политика хранения / GDPR-подобные сценарии)."""
    prof = await profile_payload(session, user)
    return {
        "user": {
            "id": str(user.id),
            "email": user.email,
            "role": user.role,
            "organization_id": str(user.organization_id) if user.organization_id else None,
            "two_factor_enabled": user.two_factor_enabled,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        },
        "profile": prof,
    }


@router.patch("/me/security")
async def patch_security_settings(
    payload: SecurityPatch,
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> dict[str, bool]:
    user.two_factor_enabled = payload.two_factor_enabled
    await session.flush()
    return {"two_factor_enabled": user.two_factor_enabled}


@router.patch("/me/password")
async def change_password(
    payload: PasswordChangeRequest,
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный текущий пароль")
    user.password_hash = hash_password(payload.new_password)
    await session.flush()
    return {"status": "ok"}
