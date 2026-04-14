import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    company_name: Mapped[str] = mapped_column(String(255), default="Новая компания")
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str | None] = mapped_column(String(128), nullable=True)
    regions_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    project_types: Mapped[str | None] = mapped_column(Text, nullable=True)
    years_on_market: Mapped[int | None] = mapped_column(Integer, nullable=True)
    contact_person: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(64), nullable=True)
    messengers_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    email_public: Mapped[str | None] = mapped_column(String(320), nullable=True)
    cooperation_terms: Mapped[str | None] = mapped_column(Text, nullable=True)
    avg_budget_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    payment_methods_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    media_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    rating_avg: Mapped[float] = mapped_column(Float, default=0.0)
    reviews_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="company_profile")
