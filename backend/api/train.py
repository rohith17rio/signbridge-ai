from fastapi import APIRouter
from models.schemas import TrainRequest, TrainResponse
from utils.logger import logger

router = APIRouter()

@router.post("", response_model=TrainResponse, tags=["Training"])
async def trigger_training(payload: TrainRequest):
    logger.info(f"Triggering model training for dataset: {payload.dataset_name}, epochs: {payload.epochs}")
    return TrainResponse(
        status="queued",
        job_id="train_job_001",
        message="Model training pipeline triggered. PyTorch trainer engine ready for Phase 2."
    )
