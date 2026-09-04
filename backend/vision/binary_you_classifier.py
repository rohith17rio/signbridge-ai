import math
import numpy as np
from typing import List, Dict, Any, Tuple

class BinaryYouClassifier:
    """
    Focused single-sign binary classifier specifically for the "YOU" pointing gesture.
    
    Gesture definition:
    - Index finger: Extended (pointing forward / outward towards the camera).
    - Middle, Ring, Pinky fingers: Curled / folded towards the palm.
    - Thumb: Folded in or resting comfortably beside curled fingers.
    """

    def __init__(self):
        self.confidence_threshold = 0.65

    def evaluate_landmarks(self, landmarks: List[Dict[str, Any]]) -> Tuple[bool, float, str]:
        """
        Evaluates a list of 21 hand landmarks (dict with x, y, z or norm_x, norm_y, norm_z).
        Returns (is_you_detected: bool, confidence: float, status_label: str)
        """
        if not landmarks or len(landmarks) < 21:
            return False, 0.0, "Waiting for sign..."

        # Wrist is landmark index 0, Middle MCP is landmark index 9
        wrist_lm = landmarks[0]
        middle_mcp_lm = landmarks[9]

        wx = wrist_lm.get("norm_x", wrist_lm["x"])
        wy = wrist_lm.get("norm_y", wrist_lm["y"])
        wz = wrist_lm.get("norm_z", wrist_lm["z"])

        mx = middle_mcp_lm.get("norm_x", middle_mcp_lm["x"])
        my = middle_mcp_lm.get("norm_y", middle_mcp_lm["y"])
        mz = middle_mcp_lm.get("norm_z", middle_mcp_lm["z"])

        scale = math.sqrt((mx - wx)**2 + (my - wy)**2 + (mz - wz)**2)
        if scale == 0:
            scale = 1.0

        def get_pos(idx: int) -> np.ndarray:
            lm = landmarks[idx]
            lx = lm.get("norm_x", lm["x"])
            ly = lm.get("norm_y", lm["y"])
            lz = lm.get("norm_z", lm["z"])
            return np.array([(lx - wx) / scale, (ly - wy) / scale, (lz - wz) / scale])

        wrist = get_pos(0)
        thumb_tip = get_pos(4)
        thumb_mcp = get_pos(2)

        index_mcp = get_pos(5)
        index_pip = get_pos(6)
        index_dip = get_pos(7)
        index_tip = get_pos(8)

        middle_mcp = get_pos(9)
        middle_tip = get_pos(12)

        ring_mcp = get_pos(13)
        ring_tip = get_pos(16)

        pinky_mcp = get_pos(17)
        pinky_tip = get_pos(20)

        # Distance calculations from wrist & MCP joints
        dist_wrist_index_tip = np.linalg.norm(index_tip - wrist)
        dist_wrist_index_mcp = np.linalg.norm(index_mcp - wrist)
        dist_index_mcp_tip = np.linalg.norm(index_tip - index_mcp)

        dist_wrist_middle_tip = np.linalg.norm(middle_tip - wrist)
        dist_wrist_middle_mcp = np.linalg.norm(middle_mcp - wrist)

        dist_wrist_ring_tip = np.linalg.norm(ring_tip - wrist)
        dist_wrist_ring_mcp = np.linalg.norm(ring_mcp - wrist)

        dist_wrist_pinky_tip = np.linalg.norm(pinky_tip - wrist)
        dist_wrist_pinky_mcp = np.linalg.norm(pinky_mcp - wrist)

        # Feature 1: Index extension ratio
        index_ext_ratio = dist_wrist_index_tip / max(dist_wrist_index_mcp, 1e-5)

        # Feature 2: Index finger straightness
        segment_sum = (
            np.linalg.norm(index_pip - index_mcp) +
            np.linalg.norm(index_dip - index_pip) +
            np.linalg.norm(index_tip - index_dip)
        )
        straightness = dist_index_mcp_tip / max(segment_sum, 1e-5)

        # Feature 3: Non-index finger curl ratios
        middle_ext_ratio = dist_wrist_middle_tip / max(dist_wrist_middle_mcp, 1e-5)
        ring_ext_ratio = dist_wrist_ring_tip / max(dist_wrist_ring_mcp, 1e-5)
        pinky_ext_ratio = dist_wrist_pinky_tip / max(dist_wrist_pinky_mcp, 1e-5)

        # Feature 4: Index extension relative to middle finger extension
        index_vs_middle_ratio = dist_wrist_index_tip / max(dist_wrist_middle_tip, 1e-5)

        # Scoring Logic
        scores = []

        # Index finger must be extended
        if index_ext_ratio > 1.35:
            scores.append(1.0)
        elif index_ext_ratio > 1.15:
            scores.append(0.6)
        else:
            scores.append(0.0)

        # Index finger straightness
        if straightness > 0.85:
            scores.append(1.0)
        elif straightness > 0.75:
            scores.append(0.7)
        else:
            scores.append(0.2)

        # Middle, Ring, Pinky curled
        curled_count = 0
        if middle_ext_ratio < 1.35: curled_count += 1
        if ring_ext_ratio < 1.35: curled_count += 1
        if pinky_ext_ratio < 1.35: curled_count += 1
        scores.append(curled_count / 3.0)

        # Index finger significantly more extended than middle finger
        if index_vs_middle_ratio > 1.20:
            scores.append(1.0)
        elif index_vs_middle_ratio > 1.05:
            scores.append(0.6)
        else:
            scores.append(0.1)

        confidence = round(float(np.mean(scores)), 2)

        if confidence >= self.confidence_threshold:
            return True, confidence, "YOU"
        else:
            return False, confidence, "Waiting for sign..."

binary_you_classifier = BinaryYouClassifier()
