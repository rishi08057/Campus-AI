from typing import Optional, List, Literal
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"] = Field(..., description="Role of the message sender (user or assistant).")
    content: str = Field(..., description="The message content.")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="Message submitted by the client.")
    history: Optional[List[ChatMessage]] = Field(None, description="Recent conversation history.")
    session_id: Optional[str] = Field(None, description="Optional session ID for persistence.")
    agent_type: Literal["event", "support", "placement", "health"] = Field("event", description="Target agent for the request.")


class ChatResponse(BaseModel):
    response: str
    session_id: str = Field(..., description="The session ID for this conversation.")