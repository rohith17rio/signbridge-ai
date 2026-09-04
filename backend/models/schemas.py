from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class HealthResponse(BaseModel):
    status: str = Field(default="online", example="online")
    version: str = Field(default="1.0.0", example="1.0.0")
    uptime: float = Field(default=0.0, example=120.5)
    timestamp: str = Field(..., example="2026-08-01T11:23:00Z")

class VisionProcessRequest(BaseModel):
    frame_data: Optional[str] = Field(default=None, description="Base64 encoded video frame")
    camera_id: Optional[str] = Field(default="default")
    parameters: Optional[Dict[str, Any]] = Field(default_factory=dict)

class VisionProcessResponse(BaseModel):
    status: str = "success"
    recognized_gesture: str = "Waiting..."
    confidence: float = 0.0
    translated_text: str = "Waiting..."
    landmark_count: int = 0
    message: str = "Phase 1 Mock Endpoint - AI Vision Recognition module ready for Phase 2."

class SpeechProcessRequest(BaseModel):
    audio_data: Optional[str] = Field(default=None, description="Base64 audio chunk")
    sample_rate: int = 44100
    language: str = "en"

class SpeechProcessResponse(BaseModel):
    status: str = "success"
    transcript: str = "Waiting..."
    confidence: float = 0.0
    language_detected: str = "en"
    message: str = "Phase 1 Mock Endpoint - Whisper Speech Recognition module ready for Phase 2."

class TranslationProcessRequest(BaseModel):
    source_text: str
    source_lang: str = "en"
    target_lang: str = "ta"

class TranslationProcessResponse(BaseModel):
    status: str = "success"
    original_text: str
    translated_text: str = "Waiting..."
    source_lang: str
    target_lang: str
    message: str = "Phase 1 Mock Endpoint - Translation API module ready for Phase 2."

class TrainRequest(BaseModel):
    dataset_name: str = "default_sign_dataset"
    epochs: int = 10
    batch_size: int = 32

class TrainResponse(BaseModel):
    status: str = "queued"
    job_id: str = "train_job_001"
    message: str = "Phase 1 Mock Endpoint - Model Training Pipeline ready for Phase 2."
