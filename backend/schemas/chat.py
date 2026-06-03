from typing import Optional, List
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the message sender (user or assistant).")
    content: str = Field(..., description="The message content.")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Message submitted by the client.")
    history: Optional[List[ChatMessage]] = Field(None, description="Recent conversation history.")


class ChatResponse(BaseModel):
    response: str