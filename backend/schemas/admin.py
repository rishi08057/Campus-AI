from pydantic import BaseModel
from typing import Optional

class EventStats(BaseModel):
    total_events: int
    total_registrations: int
    total_attendees: int
    most_popular_event: Optional[str] = None
