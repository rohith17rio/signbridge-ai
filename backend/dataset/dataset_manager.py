import os
import json
import random
import time
from typing import List, Dict, Any, Optional
from utils.logger import logger

class DatasetManager:
    """
    Manages datasets, versioning, train/val/test splits,
    class distribution metrics, searching, and filtering.
    """
    def __init__(self, storage_dir: Optional[str] = None):
        if storage_dir is None:
            storage_dir = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), "datasets"
            )
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)

    def compute_statistics(self) -> Dict[str, Any]:
        """Calculates global dataset statistics, gesture balances, and sample counts."""
        samples = self.list_all_samples()
        total_samples = len(samples)

        class_counts: Dict[str, int] = {}
        total_frames = 0

        for s in samples:
            label = s.get("label", "UNLABELED")
            class_counts[label] = class_counts.get(label, 0) + 1
            total_frames += s.get("frame_count", 0)

        avg_seq_length = round(total_frames / max(1, total_samples), 1)

        return {
            "total_samples": total_samples,
            "total_gestures": len(class_counts),
            "class_distribution": class_counts,
            "total_frames": total_frames,
            "avg_sequence_length": avg_seq_length,
            "version": "1.0.0",
        }

    def list_all_samples(self) -> List[Dict[str, Any]]:
        samples = []
        if not os.path.exists(self.storage_dir):
            return samples

        for fname in os.listdir(self.storage_dir):
            if fname.endswith(".json"):
                fpath = os.path.join(self.storage_dir, fname)
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        samples.append({
                            "sample_id": data.get("sample_id", fname.replace(".json", "")),
                            "label": data.get("label", "UNLABELED"),
                            "frame_count": data.get("frame_count", len(data.get("sequence", []))),
                            "created_at": data.get("created_at", "N/A"),
                            "author": data.get("author", "ADMIN"),
                            "language": data.get("language", "ASL"),
                            "filepath": fpath,
                        })
                except Exception as e:
                    logger.error(f"Error loading sample JSON {fname}: {e}")

        samples.sort(key=lambda s: s.get("created_at", ""), reverse=True)
        return samples

    def generate_splits(
        self,
        train_ratio: float = 0.70,
        val_ratio: float = 0.15,
        test_ratio: float = 0.15,
        seed: int = 42
    ) -> Dict[str, Any]:
        """Splits samples into reproducible Train / Validation / Test sets."""
        samples = self.list_all_samples()
        if not samples:
            return {"train": [], "val": [], "test": []}

        random.seed(seed)
        shuffled = list(samples)
        random.shuffle(shuffled)

        n_total = len(shuffled)
        n_train = int(n_total * train_ratio)
        n_val = int(n_total * val_ratio)

        train_set = shuffled[:n_train]
        val_set = shuffled[n_train:n_train + n_val]
        test_set = shuffled[n_train + n_val:]

        return {
            "summary": {
                "total_samples": n_total,
                "train_count": len(train_set),
                "val_count": len(val_set),
                "test_count": len(test_set),
                "ratios": {"train": train_ratio, "val": val_ratio, "test": test_ratio}
            },
            "train": [s["sample_id"] for s in train_set],
            "val": [s["sample_id"] for s in val_set],
            "test": [s["sample_id"] for s in test_set],
        }
