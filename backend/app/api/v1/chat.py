import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import get_current_user
from app.enums import UserRole
from app.models import Conversation, Message, User, WorkObject
from app.schemas.chat import ConversationCreate, ConversationRead, MessageCreate, MessageRead

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/conversations", response_model=list[ConversationRead])
async def list_conversations(
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> list[Conversation]:
    result = await session.execute(
        select(Conversation)
        .where(
            or_(
                Conversation.company_user_id == user.id,
                Conversation.participant_user_id == user.id,
            )
        )
        .order_by(Conversation.created_at.desc())
    )
    return list(result.scalars().all())


@router.post("/conversations", response_model=ConversationRead, status_code=201)
async def get_or_create_conversation(
    payload: ConversationCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> Conversation:
    obj = await session.get(WorkObject, payload.work_object_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="Объект не найден")

    company_id = obj.company_user_id
    participant_id: uuid.UUID

    if user.role == UserRole.COMPANY.value:
        if user.id != company_id:
            raise HTTPException(status_code=403, detail="Только владелец объекта")
        if not payload.peer_user_id:
            raise HTTPException(status_code=400, detail="Укажите peer_user_id (исполнитель)")
        participant_id = payload.peer_user_id
    else:
        participant_id = user.id
        if participant_id == company_id:
            raise HTTPException(status_code=400, detail="Некорректный участник")

    existing = await session.execute(
        select(Conversation).where(
            Conversation.work_object_id == obj.id,
            Conversation.participant_user_id == participant_id,
        )
    )
    hit = existing.scalar_one_or_none()
    if hit:
        return hit

    row = Conversation(
        work_object_id=obj.id,
        company_user_id=company_id,
        participant_user_id=participant_id,
    )
    session.add(row)
    await session.flush()
    await session.refresh(row)
    return row


@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageRead])
async def list_messages(
    conversation_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> list[Message]:
    conv = await session.get(Conversation, conversation_id)
    if conv is None:
        raise HTTPException(status_code=404, detail="Чат не найден")
    if user.id not in (conv.company_user_id, conv.participant_user_id):
        raise HTTPException(status_code=403, detail="Нет доступа")
    result = await session.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    )
    return list(result.scalars().all())


@router.post("/conversations/{conversation_id}/messages", response_model=MessageRead, status_code=201)
async def post_message(
    conversation_id: uuid.UUID,
    payload: MessageCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> Message:
    conv = await session.get(Conversation, conversation_id)
    if conv is None:
        raise HTTPException(status_code=404, detail="Чат не найден")
    if user.id not in (conv.company_user_id, conv.participant_user_id):
        raise HTTPException(status_code=403, detail="Нет доступа")
    msg = Message(
        conversation_id=conversation_id,
        sender_user_id=user.id,
        body=payload.body.strip(),
    )
    session.add(msg)
    await session.flush()
    await session.refresh(msg)
    return msg
