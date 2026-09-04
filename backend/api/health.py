from fastapi import APIRouter
from models.schemas import HealthResponse
from services.health_service import get_health_status

router = APIRouter()

@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def check_health():
    return get_health_status()
