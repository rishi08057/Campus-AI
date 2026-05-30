from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Message submitted by the client.")


class ChatResponse(BaseModel):
    response: str