import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, "/Users/apple/.gemini/antigravity-ide/scratch/signbridge-ai/backend")

from dataset.quality_auditor import QualityAuditor
from dataset.augmenter import DataAugmenter
from dataset.dataset_manager import DatasetManager
from dataset.dataset_exporter import ExporterEngine

def test_phase3_pipeline():
    print("Testing QualityAuditor...")
    auditor = QualityAuditor()
    sample_seq = [
        {"frame_number": 1, "hands": [{"hand_type": "Right", "confidence": 0.9, "raw_landmarks": [{"x": 0.5, "y": 0.5, "z": 0.0}]}]},
        {"frame_number": 2, "hands": [{"hand_type": "Right", "confidence": 0.85, "raw_landmarks": [{"x": 0.51, "y": 0.51, "z": 0.0}]}]},
        {"frame_number": 3, "hands": [{"hand_type": "Right", "confidence": 0.88, "raw_landmarks": [{"x": 0.52, "y": 0.52, "z": 0.0}]}]},
        {"frame_number": 4, "hands": [{"hand_type": "Right", "confidence": 0.92, "raw_landmarks": [{"x": 0.53, "y": 0.53, "z": 0.0}]}]},
        {"frame_number": 5, "hands": [{"hand_type": "Right", "confidence": 0.95, "raw_landmarks": [{"x": 0.54, "y": 0.54, "z": 0.0}]}]},
    ]
    audit_res = auditor.audit_sequence(sample_seq)
    assert audit_res["quality_status"] == "PASSED", f"Quality audit failed: {audit_res}"
    print("QualityAuditor test passed!")

    print("Testing DataAugmenter...")
    augmenter = DataAugmenter()
    aug_seq = augmenter.augment_sequence(sample_seq, rotation_degrees=15.0, scale_factor=1.1, noise_std=0.01)
    assert len(aug_seq) == len(sample_seq), "Augmented sequence length mismatch!"
    print("DataAugmenter test passed!")

    print("Testing DatasetManager & ExporterEngine...")
    manager = DatasetManager()
    # Create a dummy sample file for testing splits and export
    sample_file = os.path.join(manager.storage_dir, "test_sample_1.json")
    import json
    with open(sample_file, "w", encoding="utf-8") as f:
        json.dump({"sample_id": "test_sample_1", "label": "HELLO", "sequence": sample_seq}, f)

    manager = DatasetManager()
    stats = manager.compute_statistics()
    assert "total_samples" in stats, "Statistics failed!"

    splits = manager.generate_splits(0.7, 0.15, 0.15)
    assert "summary" in splits, "Split failed!"

    exporter = ExporterEngine()
    exp_json = exporter.export_full_dataset("json")
    assert os.path.exists(exp_json), "JSON export failed!"
    print("ExporterEngine test passed!")

    print("All Phase 3 backend tests executed successfully!")

if __name__ == "__main__":
    test_phase3_pipeline()
