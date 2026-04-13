from sqlalchemy.ext.asyncio import AsyncSession

from app.enums import UserRole
from app.models import BrigadeProfile, CompanyProfile, User, WorkerProfile
from app.schemas.profiles import BrigadeProfileRead, CompanyProfileRead, WorkerProfileRead


async def profile_payload(session: AsyncSession, user: User) -> dict:
    if user.role == UserRole.COMPANY.value:
        p = await session.get(CompanyProfile, user.id)
        if p is None:
            return {}
        return CompanyProfileRead.model_validate(p).model_dump()
    if user.role == UserRole.WORKER.value:
        p = await session.get(WorkerProfile, user.id)
        if p is None:
            return {}
        return WorkerProfileRead.model_validate(p).model_dump()
    if user.role == UserRole.BRIGADE.value:
        p = await session.get(BrigadeProfile, user.id)
        if p is None:
            return {}
        return BrigadeProfileRead.model_validate(p).model_dump()
    return {}
