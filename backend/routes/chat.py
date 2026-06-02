from fastapi import APIRouter, HTTPException
import logging

from ..schemas.chat import ChatRequest, ChatResponse
from ..services.ai_service import generate_ai_response


router = APIRouter(prefix="/chat", tags=["chat"])


def generate_chat_response(message: str) -> str:
    """A small local fallback response generator used when AI is unavailable."""
    normalized_message = message.strip().lower()

    if not normalized_message:
        return (
            "I'm CampusAI, your campus event assistant. I can help you find events, "
            "workshops, hackathons, and more."
        )

    if any(keyword in normalized_message for keyword in ("hello", "hi", "hey", "good morning", "good afternoon", "good evening")):
        return "Hello! I'm CampusAI. How can I help you discover campus events today?"

    if any(keyword in normalized_message for keyword in ("what events should i attend", "recommend", "suggest event", "suggest events", "what events", "events should i attend")):
        return (
            "I recommend checking out the AI Workshop and the upcoming Hackathon. "
            "Both are excellent opportunities to learn new skills and network with other students."
        )

    if any(keyword in normalized_message for keyword in ("ai workshop", "workshop")):
        return (
            "The AI Workshop focuses on machine learning, artificial intelligence fundamentals, "
            "and hands-on practical sessions."
        )

    if any(keyword in normalized_message for keyword in ("hackathon",)):
        return (
            "A hackathon is a collaborative coding event where participants build innovative projects, "
            "solve challenges, and compete for prizes."
        )

    if any(keyword in normalized_message for keyword in ("register", "sign up", "signup", "join event")):
        return (
            "If you'd like to register, open the event details and use the registration option once it is available. "
            "I can also help you decide which event fits your goals."
        )

    if any(keyword in normalized_message for keyword in ("when is", "date", "time", "schedule", "venue", "location")):
        return (
            "I can help with event timing and venue details. Check the Events page for the latest schedule and location information, "
            "or ask me about a specific event."
        )

    return (
        "I'm CampusAI, your campus event assistant. I can help you find events, workshops, hackathons, and more."
    )


@router.post("", response_model=ChatResponse)
async def create_chat_reply(payload: ChatRequest) -> ChatResponse:
    """Route that forwards user messages to the AI service and returns the assistant reply.

    If the AI provider fails or is misconfigured, this route falls back to the local
    `generate_chat_response` behavior instead of raising an error to the client.
    """
    message = payload.message.strip()
    if not message:
        # Keep the same behaviour for empty/whitespace messages.
        return ChatResponse(response=generate_chat_response(message))

    try:
        ai_reply = await generate_ai_response(message)
        # Protect against empty responses
        if not ai_reply:
            raise RuntimeError("AI provider returned an empty response")
        return ChatResponse(response=ai_reply)
    except Exception as exc:
        logging.exception("AI service error: %s", exc)
        # Graceful fallback so the frontend still receives helpful text.
        fallback = generate_chat_response(message)
        return ChatResponse(response=fallback)