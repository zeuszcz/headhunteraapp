import uuid
from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class WorkObject(Base):
    __tablename__ = "work_objects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255))
    address_or_region: Mapped[str | None] = mapped_column(String(512), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    work_type: Mapped[str | None] = mapped_column(String(255), nullable=True)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    duration_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    workers_needed: Mapped[int] = mapped_column(Integer, default=1)
    brigades_needed: Mapped[int] = mapped_column(Integer, default=0)
    required_skills_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    conditions_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    payment_format: Mapped[str | None] = mapped_column(String(128), nullable=True)
    payment_amount_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    urgency: Mapped[str | None] = mapped_column(String(64), nullable=True)
    contact_override: Mapped[str | None] = mapped_column(Text, nullable=True)
    cover_image_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="open", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    responses = relationship("ObjectResponse", back_populates="work_object", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="work_object", cascade="all, delete-orphan")
