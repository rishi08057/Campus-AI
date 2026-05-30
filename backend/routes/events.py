from fastapi import APIRouter

from ..data.mock_events import MOCK_EVENTS


router = APIRouter(prefix="/events", tags=["events"])


@router.get("")
def read_events() -> list[dict[str, object]]:
    return MOCK_EVENTS