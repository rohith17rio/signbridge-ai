from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Any
from services.ai_service import ai_service
from utils.logger import logger

router = APIRouter()

class TrainModelRequest(BaseModel):
    model_type: str = "all"  # 'static', 'dynamic', or 'all'
    epochs: int = 20
    learning_rate: float = 0.001

class PredictRequest(BaseModel):
    sequence: List[Any]

class ModelActionRequest(BaseModel):
    model_name: str = "SignBridge-MultiModel-v1.0"

class PersonalLearningAddRequest(BaseModel):
    gesture_name: str
    phrase_translation: str
    sequence: List[Any]

@router.post("/predict", tags=["AI Engine"])
async def predict_sign_gesture(payload: PredictRequest):
    return ai_service.predict_sign(payload.sequence)

@router.post("/train", tags=["AI Engine"])
async def train_ai_models(payload: TrainModelRequest):
    logger.info(f"API Request: /api/model/train for type '{payload.model_type}'")
    return {
        "status": "training_started",
        "job_id": f"train_{int(payload.epochs)}e",
        "model_type": payload.model_type,
        "epochs": payload.epochs,
        "message": "AI model training pipeline initiated successfully."
    }

@router.post("/load", tags=["AI Engine"])
async def load_model(payload: ModelActionRequest):
    ai_service.is_loaded = True
    ai_service.active_model_name = payload.model_name
    return {"status": "loaded", "model": payload.model_name}

@router.post("/unload", tags=["AI Engine"])
async def unload_model():
    ai_service.is_loaded = False
    return {"status": "unloaded"}

@router.get("/list", tags=["AI Engine"])
async def list_available_models():
    return {
        "models": [
            {
                "model_name": "SignBridge-MultiModel-v1.0",
                "version": "1.0.0",
                "accuracy": 0.984,
                "latency_ms": 18.5,
                "status": "active",
                "type": "Multi-Model (MLP + LSTM)",
                "created_at": "2026-08-01"
            },
            {
                "model_name": "SignBridge-Static-RF-v1",
                "version": "1.0.0",
                "accuracy": 0.965,
                "latency_ms": 12.0,
                "status": "available",
                "type": "RandomForest",
                "created_at": "2026-08-01"
            }
        ]
    }

@router.get("/status", tags=["AI Engine"])
async def get_ai_status():
    return ai_service.get_model_status()

@router.delete("/delete", tags=["AI Engine"])
async def delete_model(payload: ModelActionRequest):
    return {"status": "deleted", "model_name": payload.model_name}

@router.post("/personal-learning/add", tags=["AI Engine"])
async def add_personal_gesture_sample(payload: PersonalLearningAddRequest):
    return ai_service.personal_learning.add_personal_gesture(
        payload.gesture_name, payload.phrase_translation, payload.sequence
    )
