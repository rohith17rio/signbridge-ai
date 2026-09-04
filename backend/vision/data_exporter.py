import os
import json
import csv
import time
import numpy as np
from typing import List, Dict, Any, Optional
from utils.logger import logger

class DataExporter:
    """
    Handles recording landmark sequences, attaching gesture labels,
    saving dataset samples, and exporting to CSV, JSON, and NumPy (.npy) files.
    """
    def __init__(self, storage_dir: Optional[str] = None):
        if storage_dir is None:
            storage_dir = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), "datasets"
            )
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)
        self.is_recording = False
        self.active_label = "UNLABELED"
        self.recorded_frames: List[Dict[str, Any]] = []
        self.recording_start_time = 0.0

    def start_recording(self, label: str = "UNLABELED"):
        self.is_recording = True
        self.active_label = label.upper().strip() or "UNLABELED"
        self.recorded_frames = []
        self.recording_start_time = time.time()
        logger.info(f"Started recording dataset sequence for label: '{self.active_label}'")

    def add_recording_frame(self, frame_landmark_data: Dict[str, Any]):
        if self.is_recording:
            self.recorded_frames.append(frame_landmark_data)

    def stop_recording(self) -> Dict[str, Any]:
        self.is_recording = False
        duration = round(time.time() - self.recording_start_time, 2)
        sample_info = {
            "label": self.active_label,
            "frame_count": len(self.recorded_frames),
            "duration_seconds": duration,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        }
        logger.info(f"Stopped recording. Recorded {len(self.recorded_frames)} frames for gesture '{self.active_label}'")
        return sample_info

    def save_recorded_sample(self, label: Optional[str] = None, source: str = "DATASET_UPLOAD") -> Dict[str, Any]:
        if label:
            self.active_label = label.upper().strip()

        sample_id = f"{self.active_label}_{int(time.time())}"
        filepath_json = os.path.join(self.storage_dir, f"{sample_id}.json")

        payload = {
            "sample_id": sample_id,
            "label": self.active_label,
            "source": source,
            "frame_count": len(self.recorded_frames),
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "sequence": self.recorded_frames,
        }

        with open(filepath_json, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)

        logger.info(f"Saved dataset sample to JSON: {filepath_json}")
        return payload

    def list_samples(self) -> List[Dict[str, Any]]:
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
                            "label": data.get("label", "UNKNOWN"),
                            "frame_count": data.get("frame_count", len(data.get("sequence", []))),
                            "created_at": data.get("created_at", "N/A"),
                            "filepath": fpath,
                        })
                except Exception as e:
                    logger.error(f"Error reading dataset JSON {fname}: {e}")

        # Sort by creation timestamp descending
        samples.sort(key=lambda s: s.get("created_at", ""), reverse=True)
        return samples

    def delete_sample(self, sample_id: str) -> bool:
        deleted = False
        for ext in [".json", ".csv", ".npy"]:
            fpath = os.path.join(self.storage_dir, f"{sample_id}{ext}")
            if os.path.exists(fpath):
                os.remove(fpath)
                deleted = True
                logger.info(f"Deleted sample file: {fpath}")
        return deleted

    def export_dataset(self, sample_id: str, format_type: str = "json") -> str:
        """
        Exports a stored sample to requested format ('json', 'csv', or 'npy').
        """
        json_path = os.path.join(self.storage_dir, f"{sample_id}.json")
        if not os.path.exists(json_path):
            raise FileNotFoundError(f"Sample JSON file not found: {json_path}")

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        format_type = format_type.lower().strip()
        out_path = os.path.join(self.storage_dir, f"{sample_id}.{format_type}")

        if format_type == "json":
            return json_path

        elif format_type == "csv":
            sequence = data.get("sequence", [])
            with open(out_path, "w", newline="", encoding="utf-8") as csvfile:
                writer = csv.writer(csvfile)
                # Write CSV header
                header = ["frame_number", "timestamp", "hand_type", "confidence", "landmark_id", "raw_x", "raw_y", "raw_z", "norm_x", "norm_y", "norm_z"]
                writer.writerow(header)

                for frame in sequence:
                    fn = frame.get("frame_number", 0)
                    ts = frame.get("timestamp", 0.0)
                    for hand in frame.get("hands", []):
                        ht = hand.get("hand_type", "Right")
                        conf = hand.get("confidence", 0.0)
                        raw_lm = hand.get("raw_landmarks", [])
                        norm_lm = hand.get("normalized_landmarks", [])

                        for idx in range(len(raw_lm)):
                            rl = raw_lm[idx]
                            nl = norm_lm[idx] if idx < len(norm_lm) else {}
                            writer.writerow([
                                fn, ts, ht, conf, rl.get("id"),
                                rl.get("x"), rl.get("y"), rl.get("z"),
                                nl.get("norm_x", 0), nl.get("norm_y", 0), nl.get("norm_z", 0)
                            ])
            logger.info(f"Exported sample to CSV: {out_path}")
            return out_path

        elif format_type == "npy":
            sequence = data.get("sequence", [])
            feature_matrix = []
            for frame in sequence:
                for hand in frame.get("hands", []):
                    fvec = hand.get("feature_vector", [])
                    if fvec:
                        feature_matrix.append(fvec)

            arr = np.array(feature_matrix, dtype=np.float32)
            np.save(out_path, arr)
            logger.info(f"Exported sample to NumPy .npy: {out_path} (shape {arr.shape})")
            return out_path

        else:
            raise ValueError(f"Unsupported export format type: '{format_type}'")
