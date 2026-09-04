import time
from datetime import datetime, timezone
from models.schemas import HealthResponse
from config.settings import settings

START_TIME = time.time()

def get_health_status() -> HealthResponse:
    uptime_seconds = round(time.time() - START_TIME, 2)
    current_iso = datetime.now(timezone.utc).isoformat()
    return HealthResponse(
        status="online",
        version=settings.VERSION,
        uptime=uptime_seconds,
        timestamp=current_iso
    )
