import os
import cv2
import hashlib
import time
from typing import Dict, Any, List, Tuple, Optional
from vision.mediapipe_detector import MediaPipeDetector
from vision.landmark_processor import LandmarkProcessor
from utils.logger import logger

SUPPORTED_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".webm"}

class VideoImporter:
    """
    Validates, inspects, and extracts MediaPipe hand landmark sequences
    from uploaded or public sign language video files.
    """
    def __init__(self):
        self.detector = MediaPipeDetector()
        self.landmark_processor = LandmarkProcessor()

    @staticmethod
    def compute_file_hash(filepath: str) -> str:
        """Computes SHA-256 hash of a file to detect duplicates."""
        hasher = hashlib.sha256()
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hasher.update(chunk)
        return hasher.hexdigest()

    def validate_video(self, filepath: str) -> Dict[str, Any]:
        """
        Validates video file existence, format extension, resolution, FPS,
        duration, frame count, and checks for corruption.
        """
        if not os.path.exists(filepath):
            return {"is_valid": False, "error": f"File not found: {filepath}"}

        ext = os.path.splitext(filepath)[1].lower()
        if ext not in SUPPORTED_EXTENSIONS:
            return {
                "is_valid": False,
                "error": f"Unsupported video extension '{ext}'. Supported: {list(SUPPORTED_EXTENSIONS)}"
            }

        cap = cv2.VideoCapture(filepath)
        if not cap.isOpened():
            return {"is_valid": False, "error": "Corrupted or unreadable video file."}

        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        duration = round(frame_count / fps, 2) if fps > 0 else 0.0

        ret, first_frame = cap.read()
        cap.release()

        if not ret or first_frame is None:
            return {"is_valid": False, "error": "Unable to read initial frame. Video may be empty or corrupted."}

        file_size_bytes = os.path.getsize(filepath)
        file_hash = self.compute_file_hash(filepath)

        return {
            "is_valid": True,
            "filepath": filepath,
            "filename": os.path.basename(filepath),
            "extension": ext,
            "file_size_bytes": file_size_bytes,
            "file_hash": file_hash,
            "resolution": {"width": width, "height": height},
            "fps": round(fps, 2),
            "frame_count": frame_count,
            "duration_seconds": duration,
        }

    def process_video_file(self, filepath: str, progress_callback=None) -> Dict[str, Any]:
        """
        Extracts frames sequentially, runs MediaPipe hand detection & normalization,
        and builds a complete landmark sequence structure (Memory-Safe).
        """
        import gc
        validation = self.validate_video(filepath)
        if not validation["is_valid"]:
            return {"status": "error", "error": validation["error"]}

        cap = cv2.VideoCapture(filepath)
        total_frames = validation["frame_count"]
        img_width = validation["resolution"]["width"]
        img_height = validation["resolution"]["height"]

        sequence_frames = []
        frame_idx = 0
        hands_detected_total = 0
        start_time = time.time()

        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret or frame is None:
                    break

                frame_idx += 1

                # Run MediaPipe Hands detector
                results = self.detector.process_frame(frame)
                hand_tracks = self.detector.extract_hand_tracks(results)

                processed_hands = []
                for track in hand_tracks:
                    extracted = self.landmark_processor.extract_landmarks(
                        hand_track=track,
                        frame_number=frame_idx,
                        img_width=img_width,
                        img_height=img_height
                    )
                    processed_hands.append(extracted)

                hands_detected_total += len(processed_hands)

                frame_payload = {
                    "frame_number": frame_idx,
                    "timestamp": round(frame_idx / validation["fps"], 3) if validation["fps"] > 0 else 0.0,
                    "hands_count": len(processed_hands),
                    "hands": processed_hands,
                }

                sequence_frames.append(frame_payload)

                if progress_callback and total_frames > 0:
                    progress_percent = round((frame_idx / total_frames) * 100, 1)
                    progress_callback(frame_idx, total_frames, progress_percent)

        finally:
            cap.release()
            del cap
            gc.collect()

        elapsed_time = round(time.time() - start_time, 2)

        return {
            "status": "success",
            "video_metadata": validation,
            "processing_summary": {
                "processed_frames": frame_idx,
                "total_hands_detected": hands_detected_total,
                "avg_hands_per_frame": round(hands_detected_total / max(1, frame_idx), 2),
                "processing_time_seconds": elapsed_time,
            },
            "sequence": sequence_frames,
        }

    def bulk_import_folder(self, folder_path: str, data_exporter=None, chunk_size: int = 10) -> Dict[str, Any]:
        """
        Recursively scans a root dataset directory (e.g., INCLUDE, WLASL, ISL),
        treats subfolders as gesture labels, processes video files in memory-safe chunks (10 videos),
        and saves each valid sample into the master dataset repository.
        """
        import gc
        if not os.path.exists(folder_path) or not os.path.isdir(folder_path):
            return {"status": "error", "error": f"Dataset directory not found or invalid: {folder_path}"}

        start_time = time.time()
        subfolders = [d for d in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, d))]

        if not subfolders:
            subfolders = ["."]

        total_folders = len(subfolders)
        total_videos = 0
        imported_count = 0
        categories_set = set()
        skipped_files: List[Dict[str, str]] = []

        logger.info(f"Starting Memory-Safe Bulk Dataset Import from: {folder_path} (Chunk size: {chunk_size})")

        for f_idx, subfolder_name in enumerate(subfolders):
            subfolder_dir = folder_path if subfolder_name == "." else os.path.join(folder_path, subfolder_name)
            gesture_label = "UNLABELED" if subfolder_name == "." else subfolder_name.upper().strip()

            video_files = [
                f for f in os.listdir(subfolder_dir)
                if os.path.isfile(os.path.join(subfolder_dir, f)) and os.path.splitext(f)[1].lower() in SUPPORTED_EXTENSIONS
            ]

            total_videos += len(video_files)
            logger.info(f"Processing Folder [{f_idx + 1}/{total_folders}]: '{gesture_label}' ({len(video_files)} video files)")

            # Process in small memory-safe chunks
            for i in range(0, len(video_files), chunk_size):
                chunk = video_files[i:i + chunk_size]
                for video_fname in chunk:
                    video_fpath = os.path.join(subfolder_dir, video_fname)
                    try:
                        res = self.process_video_file(video_fpath)
                        if res.get("status") == "success":
                            imported_count += 1
                            categories_set.add(gesture_label)
                            if data_exporter:
                                data_exporter.recorded_frames = res["sequence"]
                                data_exporter.active_label = gesture_label
                                data_exporter.save_recorded_sample(gesture_label, source="BULK_IMPORT")
                        else:
                            skipped_files.append({"file": video_fname, "category": gesture_label, "reason": res.get("error", "Processing error")})
                    except Exception as e:
                        logger.warning(f"Skipping corrupted video '{video_fname}' in '{gesture_label}': {str(e)}")
                        skipped_files.append({"file": video_fname, "category": gesture_label, "reason": str(e)})

                # Force memory garbage collection after each chunk batch
                gc.collect()

        elapsed_seconds = round(time.time() - start_time, 2)
        summary = {
            "status": "success",
            "folder_path": folder_path,
            "total_folders": total_folders,
            "total_videos_found": total_videos,
            "total_imported": imported_count,
            "total_skipped": len(skipped_files),
            "categories_count": len(categories_set),
            "categories": sorted(list(categories_set)),
            "elapsed_seconds": elapsed_seconds,
            "skipped_files": skipped_files,
        }

        logger.info(
            f"Completed Memory-Safe Bulk Dataset Import: {imported_count} samples imported across {len(categories_set)} categories "
            f"({len(skipped_files)} skipped) in {elapsed_seconds}s"
        )
        return summary
