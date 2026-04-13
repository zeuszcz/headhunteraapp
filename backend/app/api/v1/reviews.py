import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import get_current_user
from app.models import Review, User
from app.schemas.reviews import ReviewCreate, ReviewRead
from app.services.rating import refresh_target_rating

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("", response_model=ReviewRead, status_code=201)
async def create_review(
    payload: ReviewCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db),
) -> Review:
    if payload.target_user_id == user.id:
        raise HTTPException(status_code=400, detail="Нельзя оставить отзыв самому себе")
    target = await session.get(User, payload.target_user_id)
    if target is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    row = Review(
        reviewer_user_id=user.id,
        target_user_id=payload.target_user_id,
        work_object_id=payload.work_object_id,
        rating=payload.rating,
        comment=payload.comment,
    )
    session.add(row)
    try:
        await session.flush()
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Отзыв уже существует или данные некорректны") from None

    await refresh_target_rating(session, payload.target_user_id)
    await session.refresh(row)
    return row


@router.get("/users/{user_id}", response_model=list[ReviewRead])
async def list_reviews_for_user(
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
) -> list[Review]:
    result = await session.execute(
        select(Review)
        .where(Review.target_user_id == user_id)
        .order_by(Review.created_at.desc())
    )
    return list(result.scalars().all())
