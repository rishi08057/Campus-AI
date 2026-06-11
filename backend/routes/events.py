from fastapi import APIRouter, HTTPException

from ..data.mock_events import MOCK_EVENTS
from ..schemas.event import Event, EventRegistration, EventRegistrationResponse, EventSave, EventSaveResponse
from ..data.registrations import REGISTRATIONS, SAVED_EVENTS


router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[Event])
def read_events() -> list[Event]:
    # The API returns static fixtures for now so the frontend can integrate
    # against a stable, validated contract without waiting on persistence.
    return MOCK_EVENTS

@router.post("/register", response_model=EventRegistrationResponse)
def register_for_event(registration: EventRegistration) -> EventRegistrationResponse:
    # Validate event existence
    event_exists = any(event.id == registration.eventId for event in MOCK_EVENTS)
    if not event_exists:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if already registered
    already_registered = any(
        r.userId == registration.userId and r.eventId == registration.eventId 
        for r in REGISTRATIONS
    )
    
    if already_registered:
        return EventRegistrationResponse(
            message="User already registered for this event",
            success=False,
            registration=registration
        )

    # Store registration
    REGISTRATIONS.append(registration)
    
    return EventRegistrationResponse(
        message="Successfully registered for the event",
        success=True,
        registration=registration
    )

@router.post("/save", response_model=EventSaveResponse)
def save_event(save_req: EventSave) -> EventSaveResponse:
    # Validate event existence
    event_exists = any(event.id == save_req.eventId for event in MOCK_EVENTS)
    if not event_exists:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if already saved
    existing_save_idx = next(
        (i for i, s in enumerate(SAVED_EVENTS) 
         if s.userId == save_req.userId and s.eventId == save_req.eventId),
        None
    )
    
    if existing_save_idx is not None:
        # Toggle: If already saved, unsave it
        SAVED_EVENTS.pop(existing_save_idx)
        return EventSaveResponse(
            message="Event removed from saved list",
            success=True,
            saved=False,
            eventId=save_req.eventId
        )

    # Store saved event
    SAVED_EVENTS.append(save_req)
    
    return EventSaveResponse(
        message="Event saved successfully",
        success=True,
        saved=True,
        eventId=save_req.eventId
    )

@router.get("/saved", response_model=list[Event])
def get_saved_events(userId: int = 1) -> list[Event]:
    # Get IDs of saved events for the user
    saved_ids = [s.eventId for s in SAVED_EVENTS if s.userId == userId]
    # Return full event objects
    return [e for e in MOCK_EVENTS if e.id in saved_ids]

@router.get("/registered", response_model=list[Event])
def get_registered_events(userId: int = 1) -> list[Event]:
    """
    Retrieve full details of events the user has registered for.
    """
    # Get IDs of events the user is registered for
    registered_ids = [r.eventId for r in REGISTRATIONS if r.userId == userId]
    # Return full event objects
    return [e for e in MOCK_EVENTS if e.id in registered_ids]