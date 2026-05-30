from datetime import datetime

from pydantic import BaseModel


class Event(BaseModel):
    id: int
    title: str
    description: str
    venue: str
    category: str
    datetime: datetime