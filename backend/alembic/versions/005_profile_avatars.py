"""company/worker/brigade profiles: avatar_url

Revision ID: 005
Revises: 004
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("company_profiles", sa.Column("avatar_url", sa.String(length=1024), nullable=True))
    op.add_column("worker_profiles", sa.Column("avatar_url", sa.String(length=1024), nullable=True))
    op.add_column("brigade_profiles", sa.Column("avatar_url", sa.String(length=1024), nullable=True))


def downgrade() -> None:
    op.drop_column("brigade_profiles", "avatar_url")
    op.drop_column("worker_profiles", "avatar_url")
    op.drop_column("company_profiles", "avatar_url")
