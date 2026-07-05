from fastapi import APIRouter, Depends
import logging
from sqlalchemy.orm import Session
from ...agents.event_agent.prompt import EVENT_AGENT_PROMPT
from ...schemas.chat import ChatRequest, ChatResponse
from ...services.event_chat_service import generate_ai_response
from ...database import get_db
from ...models import (
    User,
    ChatSession,
    ChatMessage as DBChatMessage,
)
from ...services.rag_service import vector_service
from ...dependencies import get_current_user

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
async def create_chat_reply(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ChatResponse:
    """
    Route that forwards user messages to Gemini and returns the assistant reply.

    If Gemini fails, the route falls back to local responses.
    """

    message = payload.message.strip()

    if not message:
        return ChatResponse(
            response=generate_chat_response(message),
            session_id=payload.session_id or "default",
        )

    # --------------------------------------------------
    # Handle Session Ownership
    # --------------------------------------------------

    session_id = payload.session_id

    if session_id:
        session = (
            db.query(ChatSession)
            .filter(
                ChatSession.id == session_id,
                ChatSession.user_id == current_user.id,
            )
            .first()
        )

        if not session:
            session = ChatSession(
                id=session_id,
                user_id=current_user.id,
            )

            db.add(session)
            db.commit()

    else:
        session = ChatSession(
            user_id=current_user.id,
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        session_id = session.id

    # --------------------------------------------------
    # Save User Message
    # --------------------------------------------------

    user_msg = DBChatMessage(
        session_id=session_id,
        role="user",
        content=message,
    )

    db.add(user_msg)
    db.commit()

    # --------------------------------------------------
    # Load Previous History
    # --------------------------------------------------

    db_history = (
        db.query(DBChatMessage)
        .filter(DBChatMessage.session_id == session_id)
        .order_by(DBChatMessage.created_at.desc())
        .offset(1)
        .limit(10)
        .all()
    )

    history_data = [
        {
            "role": msg.role,
            "content": msg.content,
        }
        for msg in reversed(db_history)
    ]

    # --------------------------------------------------
    # RAG + Gemini
    # --------------------------------------------------

    try:
        relevant_events = vector_service.search_events(
            message,
            n_results=3,
        )

        if relevant_events:
            event_context = (
                "Relevant Events Found:\n"
                + "\n".join(
                    [
                        f"- {event['content']} "
                        f"(Date: {event['metadata']['datetime']})"
                        for event in relevant_events
                    ]
                )
            )
        else:
            event_context = (
                "No specific events match the query perfectly, "
                "but you can still help based on general knowledge "
                "or state that no suitable event exists."
            )

        system_prompt = EVENT_AGENT_PROMPT.format(
    event_context=event_context
)

        ai_reply = await generate_ai_response(
            message=message,
            history=history_data,
            system_prompt=system_prompt,
        )

        if not ai_reply:
            raise RuntimeError(
                "AI provider returned an empty response"
            )

        assistant_msg = DBChatMessage(
            session_id=session_id,
            role="assistant",
            content=ai_reply,
        )

        db.add(assistant_msg)
        db.commit()

        return ChatResponse(
            response=ai_reply,
            session_id=session_id,
        )

    except Exception as exc:
        logging.exception(
            "AI service error: %s",
            exc,
        )

        fallback = generate_chat_response(message)

        assistant_msg = DBChatMessage(
            session_id=session_id,
            role="assistant",
            content=fallback,
        )

        db.add(assistant_msg)
        db.commit()

        return ChatResponse(
            response=fallback,
            session_id=session_id,
        )       