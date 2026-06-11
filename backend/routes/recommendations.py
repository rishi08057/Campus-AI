from fastapi import APIRouter, Depends
from typing import List

from ..schemas.recommendation import Recommendation
from ..services.recommendation_service import recommendation_service
from .profile import MOCK_USER
from ..data.registrations import REGISTRATIONS, SAVED_EVENTS

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("", response_model=List[Recommendation])
def get_recommendations() -> List[Recommendation]:
    """
    Get personalized event recommendations for the current user.
    """
    # In a real app, we'd get the user from the session/token
    user = MOCK_USER
    
    # Filter registrations and saved events for this user
    user_saved = [s for s in SAVED_EVENTS if s.userId == user.id]
    user_registered = [r for r in REGISTRATIONS if r.userId == user.id]
    
    return recommendation_service.get_personalized_recommendations(
        user=user,
        saved_events=user_saved,
        registered_events=user_registered
    )
