from collections import deque, Counter
from typing import List, Dict, Any, Tuple

class PredictionFusionEngine:
    """
    Combines static/dynamic predictions, applies temporal sliding window majority voting,
    computes confidence metrics, and flags Unknown Gestures below confidence threshold.
    """
    def __init__(self, confidence_threshold: float = 0.60, window_size: int = 7):
        self.confidence_threshold = confidence_threshold
        self.window_size = window_size
        self.history_buffer = deque(maxlen=window_size)

    def fuse_and_stabilize(
        self,
        predicted_class: str,
        confidence: float,
        alternatives: List[Tuple[str, float]],
        gesture_path: str = "STATIC"
    ) -> Dict[str, Any]:
        """
        Applies temporal sliding-window smoothing over recent predictions.
        """
        if confidence < self.confidence_threshold:
            stabilized_gesture = "Unknown Gesture"
            is_unknown = True
        else:
            self.history_buffer.append(predicted_class)
            counts = Counter(self.history_buffer)
            stabilized_gesture, _ = counts.most_common(1)[0]
            is_unknown = False

        return {
            "prediction": stabilized_gesture,
            "raw_prediction": predicted_class,
            "confidence_percentage": round(confidence * 100, 1),
            "confidence_decimal": round(confidence, 3),
            "path_used": gesture_path,
            "is_unknown": is_unknown,
            "top_3_alternatives": [
                {"label": alt[0], "percentage": round(alt[1] * 100, 1)} for alt in alternatives
            ],
            "options": {
                "record_gesture": is_unknown,
                "save_sample": is_unknown,
                "add_label": is_unknown,
            }
        }
