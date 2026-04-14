"""Обогащение списка чатов: название объекта и имя собеседника."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.enums import UserRole
from app.models import BrigadeProfile, CompanyProfile, Conversation, User, WorkerProfile, WorkObject
from app.schemas.chat import ConversationRead


def _peer_user_id(conv: Conversation, viewer_id: uuid.UUID) -> uuid.UUID:
    return conv.participant_user_id if viewer_id == conv.company_user_id else conv.company_user_id


def _display_for_peer(
    user_by_id: dict[uuid.UUID, User],
    cp_by: dict[uuid.UUID, CompanyProfile],
    wp_by: dict[uuid.UUID, WorkerProfile],
    bp_by: dict[uuid.UUID, BrigadeProfile],
    peer_id: uuid.UUID,
) -> tuple[str, str]:
    u = user_by_id.get(peer_id)
    if not u:
        return ("Участник", "unknown")
    if u.role == UserRole.COMPANY.value:
        p = cp_by.get(peer_id)
        name = (p.company_name if p and p.company_name else None) or "Компания"
        return (name, "company")
    if u.role == UserRole.WORKER.value:
        p = wp_by.get(peer_id)
        name = (p.full_name if p and p.full_name else None) or "Работник"
        return (name, "worker")
    if u.role == UserRole.BRIGADE.value:
        p = bp_by.get(peer_id)
        name = (p.name if p and p.name else None) or "Бригада"
        return (name, "brigade")
    return ("Участник", "unknown")


async def enrich_conversations(
    session: AsyncSession,
    conversations: list[Conversation],
    viewer_id: uuid.UUID,
) -> list[ConversationRead]:
    if not conversations:
        return []

    wo_ids = [c.work_object_id for c in conversations]
    wo_rows = (await session.execute(select(WorkObject).where(WorkObject.id.in_(wo_ids)))).scalars().all()
    wo_by_id = {w.id: w for w in wo_rows}

    peer_ids = {_peer_user_id(c, viewer_id) for c in conversations}
    users = (await session.execute(select(User).where(User.id.in_(peer_ids)))).scalars().all()
    user_by_id = {u.id: u for u in users}

    cp_rows = (await session.execute(select(CompanyProfile).where(CompanyProfile.user_id.in_(peer_ids)))).scalars().all()
    cp_by = {p.user_id: p for p in cp_rows}
    wp_rows = (await session.execute(select(WorkerProfile).where(WorkerProfile.user_id.in_(peer_ids)))).scalars().all()
    wp_by = {p.user_id: p for p in wp_rows}
    bp_rows = (await session.execute(select(BrigadeProfile).where(BrigadeProfile.user_id.in_(peer_ids)))).scalars().all()
    bp_by = {p.user_id: p for p in bp_rows}

    out: list[ConversationRead] = []
    for c in conversations:
        wo = wo_by_id.get(c.work_object_id)
        pid = _peer_user_id(c, viewer_id)
        name, role = _display_for_peer(user_by_id, cp_by, wp_by, bp_by, pid)
        out.append(
            ConversationRead(
                id=c.id,
                work_object_id=c.work_object_id,
                company_user_id=c.company_user_id,
                participant_user_id=c.participant_user_id,
                created_at=c.created_at,
                work_object_title=wo.title if wo else None,
                peer_display_name=name,
                peer_role=role,
            )
        )
    return out
