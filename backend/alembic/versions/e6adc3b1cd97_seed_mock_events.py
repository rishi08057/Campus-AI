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
    """Upgrade schema."""
    events_table = sa.table(
        'events',
        sa.column('id', sa.Integer),
        sa.column('title', sa.String),
        sa.column('description', sa.Text),
        sa.column('venue', sa.String),
        sa.column('category', sa.String),
        sa.column('event_datetime', sa.DateTime),
        sa.column('created_at', sa.DateTime),
    )
    
    op.execute("""
        INSERT OR IGNORE INTO events (id, title, description, venue, category, event_datetime, created_at)
        VALUES 
        (1, 'AI Workshop', 'A hands-on workshop exploring practical AI tools for students.', 'Innovation Lab', 'Workshop', '2026-10-15 14:00:00.000000', CURRENT_TIMESTAMP),
        (2, 'Hackathon', 'A student hackathon focused on building useful campus apps.', 'Main Auditorium', 'Competition', '2026-11-20 09:30:00.000000', CURRENT_TIMESTAMP)
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DELETE FROM events WHERE id IN (1, 2)")
