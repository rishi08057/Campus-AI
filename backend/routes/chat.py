from fastapi import APIRouter

from ..schemas.chat import ChatRequest, ChatResponse


router = APIRouter(prefix="/chat", tags=["chat"])


def generate_chat_response(message: str) -> str:
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
def create_chat_reply(payload: ChatRequest) -> ChatResponse:
    response_text = generate_chat_response(payload.message)
    return ChatResponse(response=response_text)