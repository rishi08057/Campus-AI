from fastapi import APIRouter, Depends
from typing import List

from ..schemas.recommendation import Recommendation
from ..services.recommendation_service import recommendation_service
from ..schemas.user import UserProfile
from ..data.registrations import REGISTRATIONS, SAVED_EVENTS
from ..dependencies import get_current_user
from ..models import User

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("", response_model=List[Recommendation])
def get_recommendations(current_user: User = Depends(get_current_user)) -> List[Recommendation]:
    """
    Get personalized event recommendations for the current user.
    """
    # Map current_user to UserProfile for the recommendation service
    user_profile = UserProfile(
        id=current_user.id,
        name=current_user.name or "User",
        department="Computer Science",
        year="Junior (3rd Year)",
        interests=["Artificial Intelligence", "Web Development"]
    )
    
    # Filter registrations and saved events for this user
    user_saved = [s for s in SAVED_EVENTS if s.userId == current_user.id]
    user_registered = [r for r in REGISTRATIONS if r.userId == current_user.id]
    
    return recommendation_service.get_personalized_recommendations(
        user=user_profile,
        saved_events=user_saved,
        registered_events=user_registered
    )
