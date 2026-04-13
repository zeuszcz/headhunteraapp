import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class ObjectResponse(Base):
    """Отклик исполнителя на объект (предложение с условиями)."""

    __tablename__ = "object_responses"
    __table_args__ = (UniqueConstraint("object_id", "applicant_user_id", name="uq_response_per_user_object"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    object_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("work_objects.id", ondelete="CASCADE"),
        index=True,
    )
    applicant_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    applicant_kind: Mapped[str] = mapped_column(String(16))
    proposed_price_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    proposed_timeline_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    message_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="pending", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    work_object = relationship("WorkObject", back_populates="responses")
