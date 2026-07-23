"""make_datetime_columns_timezone_aware

Revision ID: a3f7c9d2e841
Revises: e6adc3b1cd97
Create Date: 2026-07-23 16:13:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3f7c9d2e841'
down_revision: Union[str, Sequence[str], None] = 'e6adc3b1cd97'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Alter all DateTime columns to TIMESTAMP WITH TIME ZONE.

    On PostgreSQL this changes the column type from `timestamp` to `timestamptz`.
    On SQLite this is a no-op because SQLite stores datetimes as text regardless,
    but we use batch_alter_table so the migration still runs cleanly.
    """
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == "postgresql":
        # Postgres supports ALTER COLUMN TYPE directly; much faster than recreating tables.
        # Existing naive timestamps are interpreted as UTC by Postgres when converting
        # from `timestamp` to `timestamptz` (server timezone is UTC on Supabase).

        # --- users ---
        op.alter_column('users', 'created_at',
                        existing_type=sa.DateTime(),
                        type_=sa.DateTime(timezone=True),
                        existing_nullable=True)

        # --- events ---
        op.alter_column('events', 'event_datetime',
                        existing_type=sa.DateTime(),
                        type_=sa.DateTime(timezone=True),
                        existing_nullable=True)
        op.alter_column('events', 'created_at',
                        existing_type=sa.DateTime(),
                        type_=sa.DateTime(timezone=True),
                        existing_nullable=True)

        # --- registrations ---
        op.alter_column('registrations', 'registered_at',
                        existing_type=sa.DateTime(),
                        type_=sa.DateTime(timezone=True),
                        existing_nullable=True)

        # --- tickets ---
        op.alter_column('tickets', 'check_in_time',
                        existing_type=sa.DateTime(),
                        type_=sa.DateTime(timezone=True),
                        existing_nullable=True)
        op.alter_column('tickets', 'created_at',
                        existing_type=sa.DateTime(),
                        type_=sa.DateTime(timezone=True),
                        existing_nullable=True)

        # --- saved_events ---
        op.alter_column('saved_events', 'saved_at',
                        existing_type=sa.DateTime(),
                        type_=sa.DateTime(timezone=True),
                        existing_nullable=True)

        # --- chat_sessions ---
        op.alter_column('chat_sessions', 'created_at',
                        existing_type=sa.DateTime(),
                        type_=sa.DateTime(timezone=True),
                        existing_nullable=True)

        # --- chat_messages ---
        op.alter_column('chat_messages', 'created_at',
                        existing_type=sa.DateTime(),
                        type_=sa.DateTime(timezone=True),
                        existing_nullable=True)
    else:
        # SQLite: DateTime(timezone=True) has no effect on the storage format,
        # but we run batch_alter_table so Alembic's metadata stays consistent.
        tables_columns = [
            ('users', 'created_at'),
            ('events', 'event_datetime'),
            ('events', 'created_at'),
            ('registrations', 'registered_at'),
            ('tickets', 'check_in_time'),
            ('tickets', 'created_at'),
            ('saved_events', 'saved_at'),
            ('chat_sessions', 'created_at'),
            ('chat_messages', 'created_at'),
        ]
        # Group by table to minimise batch operations
        from itertools import groupby
        for table, cols in groupby(tables_columns, key=lambda x: x[0]):
            with op.batch_alter_table(table) as batch_op:
                for _, column in cols:
                    batch_op.alter_column(
                        column,
                        existing_type=sa.DateTime(),
                        type_=sa.DateTime(timezone=True),
                    )


def downgrade() -> None:
    """Revert all DateTime columns back to timezone-naive."""
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == "postgresql":
        op.alter_column('chat_messages', 'created_at',
                        existing_type=sa.DateTime(timezone=True),
                        type_=sa.DateTime(),
                        existing_nullable=True)
        op.alter_column('chat_sessions', 'created_at',
                        existing_type=sa.DateTime(timezone=True),
                        type_=sa.DateTime(),
                        existing_nullable=True)
        op.alter_column('saved_events', 'saved_at',
                        existing_type=sa.DateTime(timezone=True),
                        type_=sa.DateTime(),
                        existing_nullable=True)
        op.alter_column('tickets', 'created_at',
                        existing_type=sa.DateTime(timezone=True),
                        type_=sa.DateTime(),
                        existing_nullable=True)
        op.alter_column('tickets', 'check_in_time',
                        existing_type=sa.DateTime(timezone=True),
                        type_=sa.DateTime(),
                        existing_nullable=True)
        op.alter_column('registrations', 'registered_at',
                        existing_type=sa.DateTime(timezone=True),
                        type_=sa.DateTime(),
                        existing_nullable=True)
        op.alter_column('events', 'created_at',
                        existing_type=sa.DateTime(timezone=True),
                        type_=sa.DateTime(),
                        existing_nullable=True)
        op.alter_column('events', 'event_datetime',
                        existing_type=sa.DateTime(timezone=True),
                        type_=sa.DateTime(),
                        existing_nullable=True)
        op.alter_column('users', 'created_at',
                        existing_type=sa.DateTime(timezone=True),
                        type_=sa.DateTime(),
                        existing_nullable=True)
    else:
        tables_columns = [
            ('chat_messages', 'created_at'),
            ('chat_sessions', 'created_at'),
            ('saved_events', 'saved_at'),
            ('tickets', 'created_at'),
            ('tickets', 'check_in_time'),
            ('registrations', 'registered_at'),
            ('events', 'created_at'),
            ('events', 'event_datetime'),
            ('users', 'created_at'),
        ]
        from itertools import groupby
        for table, cols in groupby(tables_columns, key=lambda x: x[0]):
            with op.batch_alter_table(table) as batch_op:
                for _, column in cols:
                    batch_op.alter_column(
                        column,
                        existing_type=sa.DateTime(timezone=True),
                        type_=sa.DateTime(),
                    )
