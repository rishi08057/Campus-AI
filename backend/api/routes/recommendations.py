from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session

from ...schemas.recommendation import Recommendation
from ...schemas.user import UserProfile
from ...schemas.event import (
    EventSave,
    EventRegistration,
)
from ...services.recommendation_service import recommendation_service
from ...dependencies import get_current_user
from ...database import get_db
from ...models import (
    User,
    Registration,
    SavedEvent,
)

router = APIRouter(
    prefix="/recommendations",
    tags=["recommendations"],
)


@router.get("", response_model=List[Recommendation])
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[Recommendation]:

    from ..utils import parse_user_interests
    interests = parse_user_interests(current_user)
            
    user_profile = UserProfile(
        id=current_user.id,
        name=current_user.name or "",
        department=current_user.department or "",
        year=current_user.year or "",
        interests=interests,
    )

    user_saved = [
        EventSave(
            userId=current_user.id,
            eventId=record.event_id,
        )
        for record in db.query(SavedEvent)
        .filter(
            SavedEvent.user_id == current_user.id
        )
        .all()
    ]

    user_registered = [
        EventRegistration(
            userId=current_user.id,
            eventId=record.event_id,
        )
        for record in db.query(Registration)
        .filter(
            Registration.user_id == current_user.id
        )
        .all()
    ]

    return recommendation_service.get_personalized_recommendations(
        db=db,
        user=user_profile,
        saved_events=user_saved,
        registered_events=user_registered,
    )