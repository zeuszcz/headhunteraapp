"""API-ключи и webhooks (заготовка под интеграции)."""

import hashlib
import secrets
import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import get_current_user
from app.models import User
from app.models.enterprise import ApiKey, WebhookSubscription

router = APIRouter(prefix="/integrations", tags=["integrations"])


class ApiKeyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=128)


class ApiKeyCreated(BaseModel):
    id: uuid.UUID
    name: str
    key: str
    key_prefix: str


class ApiKeyRead(BaseModel):
    id: uuid.UUID
    name: str
    key_prefix: str


class WebhookCreate(BaseModel):
    url: str = Field(..., min_length=8, max_length=2048)
    events: str = Field(..., description="Список событий через запятую, напр. response.created,object.published")


class WebhookRead(BaseModel):
    id: uuid.UUID
    url: str
    events: str
    is_active: bool


def _hash(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


@router.post("/api-keys", response_model=ApiKeyCreated, status_code=201)
async def create_api_key(
    payload: ApiKeyCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> Any:
    raw = secrets.token_urlsafe(32)
    prefix = raw[:8]
    row = ApiKey(
        user_id=user.id,
        key_prefix=prefix,
        key_hash=_hash(raw),
        name=payload.name,
    )
    session.add(row)
    await session.flush()
    await session.refresh(row)
    return ApiKeyCreated(id=row.id, name=row.name, key=raw, key_prefix=prefix)


@router.get("/api-keys", response_model=list[ApiKeyRead])
async def list_api_keys(
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> Any:
    r = await session.execute(select(ApiKey).where(ApiKey.user_id == user.id).order_by(ApiKey.created_at.desc()))
    rows = list(r.scalars().all())
    return [ApiKeyRead(id=x.id, name=x.name, key_prefix=x.key_prefix) for x in rows]


@router.delete("/api-keys/{key_id}", status_code=204)
async def delete_api_key(
    key_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> None:
    row = await session.get(ApiKey, key_id)
    if row is None or row.user_id != user.id:
        raise HTTPException(status_code=404, detail="Ключ не найден")
    await session.delete(row)
    await session.flush()


@router.post("/webhooks", response_model=WebhookRead, status_code=201)
async def create_webhook(
    payload: WebhookCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> Any:
    secret = secrets.token_urlsafe(24)
    row = WebhookSubscription(
        user_id=user.id,
        url=payload.url,
        secret_hash=_hash(secret),
        events=payload.events,
    )
    session.add(row)
    await session.flush()
    await session.refresh(row)
    return WebhookRead(id=row.id, url=row.url, events=row.events, is_active=row.is_active)


@router.get("/webhooks", response_model=list[WebhookRead])
async def list_webhooks(
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> Any:
    r = await session.execute(
        select(WebhookSubscription).where(WebhookSubscription.user_id == user.id)
    )
    rows = list(r.scalars().all())
    return [WebhookRead(id=w.id, url=w.url, events=w.events, is_active=w.is_active) for w in rows]
