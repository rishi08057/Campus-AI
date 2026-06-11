from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from ..data.mock_events import MOCK_EVENTS
from ..schemas.event import Event, EventRegistration, EventRegistrationResponse, EventSave, EventSaveResponse
from ..dependencies import get_current_user
from ..database import get_db
from ..models import User, Registration, SavedEvent

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[Event])
def read_events() -> list[Event]:
    # Public endpoint returning mock events
    return MOCK_EVENTS

@router.post("/register", response_model=EventRegistrationResponse)
def register_for_event(
    registration_in: EventRegistration, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> EventRegistrationResponse:
    # Validate event existence
    event_exists = any(event.id == registration_in.eventId for event in MOCK_EVENTS)
    if not event_exists:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if already registered in DB
    existing_reg = db.query(Registration).filter(
        Registration.user_id == current_user.id,
        Registration.event_id == registration_in.eventId
    ).first()

    if existing_reg:
        return EventRegistrationResponse(
            message="User already registered for this event",
            success=False,
            registration=registration_in
        )

    # Store registration in DB
    new_reg = Registration(
        user_id=current_user.id,
        event_id=registration_in.eventId
    )
    db.add(new_reg)
    db.commit()

    return EventRegistrationResponse(
        message="Successfully registered for the event",
        success=True,
        registration=registration_in
    )

@router.post("/save", response_model=EventSaveResponse)
def save_event(
    save_req: EventSave, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> EventSaveResponse:
    # Validate event existence
    event_exists = any(event.id == save_req.eventId for event in MOCK_EVENTS)
    if not event_exists:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if already saved in DB
    existing_save = db.query(SavedEvent).filter(
        SavedEvent.user_id == current_user.id,
        SavedEvent.event_id == save_req.eventId
    ).first()

    if existing_save:
        # Toggle: If already saved, unsave it (delete from DB)
        db.delete(existing_save)
        db.commit()
        return EventSaveResponse(
            message="Event removed from saved list",
            success=True,
            saved=False,
            eventId=save_req.eventId
        )

    # Store saved event in DB
    new_save = SavedEvent(
        user_id=current_user.id,
        event_id=save_req.eventId
    )
    db.add(new_save)
    db.commit()

    return EventSaveResponse(
        message="Event saved successfully",
        success=True,
        saved=True,
        eventId=save_req.eventId
    )

@router.get("/saved", response_model=list[Event])
def get_saved_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> list[Event]:
    # Get IDs of saved events from DB
    saved_records = db.query(SavedEvent).filter(SavedEvent.user_id == current_user.id).all()
    saved_ids = [s.event_id for s in saved_records]
    # Return full event objects from mock data
    return [e for e in MOCK_EVENTS if e.id in saved_ids]

@router.get("/registered", response_model=list[Event])
def get_registered_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> list[Event]:
    # Get IDs of events the user is registered for from DB
    registered_records = db.query(Registration).filter(Registration.user_id == current_user.id).all()
    registered_ids = [r.event_id for r in registered_records]
    # Return full event objects from mock data
    return [e for e in MOCK_EVENTS if e.id in registered_ids]