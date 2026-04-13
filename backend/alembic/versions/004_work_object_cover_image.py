"""work_objects: cover_image_url for card visuals

Revision ID: 004
Revises: 003
Create Date: 2026-04-13

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "work_objects",
        sa.Column("cover_image_url", sa.String(length=1024), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("work_objects", "cover_image_url")
