from fastapi import APIRouter

from ..schemas.system import MessageResponse


router = APIRouter(tags=["root"])


@router.get("/", response_model=MessageResponse)
def read_root() -> MessageResponse:
    return MessageResponse(message="CampusAI Backend Running")
