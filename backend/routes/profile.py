from fastapi import APIRouter
from ..schemas.user import UserProfile

router = APIRouter(prefix="/profile", tags=["profile"])

MOCK_USER = UserProfile(
    id=1,
    name="Alex Rivers",
    department="Computer Science",
    year="Junior (3rd Year)",
    interests=["Artificial Intelligence", "Web Development", "UI/UX Design", "Blockchain"]
)

@router.get("", response_model=UserProfile)
def get_profile() -> UserProfile:
    """
    Get the mock user profile information.
    """
    return MOCK_USER
