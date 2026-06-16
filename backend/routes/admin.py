from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional
from pydantic import BaseModel

from ..database import get_db
from ..models import Event, Registration, Ticket
from ..data.mock_events import MOCK_EVENTS

router = APIRouter(prefix="/admin", tags=["admin"])

class EventStats(BaseModel):
    total_events: int
    total_registrations: int
    total_attendees: int
    most_popular_event: Optional[str] = None

@router.get("/stats", response_model=EventStats)
def get_admin_stats(db: Session = Depends(get_db)):
    """
    Get high-level analytics for the admin dashboard.
    """
    # Total events (using MOCK_EVENTS for now as that's where events are stored)
    total_events = len(MOCK_EVENTS)
    
    # Total registrations
    total_registrations = db.query(Registration).count()
    
    # Total attendees (where is_checked_in == 1)
    total_attendees = db.query(Ticket).filter(Ticket.is_checked_in == 1).count()
    
    # Most popular event
    # Find the event_id with the most registrations
    popular_query = (
        db.query(Registration.event_id, func.count(Registration.id).label('reg_count'))
        .group_by(Registration.event_id)
        .order_by(desc('reg_count'))
        .first()
    )
    
    most_popular_event_title = None
    if popular_query:
        popular_event_id = popular_query.event_id
        event = next((e for e in MOCK_EVENTS if e.id == popular_event_id), None)
        if event:
            most_popular_event_title = event.title
            
    return EventStats(
        total_events=total_events,
        total_registrations=total_registrations,
        total_attendees=total_attendees,
        most_popular_event=most_popular_event_title
    )
