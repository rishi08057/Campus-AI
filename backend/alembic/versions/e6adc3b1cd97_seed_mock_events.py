"""seed_mock_events

Revision ID: e6adc3b1cd97
Revises: 0d6fa483772d
Create Date: 2026-07-22 14:38:15.932207

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e6adc3b1cd97'
down_revision: Union[str, Sequence[str], None] = '0d6fa483772d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


from datetime import datetime, timezone

def upgrade() -> None:
    """Seed mock events using dialect-agnostic approach."""
    events_table = sa.table(
        'events',
        sa.column('id', sa.Integer),
        sa.column('title', sa.String),
        sa.column('description', sa.Text),
        sa.column('venue', sa.String),
        sa.column('category', sa.String),
        sa.column('event_datetime', sa.DateTime(timezone=True)),
        sa.column('created_at', sa.DateTime(timezone=True)),
    )

    seed_rows = [
        {
            "id": 1,
            "title": "AI Workshop",
            "description": "A hands-on workshop exploring practical AI tools for students.",
            "venue": "Innovation Lab",
            "category": "Workshop",
            "event_datetime": datetime(2026, 10, 15, 14, 0, 0, tzinfo=timezone.utc),
            "created_at": datetime.now(timezone.utc),
        },
        {
            "id": 2,
            "title": "Hackathon",
            "description": "A student hackathon focused on building useful campus apps.",
            "venue": "Main Auditorium",
            "category": "Competition",
            "event_datetime": datetime(2026, 11, 20, 9, 30, 0, tzinfo=timezone.utc),
            "created_at": datetime.now(timezone.utc),
        },
    ]

    bind = op.get_bind()
    dialect_name = bind.dialect.name

    if dialect_name == "postgresql":
        # Use Postgres-native INSERT ... ON CONFLICT DO NOTHING
        from sqlalchemy.dialects.postgresql import insert as pg_insert
        stmt = pg_insert(events_table).values(seed_rows).on_conflict_do_nothing(
            index_elements=["id"]
        )
        bind.execute(stmt)
    else:
        # Fallback for SQLite or other dialects: query-then-conditionally-insert
        for row in seed_rows:
            exists = bind.execute(
                sa.select(events_table.c.id).where(events_table.c.id == row["id"])
            ).fetchone()
            if not exists:
                bind.execute(events_table.insert().values(**row))


def downgrade() -> None:
    """Remove seeded mock events."""
    events_table = sa.table(
        'events',
        sa.column('id', sa.Integer),
    )
    op.execute(events_table.delete().where(events_table.c.id.in_([1, 2])))
