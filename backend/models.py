from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    name = Column(String)
    department = Column(String)
    year = Column(String)
    interests = Column(Text)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    registrations = relationship(
        "Registration",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    saved_events = relationship(
        "SavedEvent",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text)
    venue = Column(String)
    category = Column(String)
    datetime = Column(DateTime)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    registrations = relationship(
        "Registration",
        back_populates="event",
        cascade="all, delete-orphan",
    )

    saved_by_users = relationship(
        "SavedEvent",
        back_populates="event",
        cascade="all, delete-orphan",
    )


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    event_id = Column(
        Integer,
        ForeignKey("events.id"),
        nullable=False,
        index=True,
    )

    registered_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    user = relationship(
        "User",
        back_populates="registrations",
    )

    event = relationship(
        "Event",
        back_populates="registrations",
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "event_id",
            name="_user_event_registration_uc",
        ),
    )


class SavedEvent(Base):
    __tablename__ = "saved_events"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    event_id = Column(
        Integer,
        ForeignKey("events.id"),
        nullable=False,
        index=True,
    )

    saved_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    user = relationship(
        "User",
        back_populates="saved_events",
    )

    event = relationship(
        "Event",
        back_populates="saved_by_users",
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "event_id",
            name="_user_event_save_uc",
        ),
    )


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(
        String,
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    messages = relationship(
        "ChatMessage",
        back_populates="session",
        cascade="all, delete-orphan",
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        String,
        ForeignKey("chat_sessions.id"),
        index=True,
    )

    role = Column(String)
    content = Column(Text)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    session = relationship(
        "ChatSession",
        back_populates="messages",
    )