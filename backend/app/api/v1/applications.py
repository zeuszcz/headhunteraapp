import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import JobApplication
from app.schemas.job_application import (
    JobApplicationCreate,
    JobApplicationRead,
    JobApplicationUpdate,
)

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("", response_model=list[JobApplicationRead])
async def list_applications(
    session: AsyncSession = Depends(get_db),
) -> list[JobApplication]:
    result = await session.execute(select(JobApplication).order_by(JobApplication.applied_at.desc()))
    return list(result.scalars().all())


@router.post("", response_model=JobApplicationRead, status_code=status.HTTP_201_CREATED)
async def create_application(
    payload: JobApplicationCreate,
    session: AsyncSession = Depends(get_db),
) -> JobApplication:
    row = JobApplication(
        company_name=payload.company_name,
        role_title=payload.role_title,
        status=payload.status,
        notes=payload.notes,
    )
    session.add(row)
    await session.flush()
    await session.refresh(row)
    return row


@router.get("/{application_id}", response_model=JobApplicationRead)
async def get_application(
    application_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
) -> JobApplication:
    row = await session.get(JobApplication, application_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return row


@router.patch("/{application_id}", response_model=JobApplicationRead)
async def update_application(
    application_id: uuid.UUID,
    payload: JobApplicationUpdate,
    session: AsyncSession = Depends(get_db),
) -> JobApplication:
    row = await session.get(JobApplication, application_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Application not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(row, k, v)
    row.updated_at = datetime.now(timezone.utc)
    await session.flush()
    await session.refresh(row)
    return row


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(
    application_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
) -> None:
    row = await session.get(JobApplication, application_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Application not found")
    await session.delete(row)
