import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class BrigadeProfile(Base):
    __tablename__ = "brigade_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    name: Mapped[str] = mapped_column(String(255), default="Бригада")
    leader_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    headcount: Mapped[int] = mapped_column(Integer, default=1)
    roles_composition_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    specialization: Mapped[str | None] = mapped_column(String(255), nullable=True)
    past_objects_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    regions_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    has_tools: Mapped[bool] = mapped_column(Boolean, default=False)
    has_transport: Mapped[bool] = mapped_column(Boolean, default=False)
    avg_price_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    availability_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    portfolio_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    rating_avg: Mapped[float] = mapped_column(Float, default=0.0)
    reviews_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="brigade_profile")
