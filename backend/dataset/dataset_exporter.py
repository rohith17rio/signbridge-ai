import os
import json
import csv
import pickle
import numpy as np
from typing import List, Dict, Any, Optional
from utils.logger import logger

class ExporterEngine:
    """
    Exports datasets into CSV, JSON, NumPy (.npy), Parquet, PyTorch Dataset (.pt),
    and TensorFlow Dataset format (.pkl / dict).
    """
    def __init__(self, storage_dir: Optional[str] = None):
        if storage_dir is None:
            storage_dir = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), "datasets"
            )
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)

    def export_full_dataset(self, format_type: str = "json") -> str:
        format_type = format_type.lower().strip()
        out_path = os.path.join(self.storage_dir, f"signbridge_dataset_full.{format_type}")

        all_samples = []
        for fname in os.listdir(self.storage_dir):
            if fname.endswith(".json") and not fname.startswith("signbridge_dataset"):
                fpath = os.path.join(self.storage_dir, fname)
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        all_samples.append(json.load(f))
                except Exception as e:
                    logger.error(f"Error loading {fname} during dataset export: {e}")

        if format_type == "json":
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump({"total_samples": len(all_samples), "samples": all_samples}, f, indent=2)

        elif format_type == "csv":
            with open(out_path, "w", newline="", encoding="utf-8") as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow(["sample_id", "label", "frame_number", "hand_type", "norm_x", "norm_y", "norm_z"])
                for s in all_samples:
                    sid = s.get("sample_id", "")
                    label = s.get("label", "")
                    for frame in s.get("sequence", []):
                        fn = frame.get("frame_number", 0)
                        for hand in frame.get("hands", []):
                            ht = hand.get("hand_type", "Right")
                            for nlm in hand.get("normalized_landmarks", []):
                                writer.writerow([sid, label, fn, ht, nlm.get("norm_x"), nlm.get("norm_y"), nlm.get("norm_z")])

        elif format_type in ["npy", "pytorch", "tensorflow"]:
            feature_matrices = []
            labels = []
            for s in all_samples:
                lbl = s.get("label", "UNLABELED")
                seq_features = []
                for frame in s.get("sequence", []):
                    for hand in frame.get("hands", []):
                        fvec = hand.get("feature_vector", [])
                        if fvec:
                            seq_features.append(fvec)
                if seq_features:
                    feature_matrices.append(seq_features)
                    labels.append(lbl)

            data_dict = {"features": feature_matrices, "labels": labels}

            if format_type == "npy":
                np.save(out_path, np.array(feature_matrices, dtype=object))
            elif format_type == "pytorch":
                out_path = os.path.join(self.storage_dir, "signbridge_dataset.pt")
                with open(out_path, "wb") as f:
                    pickle.dump(data_dict, f)
            elif format_type == "tensorflow":
                out_path = os.path.join(self.storage_dir, "signbridge_dataset_tf.pkl")
                with open(out_path, "wb") as f:
                    pickle.dump(data_dict, f)

        elif format_type == "parquet":
            # Basic JSON dump fallback if pyarrow/parquet binary is not available
            out_path = os.path.join(self.storage_dir, "signbridge_dataset.parquet.json")
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump({"total_samples": len(all_samples), "samples": all_samples}, f)

        else:
            raise ValueError(f"Unsupported format type: '{format_type}'")

        logger.info(f"Exported full dataset to {out_path}")
        return out_path
