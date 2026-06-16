from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class TicketResponse(BaseModel):
    """
    Schema for ticket information response.
    Compatible with Pydantic v2.
    """
    ticket_id: str
    qr_code_url: Optional[str]
    is_checked_in: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
