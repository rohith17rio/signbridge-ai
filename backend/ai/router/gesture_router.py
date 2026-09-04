import numpy as np
from typing import List, Dict, Any

class GestureRouter:
    """
    Analyzes spatial movement velocity and variance across consecutive frames
    to route input gestures to either STATIC or DYNAMIC model path.
    """
    def __init__(self, velocity_threshold: float = 0.02, variance_threshold: float = 0.001):
        self.velocity_threshold = velocity_threshold
        self.variance_threshold = variance_threshold

    def determine_gesture_type(self, sequence_frames: List[Dict[str, Any]]) -> str:
        """
        Calculates landmark displacement velocity and variance across frames.
        Returns 'STATIC' or 'DYNAMIC'.
        """
        if not sequence_frames or len(sequence_frames) < 3:
            return "STATIC"

        velocities = []
        positions = []

        for f_idx in range(len(sequence_frames)):
            frame = sequence_frames[f_idx]
            hands = frame.get("hands", [])
            if not hands:
                continue

            # Extract wrist & index tip position (landmarks 0 and 8)
            lm_list = hands[0].get("raw_landmarks", [])
            if len(lm_list) > 8:
                wrist = lm_list[0]
                index_tip = lm_list[8]
                pos = [wrist["x"], wrist["y"], wrist["z"], index_tip["x"], index_tip["y"], index_tip["z"]]
                positions.append(pos)

        if len(positions) < 2:
            return "STATIC"

        pos_arr = np.array(positions)
        diffs = np.diff(pos_arr, axis=0)
        frame_velocities = np.linalg.norm(diffs, axis=1)

        avg_velocity = float(np.mean(frame_velocities))
        spatial_variance = float(np.mean(np.var(pos_arr, axis=0)))

        if avg_velocity > self.velocity_threshold or spatial_variance > self.variance_threshold:
            return "DYNAMIC"
        else:
            return "STATIC"
