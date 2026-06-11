from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class Event(BaseModel):
    id: int = Field(..., description="Unique identifier for the event.")
    title: str = Field(..., min_length=1, description="Title of the event.")
    description: str = Field(..., description="Detailed description of the event.")
    venue: str = Field(..., description="Location where the event takes place.")
    category: str = Field(..., description="The type of event (e.g., Workshop, Competition).")
    event_datetime: datetime = Field(
        ...,
        description="The scheduled date and time for the event."
    )


class EventActionBase(BaseModel):
    userId: int = Field(..., description="The ID of the user performing the action.")
    eventId: int = Field(..., description="The ID of the event being acted upon.")


class EventRegistration(EventActionBase):
    pass


class BaseResponse(BaseModel):
    success: bool = Field(..., description="Indicates if the request was successful.")
    message: str = Field(..., description="A human-readable message about the result.")


class EventRegistrationResponse(BaseResponse):
    registration: Optional[EventRegistration] = Field(
        None,
        description="Details of the registration if successful."
    )


class EventSave(EventActionBase):
    pass


class EventSaveResponse(BaseResponse):
    saved: bool = Field(..., description="Indicates if the event is currently saved.")
    eventId: int = Field(..., description="The ID of the event.")