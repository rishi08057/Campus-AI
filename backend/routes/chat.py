from fastapi import APIRouter

from ..schemas.chat import ChatRequest, ChatResponse


router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def create_chat_reply(payload: ChatRequest) -> ChatResponse:
    # This keeps the contract explicit while the backend remains stateless.
    return ChatResponse(response=f"You said: {payload.message}")