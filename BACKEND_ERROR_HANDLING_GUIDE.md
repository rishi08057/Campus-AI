"""
Backend Error Handling & Improvements Guide

This module demonstrates proper error handling patterns for CampusAI backend.
Apply these patterns to all routes for production-readiness.
"""

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, ValidationError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ============================================================================
# ERROR HANDLING PATTERNS
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response format"""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional details")
    status_code: int = Field(..., description="HTTP status code")


def handle_validation_error(exc: ValidationError) -> JSONResponse:
    """Handle Pydantic validation errors gracefully"""
    logger.warning(f"Validation error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            error="Validation error",
            detail=str(exc),
            status_code=422
        ).dict()
    )


def create_error_response(
    status_code: int,
    error: str,
    detail: Optional[str] = None
) -> dict:
    """Create standardized error response"""
    return {
        "error": error,
        "detail": detail,
        "status_code": status_code
    }


# ============================================================================
# IMPROVED ROUTE PATTERNS
# ============================================================================

class ChatRequest(BaseModel):
    """Chat request with validation"""
    message: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="User message"
    )
    history: Optional[list] = Field(None, description="Message history")


class ChatResponse(BaseModel):
    """Chat response"""
    response: str = Field(..., description="AI response")


# Example: Improved /chat endpoint
async def create_chat_reply(payload: ChatRequest) -> ChatResponse:
    """
    Send message and get AI response.
    
    **Improvements over current:**
    - Validates input length (1-1000 chars)
    - Handles missing/invalid history
    - Proper error logging
    - Uses history for context
    - Graceful error recovery
    """
    try:
        logger.info(f"Processing chat message: {len(payload.message)} chars")
        
        # Validate message
        if not payload.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty or whitespace only"
            )
        
        # Log message history usage
        history_count = len(payload.history) if payload.history else 0
        logger.info(f"Using chat history with {history_count} messages")
        
        # Process message with history context
        response_text = generate_chat_response(
            payload.message,
            payload.history or []
        )
        
        logger.info(f"Generated response: {len(response_text)} chars")
        return ChatResponse(response=response_text)
        
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except ValidationError as e:
        logger.error(f"Validation error in chat: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid request format"
        )
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


def generate_chat_response(message: str, history: list = None) -> str:
    """
    Generate AI response with history awareness.
    
    **Future improvements:**
    - Integrate with real LLM (OpenAI, Anthropic, etc.)
    - Use message history for context
    - Add user preferences
    - Track conversation topics
    """
    if history is None:
        history = []
    
    normalized_message = message.lower()
    
    # Example: Use history to provide better responses
    previous_topic = None
    if history and len(history) > 0:
        last_message = history[-1]
        if isinstance(last_message, dict):
            previous_topic = last_message.get("content", "").lower()
    
    # Simple keyword matching for now
    if any(keyword in normalized_message for keyword in ("hello", "hi", "hey", "greetings")):
        return "Hello! I'm CampusAI. I can help you find and register for events. What are you looking for?"
    
    if any(keyword in normalized_message for keyword in ("events", "workshops", "seminars")):
        return "I can help you explore campus events! You can browse by category or tell me what interests you. What type of event are you looking for?"
    
    if any(keyword in normalized_message for keyword in ("thanks", "thank you", "appreciate")):
        return "You're welcome! Is there anything else I can help you with?"
    
    # If we have previous context, reference it
    if previous_topic and "event" in previous_topic:
        return f"That's great! Based on what you mentioned before about {previous_topic}, here are some recommendations..."
    
    # Default response
    return "I'm here to help with campus events. You can ask me about upcoming events, specific categories, or get personalized recommendations. What would you like to know?"


# ============================================================================
# RECOMMENDATIONS ENDPOINT (NEW)
# ============================================================================

class Event(BaseModel):
    """Event model"""
    id: int
    title: str
    description: str
    venue: str
    category: str
    datetime: str


class Recommendation(BaseModel):
    """Recommendation with scoring"""
    event: Event
    reason: str = Field(
        ...,
        description="Why recommended",
        pattern="^(category-match|trending|personalized|new|nearby|popular)$"
    )
    confidence: float = Field(..., ge=0, le=1, description="Confidence score 0-1")


async def get_recommendations(
    category: Optional[str] = None,
    limit: int = 6
) -> list[Recommendation]:
    """
    Get personalized event recommendations.
    
    **Current: Mock data with scoring**
    **Future: Real user preference tracking**
    """
    try:
        logger.info(f"Fetching recommendations (category={category}, limit={limit})")
        
        # Validate inputs
        if limit < 1 or limit > 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Limit must be between 1 and 50"
            )
        
        # TODO: Replace with actual recommendation algorithm
        # For now, return mock data with scoring
        
        # Here's where you'd integrate:
        # 1. User preference data
        # 2. Event popularity metrics
        # 3. Collaborative filtering
        # 4. Content-based filtering
        # 5. ML model scores
        
        recommendations = []
        # Implementation would go here
        
        logger.info(f"Returning {len(recommendations)} recommendations")
        return recommendations
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching recommendations: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch recommendations"
        )


# ============================================================================
# IMPLEMENTATION CHECKLIST
# ============================================================================

"""
To make your backend production-ready, apply these changes:

PRIORITY 1 (CRITICAL):
- [ ] Add try-catch to all route handlers
- [ ] Add input validation to all endpoints
- [ ] Add logging to all operations
- [ ] Handle edge cases (empty data, null values, etc.)
- [ ] Test error scenarios with curl/Postman

PRIORITY 2 (HIGH):
- [ ] Create standardized error response format
- [ ] Add request/response logging middleware
- [ ] Add rate limiting to chat endpoint (prevent abuse)
- [ ] Add character limit validation to backend
- [ ] Test with invalid/malformed requests

PRIORITY 3 (MEDIUM):
- [ ] Add database error handling
- [ ] Add authentication/authorization
- [ ] Add request timeout handling
- [ ] Add graceful shutdown handling
- [ ] Add health check endpoint

PRIORITY 4 (NICE TO HAVE):
- [ ] Add request tracing/correlation IDs
- [ ] Add metrics collection (Prometheus)
- [ ] Add distributed tracing (Jaeger)
- [ ] Add APM integration
- [ ] Add performance monitoring

Testing:
- [ ] Unit tests for all functions
- [ ] Integration tests for all endpoints
- [ ] Error scenario tests
- [ ] Load testing
- [ ] Security testing
"""

# ============================================================================
# QUICK START: Apply to existing routes
# ============================================================================

"""
Example: Update backend/routes/chat.py

FROM:
    @router.post("")
    def create_chat_reply(payload: ChatRequest) -> ChatResponse:
        response_text = generate_chat_response(payload.message)
        return ChatResponse(response=response_text)

TO:
    @router.post("")
    async def create_chat_reply(payload: ChatRequest) -> ChatResponse:
        try:
            if not payload.message.strip():
                raise HTTPException(
                    status_code=400,
                    detail="Message cannot be empty"
                )
            
            logger.info(f"Chat request: {len(payload.message)} chars")
            response_text = generate_chat_response(payload.message)
            return ChatResponse(response=response_text)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Chat error: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal error")
"""
