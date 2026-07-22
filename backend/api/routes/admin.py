from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional
from pydantic import BaseModel

from ...database import get_db
from ...models import Event, Registration, Ticket
from ...dependencies import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

from ...schemas.admin import EventStats
from ...dependencies import get_current_admin_user

@router.get("/stats", response_model=EventStats)
def get_admin_stats(current_user = Depends(get_current_admin_user), db: Session = Depends(get_db)) -> EventStats:
    """
    Get high-level analytics for the admin dashboard.
    """

    # Total events
    total_events = db.query(Event).count()
    
    # Total registrations
    total_registrations = db.query(Registration).count()
    
    # Total attendees (where is_checked_in == True)
    total_attendees = db.query(Ticket).filter(Ticket.is_checked_in.is_(True)).count()
    
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
        event = db.query(Event).filter(Event.id == popular_event_id).first()
        if event:
            most_popular_event_title = event.title
            
    return EventStats(
        total_events=total_events,
        total_registrations=total_registrations,
        total_attendees=total_attendees,
        most_popular_event=most_popular_event_title
    )
