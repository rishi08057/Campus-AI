from fastapi import APIRouter

from ..schemas.system import StatusResponse


router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=StatusResponse)
def read_health() -> StatusResponse:
    return StatusResponse(status="ok")
