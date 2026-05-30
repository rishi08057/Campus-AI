from fastapi import APIRouter

from ..data.mock_events import MOCK_EVENTS
from ..schemas.event import Event


router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[Event])
def read_events() -> list[Event]:
    # The API returns static fixtures for now so the frontend can integrate
    # against a stable, validated contract without waiting on persistence.
    return MOCK_EVENTS