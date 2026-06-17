from fastapi import APIRouter, Depends
import logging
from sqlalchemy.orm import Session

from ..schemas.chat import ChatRequest, ChatResponse
from ..services.ai_service import generate_ai_response
from ..database import get_db
from ..models import ChatSession, ChatMessage as DBChatMessage, User
from ..services.vector_service import vector_service
from ..dependencies import get_current_user

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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ChatResponse:
    """
    Route that forwards user messages to Gemini and returns the assistant reply.

    If Gemini fails, the route falls back to local responses.
    """

    message = payload.message.strip()

    if not message:
        return ChatResponse(
            response=generate_chat_response(message),
            session_id=payload.session_id or "default"
        )

    # 1. Handle Session
    session_id = payload.session_id
    if session_id:
        session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
        if not session:
            session = ChatSession(id=session_id, user_id=current_user.id)
            db.add(session)
            db.commit()
    else:
        session = ChatSession(user_id=current_user.id)
        db.add(session)
        db.commit()
        db.refresh(session)
        session_id = session.id

    # 2. Save User Message
    user_msg = DBChatMessage(session_id=session_id, role="user", content=message)
    db.add(user_msg)
    db.commit()

    # 3. Load history from DB (last 10 messages)
    db_history = (
        db.query(DBChatMessage)
        .filter(DBChatMessage.session_id == session_id)
        .order_by(DBChatMessage.created_at.desc())
        .offset(1)  # Skip the current user message for history
        .limit(10)
        .all()
    )
    
    # Reverse to get chronological order
    history_data = [
        {"role": m.role, "content": m.content} for m in reversed(db_history)
    ]

    # 4. Semantic Search for Context (RAG)
    try:
        relevant_events = vector_service.search_events(message, n_results=3)
        
        event_context = ""
        if relevant_events:
            event_context = "Relevant Events Found:\n" + "\n".join(
                [f"- {e['content']} (Date: {e['metadata']['datetime']})" for e in relevant_events]
            )
        else:
            event_context = "No specific events match the query perfectly, but you can still help based on general knowledge or state that no suitable event exists."

        system_prompt = f"""
You are CampusAI Event Agent.

Context from Event Database:
{event_context}

Responsibilities:
- Recommend events from the provided context.
- Explain workshops, hackathons, competitions, and campus activities.
- Help students discover opportunities.
- Explain why an event is relevant to a student's interests.
- Answer questions about participation and benefits.

Rules:
- ONLY use events provided in the Context section above.
- If no suitable event exists in the context, clearly state that.
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

        # 5. Save AI Response
        assistant_msg = DBChatMessage(session_id=session_id, role="assistant", content=ai_reply)
        db.add(assistant_msg)
        db.commit()

        return ChatResponse(response=ai_reply, session_id=session_id)

    except Exception as exc:
        logging.exception("AI service error: %s", exc)

        fallback = generate_chat_response(message)
        
        # Save fallback as well to maintain history
        assistant_msg = DBChatMessage(session_id=session_id, role="assistant", content=fallback)
        db.add(assistant_msg)
        db.commit()
        
        return ChatResponse(response=fallback, session_id=session_id)