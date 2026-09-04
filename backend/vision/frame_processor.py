from typing import Dict, Any, Tuple, Optional
from vision.camera_manager import CameraManager
from vision.mediapipe_detector import MediaPipeDetector
from vision.landmark_processor import LandmarkProcessor
from vision.visualizer import Visualizer
from vision.data_exporter import DataExporter

class FrameProcessor:
    """
    Orchestrates the entire Computer Vision Engine pipeline:
    Frame Capture -> MediaPipe Detection -> 21 Landmark Extraction & Normalization
    -> Skeleton Overlay Drawing -> Dataset Recording & Export.
    """
    def __init__(self):
        self.camera_manager = CameraManager()
        self.detector = MediaPipeDetector()
        self.landmark_processor = LandmarkProcessor()
        self.visualizer = Visualizer()
        self.data_exporter = DataExporter()

    def process_next_frame(self) -> Tuple[bool, Optional[Any], Dict[str, Any]]:
        """
        Processes the next live video frame through the full vision pipeline.
        Returns (success, annotated_frame_bgr, telemetry_dict).
        """
        ret, frame = self.camera_manager.read_frame()
        if not ret or frame is None:
            return False, None, {"status": "no_frame", "hands_detected": 0}

        # MediaPipe Detection
        results = self.detector.process_frame(frame)
        hand_tracks = self.detector.extract_hand_tracks(results)

        # Process 21 landmarks & normalization per hand
        processed_hands = []
        for track in hand_tracks:
            extracted = self.landmark_processor.extract_landmarks(
                hand_track=track,
                frame_number=self.camera_manager.frame_count,
                img_width=self.camera_manager.width,
                img_height=self.camera_manager.height
            )
            processed_hands.append(extracted)

        # Draw Skeleton & Metrics Overlay
        annotated_frame = self.visualizer.draw_skeleton_overlay(
            frame_bgr=frame,
            results=results,
            fps=self.camera_manager.fps
        )

        frame_telemetry = {
            "status": "success",
            "frame_number": self.camera_manager.frame_count,
            "fps": self.camera_manager.fps,
            "resolution": {"width": self.camera_manager.width, "height": self.camera_manager.height},
            "hands_detected": len(processed_hands),
            "hands": processed_hands,
            "is_recording": self.data_exporter.is_recording,
            "recording_label": self.data_exporter.active_label,
        }

        # If recording mode is active, buffer landmark telemetry frame
        if self.data_exporter.is_recording:
            self.data_exporter.add_recording_frame(frame_telemetry)

        return True, annotated_frame, frame_telemetry
