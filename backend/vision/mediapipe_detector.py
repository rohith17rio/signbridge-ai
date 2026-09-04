import cv2
try:
    import mediapipe as mp
    HAS_MEDIAPIPE = True
except ImportError:
    mp = None
    HAS_MEDIAPIPE = False

from typing import List, Dict, Any, Tuple
from utils.logger import logger

class MediaPipeDetector:
    """
    MediaPipe Hands detector supporting max 2 hands (Left & Right),
    continuous tracking, and confidence scoring.
    """
    def __init__(
        self,
        static_image_mode: bool = False,
        max_num_hands: int = 2,
        min_detection_confidence: float = 0.7,
        min_tracking_confidence: float = 0.7
    ):
        if HAS_MEDIAPIPE:
            self.mp_hands = mp.solutions.hands
            self.detector = self.mp_hands.Hands(
                static_image_mode=static_image_mode,
                max_num_hands=max_num_hands,
                min_detection_confidence=min_detection_confidence,
                min_tracking_confidence=min_tracking_confidence
            )
        else:
            self.mp_hands = None
            self.detector = None
        logger.info(
            f"Initialized MediaPipeDetector (max_hands={max_num_hands}, "
            f"min_detection={min_detection_confidence}, min_tracking={min_tracking_confidence})"
        )

    def process_frame(self, frame_bgr) -> Any:
        """Processes a BGR image frame through MediaPipe Hands."""
        if frame_bgr is None or not HAS_MEDIAPIPE or self.detector is None:
            return None

        # Convert BGR image to RGB for MediaPipe
        frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        results = self.detector.process(frame_rgb)
        return results

    def extract_hand_tracks(self, results) -> List[Dict[str, Any]]:
        """
        Extracts structured hand tracking data for all detected hands in frame.
        """
        hand_tracks = []
        if not results or not results.multi_hand_landmarks:
            return hand_tracks

        multi_landmarks = results.multi_hand_landmarks
        multi_handedness = results.multi_handedness or []

        for idx, hand_landmarks in enumerate(multi_landmarks):
            hand_type = "Right"
            score = 0.9

            if idx < len(multi_handedness):
                handedness_info = multi_handedness[idx].classification[0]
                hand_type = handedness_info.label  # 'Left' or 'Right'
                score = round(handedness_info.score, 3)

            hand_tracks.append({
                "hand_index": idx,
                "hand_type": hand_type,
                "confidence": score,
                "landmarks": hand_landmarks,
            })

        return hand_tracks

    def close(self):
        self.detector.close()
        logger.info("MediaPipeDetector closed.")
