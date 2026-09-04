from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.vision_service import vision_service
from utils.logger import logger

router = APIRouter()

class VisionStartRequest(BaseModel):
    camera_id: int = 0

class VisionExportRequest(BaseModel):
    sample_id: str
    format: str = "json"  # 'json', 'csv', or 'npy'

class RecordStartRequest(BaseModel):
    label: str = "HELLO"

@router.post("/start", tags=["Vision Engine"])
async def start_vision(payload: VisionStartRequest):
    logger.info(f"API Request: /api/vision/start for camera {payload.camera_id}")
    return vision_service.start_vision_engine(payload.camera_id)

@router.post("/stop", tags=["Vision Engine"])
async def stop_vision():
    logger.info("API Request: /api/vision/stop")
    return vision_service.stop_vision_engine()

@router.get("/status", tags=["Vision Engine"])
async def get_vision_status():
    return vision_service.get_vision_status()

@router.post("/export", tags=["Vision Engine"])
async def export_landmark_dataset(payload: VisionExportRequest):
    logger.info(f"API Request: /api/vision/export sample '{payload.sample_id}' format '{payload.format}'")
    try:
        return vision_service.export_sample(payload.sample_id, payload.format)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/record/start", tags=["Vision Engine"])
async def start_recording_landmarks(payload: RecordStartRequest):
    logger.info(f"API Request: /api/vision/record/start for label '{payload.label}'")
    return vision_service.start_recording(payload.label)

@router.post("/record/stop", tags=["Vision Engine"])
async def stop_recording_landmarks():
    logger.info("API Request: /api/vision/record/stop")
    return vision_service.stop_recording()

@router.get("/stream", tags=["Vision Engine"])
async def stream_vision_feed():
    """
    Returns an MJPEG video stream with real-time skeleton landmark overlays.
    """
    import cv2
    from fastapi.responses import StreamingResponse

    def generate_frames():
        while vision_service.processor.camera_manager.is_active:
            success, annotated_frame, _ = vision_service.processor.process_next_frame()
            if not success or annotated_frame is None:
                continue
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            if not ret:
                continue
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

class ProcessLandmarksRequest(BaseModel):
    landmarks: Optional[list] = None
    hand_type: Optional[str] = "Right"

@router.post("/process", tags=["Vision Engine"])
async def process_landmarks(payload: ProcessLandmarksRequest):
    """
    Evaluates 21 hand landmarks for single-sign demo ("YOU").
    """
    from vision.binary_you_classifier import binary_you_classifier

    if not payload.landmarks:
        return {
            "recognized_text": "",
            "display_status": "Waiting for sign...",
            "confidence": 0.0,
            "sign": None
        }

    is_you, confidence, status_label = binary_you_classifier.evaluate_landmarks(payload.landmarks)

    return {
        "recognized_text": "YOU" if is_you else "",
        "display_status": status_label,
        "confidence": confidence,
        "sign": "YOU" if is_you else None
    }

