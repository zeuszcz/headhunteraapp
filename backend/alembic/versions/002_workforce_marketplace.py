"""workforce marketplace schema

Revision ID: 002
Revises: 001
Create Date: 2026-04-13

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(sa.text("DROP TABLE IF EXISTS job_applications CASCADE"))

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=32), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_role", "users", ["role"], unique=False)

    op.create_table(
        "company_profiles",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("city", sa.String(length=128), nullable=True),
        sa.Column("regions_text", sa.Text(), nullable=True),
        sa.Column("project_types", sa.Text(), nullable=True),
        sa.Column("years_on_market", sa.Integer(), nullable=True),
        sa.Column("contact_person", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=64), nullable=True),
        sa.Column("messengers_text", sa.Text(), nullable=True),
        sa.Column("email_public", sa.String(length=320), nullable=True),
        sa.Column("cooperation_terms", sa.Text(), nullable=True),
        sa.Column("avg_budget_note", sa.Text(), nullable=True),
        sa.Column("payment_methods_text", sa.Text(), nullable=True),
        sa.Column("media_note", sa.Text(), nullable=True),
        sa.Column("rating_avg", sa.Float(), nullable=False),
        sa.Column("reviews_count", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id"),
    )

    op.create_table(
        "worker_profiles",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("profession", sa.String(length=255), nullable=True),
        sa.Column("specialization", sa.String(length=255), nullable=True),
        sa.Column("experience_years", sa.Integer(), nullable=True),
        sa.Column("skills_text", sa.Text(), nullable=True),
        sa.Column("city", sa.String(length=128), nullable=True),
        sa.Column("willing_to_travel", sa.Boolean(), nullable=False),
        sa.Column("desired_rate_note", sa.Text(), nullable=True),
        sa.Column("work_format", sa.String(length=64), nullable=True),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("documents_note", sa.Text(), nullable=True),
        sa.Column("portfolio_note", sa.Text(), nullable=True),
        sa.Column("rating_avg", sa.Float(), nullable=False),
        sa.Column("reviews_count", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id"),
    )

    op.create_table(
        "brigade_profiles",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("leader_name", sa.String(length=255), nullable=True),
        sa.Column("headcount", sa.Integer(), nullable=False),
        sa.Column("roles_composition_text", sa.Text(), nullable=True),
        sa.Column("specialization", sa.String(length=255), nullable=True),
        sa.Column("past_objects_note", sa.Text(), nullable=True),
        sa.Column("regions_text", sa.Text(), nullable=True),
        sa.Column("has_tools", sa.Boolean(), nullable=False),
        sa.Column("has_transport", sa.Boolean(), nullable=False),
        sa.Column("avg_price_note", sa.Text(), nullable=True),
        sa.Column("availability_note", sa.Text(), nullable=True),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("portfolio_note", sa.Text(), nullable=True),
        sa.Column("rating_avg", sa.Float(), nullable=False),
        sa.Column("reviews_count", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id"),
    )

    op.create_table(
        "work_objects",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("company_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("address_or_region", sa.String(length=512), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("work_type", sa.String(length=255), nullable=True),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("duration_days", sa.Integer(), nullable=True),
        sa.Column("workers_needed", sa.Integer(), nullable=False),
        sa.Column("brigades_needed", sa.Integer(), nullable=False),
        sa.Column("required_skills_text", sa.Text(), nullable=True),
        sa.Column("conditions_text", sa.Text(), nullable=True),
        sa.Column("payment_format", sa.String(length=128), nullable=True),
        sa.Column("payment_amount_note", sa.Text(), nullable=True),
        sa.Column("urgency", sa.String(length=64), nullable=True),
        sa.Column("contact_override", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["company_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_work_objects_company_user_id", "work_objects", ["company_user_id"], unique=False)
    op.create_index("ix_work_objects_status", "work_objects", ["status"], unique=False)

    op.create_table(
        "object_responses",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("object_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("applicant_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("applicant_kind", sa.String(length=16), nullable=False),
        sa.Column("proposed_price_note", sa.Text(), nullable=True),
        sa.Column("proposed_timeline_text", sa.Text(), nullable=True),
        sa.Column("message_text", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["applicant_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["object_id"], ["work_objects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("object_id", "applicant_user_id", name="uq_response_per_user_object"),
    )
    op.create_index("ix_object_responses_object_id", "object_responses", ["object_id"], unique=False)
    op.create_index("ix_object_responses_applicant_user_id", "object_responses", ["applicant_user_id"], unique=False)
    op.create_index("ix_object_responses_status", "object_responses", ["status"], unique=False)

    op.create_table(
        "conversations",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("work_object_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("company_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("participant_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["company_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["participant_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["work_object_id"], ["work_objects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("work_object_id", "participant_user_id", name="uq_conversation_object_participant"),
    )
    op.create_index("ix_conversations_work_object_id", "conversations", ["work_object_id"], unique=False)
    op.create_index("ix_conversations_participant_user_id", "conversations", ["participant_user_id"], unique=False)

    op.create_table(
        "messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("conversation_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("sender_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["conversation_id"], ["conversations.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["sender_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_messages_conversation_id", "messages", ["conversation_id"], unique=False)

    op.create_table(
        "reviews",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("reviewer_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("target_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("work_object_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["reviewer_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["target_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["work_object_id"], ["work_objects.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "reviewer_user_id",
            "target_user_id",
            "work_object_id",
            name="uq_review_once_per_object",
        ),
    )
    op.create_index("ix_reviews_reviewer_user_id", "reviews", ["reviewer_user_id"], unique=False)
    op.create_index("ix_reviews_target_user_id", "reviews", ["target_user_id"], unique=False)


def downgrade() -> None:
    op.drop_table("reviews")
    op.drop_table("messages")
    op.drop_table("conversations")
    op.drop_table("object_responses")
    op.drop_table("work_objects")
    op.drop_table("brigade_profiles")
    op.drop_table("worker_profiles")
    op.drop_table("company_profiles")
    op.drop_table("users")

    op.create_table(
        "job_applications",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=False),
        sa.Column("role_title", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("applied_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
