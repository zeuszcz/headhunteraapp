from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.enums import UserRole
from app.models import BrigadeProfile, CompanyProfile, Review, User, WorkerProfile


async def refresh_target_rating(session: AsyncSession, target_user_id) -> None:
    result = await session.execute(
        select(func.avg(Review.rating), func.count(Review.id)).where(Review.target_user_id == target_user_id)
    )
    row = result.one()
    avg = float(row[0] or 0)
    cnt = int(row[1] or 0)

    user = await session.get(User, target_user_id)
    if user is None:
        return
    if user.role == UserRole.COMPANY.value:
        p = await session.get(CompanyProfile, target_user_id)
        if p:
            p.rating_avg = round(avg, 2)
            p.reviews_count = cnt
    elif user.role == UserRole.WORKER.value:
        p = await session.get(WorkerProfile, target_user_id)
        if p:
            p.rating_avg = round(avg, 2)
            p.reviews_count = cnt
    elif user.role == UserRole.BRIGADE.value:
        p = await session.get(BrigadeProfile, target_user_id)
        if p:
            p.rating_avg = round(avg, 2)
            p.reviews_count = cnt
