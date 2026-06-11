from ..schemas.event import EventRegistration, EventSave

# In-memory storage for registrations
REGISTRATIONS: list[EventRegistration] = []
# In-memory storage for saved events
SAVED_EVENTS: list[EventSave] = []
