from fastapi import APIRouter, Depends
from ...schemas.user import UserProfile
from ...dependencies import get_current_user
from ...models import User

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)) -> UserProfile:
    """
    Get the authenticated user's profile information.
    """
    # For now, we mix real user data with some default profile fields
    # until we expand the User model with department, year, etc.
    return UserProfile(
        id=current_user.id,
        name=current_user.name or "User",
        department=getattr(current_user, 'department', None) or "Computer Science",
        year=getattr(current_user, 'year', None) or "Junior (3rd Year)",
        interests=getattr(current_user, 'interests', None) or ["Artificial Intelligence", "Web Development"]
    )
