from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Any
from services.vision_service import vision_service
from services.dataset_service import dataset_service
from utils.logger import logger

router = APIRouter()

class DatasetSaveRequest(BaseModel):
    label: str = "HELLO"
    video_path: Optional[str] = None
    sequence: Optional[List[Any]] = None
    source: str = "LIVE_CAMERA"

class DatasetDeleteRequest(BaseModel):
    sample_id: str

class VideoImportRequest(BaseModel):
    video_path: str
    label: str = "HELLO"

class BulkImportRequest(BaseModel):
    folder_path: str

class AugmentationRequest(BaseModel):
    sample_id: str
    rotation: float = 10.0
    scale: float = 1.1
    noise: float = 0.005

class DatasetExportRequest(BaseModel):
    format: str = "json"

class SplitRequest(BaseModel):
    train_ratio: float = 0.70
    val_ratio: float = 0.15
    test_ratio: float = 0.15

@router.post("/save", tags=["Dataset Manager"])
@router.post("/save/", tags=["Dataset Manager"])
async def save_dataset_sample(payload: DatasetSaveRequest):
    logger.info(f"API Request: /api/dataset/save with label '{payload.label}' source '{payload.source}'")
    
    # Priority 1: Video file path processing
    if payload.video_path:
        res = dataset_service.process_and_import_video(payload.video_path, payload.label)
        return {"status": "saved", "sample": res}
    
    # Priority 2: In-memory landmark sequence payload
    if payload.sequence:
        vision_service.processor.data_exporter.recorded_frames = payload.sequence
        vision_service.processor.data_exporter.active_label = payload.label
        saved = vision_service.processor.data_exporter.save_recorded_sample(payload.label, source=payload.source)
        return {"status": "saved", "sample": saved}
        
    # Priority 3: Currently active vision recording buffer
    return vision_service.stop_recording()

@router.get("/list", tags=["Dataset Manager"])
@router.get("/list/", tags=["Dataset Manager"])
async def list_dataset_samples():
    samples = vision_service.list_dataset_samples()
    return {"status": "success", "count": len(samples), "samples": samples}

@router.post("/delete", tags=["Dataset Manager"])
@router.post("/delete/", tags=["Dataset Manager"])
async def delete_dataset_sample(payload: DatasetDeleteRequest):
    logger.info(f"API Request: /api/dataset/delete for sample '{payload.sample_id}'")
    success = vision_service.delete_dataset_sample(payload.sample_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Sample '{payload.sample_id}' not found.")
    return {"status": "deleted", "sample_id": payload.sample_id}

@router.post("/import", tags=["Dataset Manager"])
@router.post("/import/", tags=["Dataset Manager"])
async def import_and_process_video(payload: VideoImportRequest):
    logger.info(f"API Request: /api/dataset/import for video '{payload.video_path}'")
    return dataset_service.process_and_import_video(payload.video_path, payload.label)

@router.post("/bulk-import", tags=["Dataset Manager"])
@router.post("/bulk-import/", tags=["Dataset Manager"])
async def bulk_import_dataset_folder(payload: BulkImportRequest):
    logger.info(f"API Request: /api/dataset/bulk-import for folder '{payload.folder_path}'")
    return dataset_service.bulk_import_dataset_folder(payload.folder_path)

@router.get("/statistics", tags=["Dataset Manager"])
@router.get("/statistics/", tags=["Dataset Manager"])
async def get_dataset_statistics():
    return dataset_service.manager.compute_statistics()

@router.post("/augment", tags=["Dataset Manager"])
@router.post("/augment/", tags=["Dataset Manager"])
async def augment_sample(payload: AugmentationRequest):
    return dataset_service.augment_dataset_sample(
        payload.sample_id, payload.rotation, payload.scale, payload.noise
    )

@router.post("/split", tags=["Dataset Manager"])
@router.post("/split/", tags=["Dataset Manager"])
async def generate_dataset_split(payload: SplitRequest):
    return dataset_service.manager.generate_splits(
        payload.train_ratio, payload.val_ratio, payload.test_ratio
    )

@router.post("/export", tags=["Dataset Manager"])
@router.post("/export/", tags=["Dataset Manager"])
async def export_full_dataset(payload: DatasetExportRequest):
    export_path = dataset_service.exporter.export_full_dataset(payload.format)
    return {"status": "success", "format": payload.format, "file_path": export_path}
