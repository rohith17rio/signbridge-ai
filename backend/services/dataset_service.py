import os
from typing import Dict, Any, List, Optional
from dataset.video_importer import VideoImporter
from dataset.quality_auditor import QualityAuditor
from dataset.augmenter import DataAugmenter
from dataset.dataset_manager import DatasetManager
from dataset.dataset_exporter import ExporterEngine
from utils.logger import logger

class DatasetService:
    """
    Singleton orchestrator for video imports, dataset quality audits,
    data augmentation, train/val/test splits, and multi-format exports.
    """
    _instance: Optional["DatasetService"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatasetService, cls).__new__(cls)
            cls._instance.importer = VideoImporter()
            cls._instance.auditor = QualityAuditor()
            cls._instance.augmenter = DataAugmenter()
            cls._instance.manager = DatasetManager()
            cls._instance.exporter = ExporterEngine()
        return cls._instance

    def process_and_import_video(self, video_path: str, label: str = "UNLABELED") -> Dict[str, Any]:
        """Runs complete video processing pipeline: Ingest -> MediaPipe -> Audit -> Save."""
        processed = self.importer.process_video_file(video_path)
        if processed.get("status") != "success":
            return processed

        sequence = processed.get("sequence", [])
        audit_res = self.auditor.audit_sequence(sequence)

        # Save sample
        sample_id = f"{label.upper()}_{int(os.path.getmtime(video_path)) if os.path.exists(video_path) else 0}"
        payload = {
            "sample_id": sample_id,
            "label": label.upper(),
            "source_video": os.path.basename(video_path),
            "quality_audit": audit_res,
            "frame_count": len(sequence),
            "sequence": sequence,
        }

        save_path = os.path.join(self.manager.storage_dir, f"{sample_id}.json")
        import json
        with open(save_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)

        return {
            "status": "success",
            "sample_id": sample_id,
            "audit": audit_res,
            "saved_file": save_path,
        }

    def bulk_import_dataset_folder(self, folder_path: str) -> Dict[str, Any]:
        """Runs bulk folder dataset import using VideoImporter and saves to master storage."""
        from vision.data_exporter import DataExporter
        exporter = DataExporter(storage_dir=self.manager.storage_dir)
        return self.importer.bulk_import_folder(folder_path, data_exporter=exporter)

    def augment_dataset_sample(
        self,
        sample_id: str,
        rotation: float = 10.0,
        scale: float = 1.1,
        noise: float = 0.005
    ) -> Dict[str, Any]:
        json_path = os.path.join(self.manager.storage_dir, f"{sample_id}.json")
        if not os.path.exists(json_path):
            return {"status": "error", "message": "Sample not found"}

        import json
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        orig_seq = data.get("sequence", [])
        aug_seq = self.augmenter.augment_sequence(
            orig_seq, rotation_degrees=rotation, scale_factor=scale, noise_std=noise
        )

        aug_sample_id = f"{sample_id}_aug"
        data["sample_id"] = aug_sample_id
        data["is_augmented"] = True
        data["sequence"] = aug_seq

        aug_save_path = os.path.join(self.manager.storage_dir, f"{aug_sample_id}.json")
        with open(aug_save_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        return {"status": "success", "augmented_sample_id": aug_sample_id}

dataset_service = DatasetService()
