from typing import Dict, Any, Optional
from vision.frame_processor import FrameProcessor
from utils.logger import logger

class VisionService:
    """
    Singleton service exposing computer vision engine functions
    to FastAPI endpoints.
    """
    _instance: Optional["VisionService"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VisionService, cls).__new__(cls)
            cls._instance.processor = FrameProcessor()
        return cls._instance

    def start_vision_engine(self, camera_id: int = 0) -> Dict[str, Any]:
        success = self.processor.camera_manager.start(camera_id)
        return {
            "status": "started" if success else "error",
            "message": "Vision engine started successfully" if success else "Failed to start camera",
            "telemetry": self.processor.camera_manager.get_status()
        }

    def stop_vision_engine(self) -> Dict[str, Any]:
        self.processor.camera_manager.stop()
        return {
            "status": "stopped",
            "message": "Vision engine stopped",
            "telemetry": self.processor.camera_manager.get_status()
        }

    def get_vision_status(self) -> Dict[str, Any]:
        return {
            "status": "online" if self.processor.camera_manager.is_active else "idle",
            "camera": self.processor.camera_manager.get_status(),
            "recording": {
                "is_recording": self.processor.data_exporter.is_recording,
                "label": self.processor.data_exporter.active_label,
                "buffered_frames": len(self.processor.data_exporter.recorded_frames),
            }
        }

    def start_recording(self, label: str) -> Dict[str, Any]:
        self.processor.data_exporter.start_recording(label)
        return {"status": "recording_started", "label": label.upper()}

    def stop_recording(self) -> Dict[str, Any]:
        summary = self.processor.data_exporter.stop_recording()
        saved = self.processor.data_exporter.save_recorded_sample()
        return {"status": "recording_stopped", "summary": summary, "sample": saved}

    def export_sample(self, sample_id: str, format_type: str = "json") -> Dict[str, Any]:
        export_path = self.processor.data_exporter.export_dataset(sample_id, format_type)
        return {
            "status": "success",
            "sample_id": sample_id,
            "format": format_type,
            "file_path": export_path
        }

    def list_dataset_samples(self):
        return self.processor.data_exporter.list_samples()

    def delete_dataset_sample(self, sample_id: str) -> bool:
        return self.processor.data_exporter.delete_sample(sample_id)

vision_service = VisionService()
