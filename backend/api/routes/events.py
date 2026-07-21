from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import uuid

from ...schemas.event import (
    Event,
    EventRegistration,
    EventRegistrationResponse,
    EventSave,
    EventSaveResponse,
)
from ...dependencies import get_current_user
from ...database import get_db
from ...models import (
    User,
    Registration,
    SavedEvent,
    Ticket,
    Event as DBEvent,
)

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[Event])
def read_events(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
) -> list[Event]:
    return db.query(DBEvent).offset(skip).limit(limit).all()


@router.post("/register", response_model=EventRegistrationResponse)
def register_for_event(
    registration_in: EventRegistration,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> EventRegistrationResponse:

    # Validate event exists in PostgreSQL
    db_event = (
        db.query(DBEvent)
        .filter(DBEvent.id == registration_in.eventId)
        .first()
    )

    if not db_event:
        raise HTTPException(
            status_code=404,
            detail="Event not found",
        )

    from datetime import datetime, timezone
    if db_event.datetime and db_event.datetime.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return EventRegistrationResponse(
            message="Cannot register for an event that has already occurred",
            success=False,
            registration=registration_in,
        )

    # Check if already registered
    existing_reg = (
        db.query(Registration)
        .filter(
            Registration.user_id == current_user.id,
            Registration.event_id == registration_in.eventId,
        )
        .first()
    )

    if existing_reg:
        return EventRegistrationResponse(
            message="User already registered for this event",
            success=False,
            registration=registration_in,
        )

    # Create registration
    new_reg = Registration(
        user_id=current_user.id,
        event_id=registration_in.eventId,
    )

    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)

    # Create ticket
    ticket_id = str(uuid.uuid4())

    new_ticket = Ticket(
        ticket_id=ticket_id,
        registration_id=new_reg.id,
        qr_code_url=f"/tickets/{ticket_id}/qr",
    )

    db.add(new_ticket)
    db.commit()

    return EventRegistrationResponse(
        message="Successfully registered for the event",
        success=True,
        registration=registration_in,
    )


@router.post("/save", response_model=EventSaveResponse)
def save_event(
    save_req: EventSave,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> EventSaveResponse:

    # Validate event exists in PostgreSQL
    db_event = (
        db.query(DBEvent)
        .filter(DBEvent.id == save_req.eventId)
        .first()
    )

    if not db_event:
        raise HTTPException(
            status_code=404,
            detail="Event not found",
        )

    existing_save = (
        db.query(SavedEvent)
        .filter(
            SavedEvent.user_id == current_user.id,
            SavedEvent.event_id == save_req.eventId,
        )
        .first()
    )

    # Toggle save/unsave
    if existing_save:
        db.delete(existing_save)
        db.commit()

        return EventSaveResponse(
            message="Event removed from saved list",
            success=True,
            saved=False,
            eventId=save_req.eventId,
        )

    new_save = SavedEvent(
        user_id=current_user.id,
        event_id=save_req.eventId,
    )

    db.add(new_save)
    db.commit()

    return EventSaveResponse(
        message="Event saved successfully",
        success=True,
        saved=True,
        eventId=save_req.eventId,
    )


@router.get("/saved", response_model=list[Event])
def get_saved_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Event]:

    saved_records = (
        db.query(SavedEvent)
        .filter(
            SavedEvent.user_id == current_user.id
        )
        .all()
    )

    saved_ids = [
        record.event_id
        for record in saved_records
    ]

    if not saved_ids:
        return []

    events = (
        db.query(DBEvent)
        .filter(DBEvent.id.in_(saved_ids))
        .all()
    )

    return events


@router.get("/registered", response_model=list[Event])
def get_registered_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Event]:

    registered_records = (
        db.query(Registration)
        .filter(
            Registration.user_id == current_user.id
        )
        .all()
    )

    registered_ids = [
        record.event_id
        for record in registered_records
    ]

    if not registered_ids:
        return []

    events = (
        db.query(DBEvent)
        .filter(DBEvent.id.in_(registered_ids))
        .all()
    )

    return events