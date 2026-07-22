from fastapi import APIRouter, Depends
from ...schemas.user import UserProfile
from ...dependencies import get_current_user
from ...models import User

router = APIRouter(prefix="/profile", tags=["profile"])

import json
@router.get("", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)) -> UserProfile:
    """
    Get the authenticated user's profile information.
    """
    from ..utils import parse_user_interests
    interests = parse_user_interests(current_user)

    return UserProfile(
        id=current_user.id,
        name=current_user.name or "",
        department=current_user.department or "",
        year=current_user.year or "",
        interests=interests
    )

