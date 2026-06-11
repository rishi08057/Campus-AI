from typing import Optional, List
from pydantic import BaseModel
from .event import Event

class Recommendation(BaseModel):
    event: Event
    reason: str
    confidence: Optional[float] = None
    score: Optional[float] = None
