from fastapi import APIRouter
import logging

from ..schemas.chat import ChatRequest, ChatResponse
from ..services.ai_service import generate_ai_response
from ..data.mock_events import MOCK_EVENTS

router = APIRouter(prefix="/chat", tags=["chat"])


def generate_chat_response(message: str) -> str:
    """Fallback response generator used when Gemini is unavailable."""

    normalized_message = message.strip().lower()

    if not normalized_message:
        return (
            "I'm CampusAI, your campus event assistant. I can help you find events, "
            "workshops, hackathons, and more."
        )

    if any(
        keyword in normalized_message
        for keyword in (
            "hello",
            "hi",
            "hey",
            "good morning",
            "good afternoon",
            "good evening",
        )
    ):
        return "Hello! I'm CampusAI. How can I help you discover campus events today?"

    return (
        "I'm CampusAI, your campus event assistant. "
        "I can help you discover workshops, hackathons, competitions, and other opportunities."
    )


@router.post("", response_model=ChatResponse)
async def create_chat_reply(payload: ChatRequest) -> ChatResponse:
    """
    Route that forwards user messages to Gemini and returns the assistant reply.

    If Gemini fails, the route falls back to local responses.
    """

    message = payload.message.strip()

    if not message:
        return ChatResponse(response=generate_chat_response(message))

    # Slice history to last 10 messages to keep context window manageable
    history_data = []
    if payload.history:
        history_data = [
            {"role": m.role, "content": m.content} for m in payload.history[-10:]
        ]

    try:
        event_context = "\n".join(
            [
                f"- {event.title} ({event.category})\n"
                f"  Venue: {event.venue}\n"
                f"  Date: {event.datetime.strftime('%Y-%m-%d %H:%M')}\n"
                f"  Description: {event.description}"
                for event in MOCK_EVENTS
            ]
        )

        system_prompt = f"""
You are CampusAI Event Agent.

Available Events:
{event_context}

Responsibilities:
- Recommend events from the available events list.
- Explain workshops, hackathons, competitions, and campus activities.
- Help students discover opportunities.
- Explain why an event is relevant to a student's interests.
- Answer questions about participation and benefits.

Rules:
- ONLY use events from the Available Events section.
- Never invent events.
- Never invent dates, venues, registration links, or organizers.
- If no suitable event exists, clearly state that.
- Mention event title, venue, date, and purpose when recommending an event.
- Be concise, professional, and student-friendly.
"""

        ai_reply = await generate_ai_response(
            message=message,
            history=history_data,
            system_prompt=system_prompt,
        )

        if not ai_reply:
            raise RuntimeError("AI provider returned an empty response")

        return ChatResponse(response=ai_reply)

    except Exception as exc:
        logging.exception("AI service error: %s", exc)

        fallback = generate_chat_response(message)
        return ChatResponse(response=fallback)