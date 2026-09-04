import math
import time
import numpy as np
from typing import List, Dict, Any

class LandmarkProcessor:
    """
    Processes 21 3D hand landmarks, computes position and scale invariant
    normalized coordinates, and formats feature vectors for ML models.
    """
    LANDMARK_NAMES = [
        "WRIST",
        "THUMB_CMC", "THUMB_MCP", "THUMB_IP", "THUMB_TIP",
        "INDEX_FINGER_MCP", "INDEX_FINGER_PIP", "INDEX_FINGER_DIP", "INDEX_FINGER_TIP",
        "MIDDLE_FINGER_MCP", "MIDDLE_FINGER_PIP", "MIDDLE_FINGER_DIP", "MIDDLE_FINGER_TIP",
        "RING_FINGER_MCP", "RING_FINGER_PIP", "RING_FINGER_DIP", "RING_FINGER_TIP",
        "PINKY_MCP", "PINKY_PIP", "PINKY_DIP", "PINKY_TIP"
    ]

    def extract_landmarks(
        self,
        hand_track: Dict[str, Any],
        frame_number: int,
        img_width: int = 1280,
        img_height: int = 720
    ) -> Dict[str, Any]:
        """
        Extracts 21 raw and normalized coordinates for a single hand track.
        """
        hand_type = hand_track["hand_type"]
        confidence = hand_track["confidence"]
        mp_landmarks = hand_track["landmarks"]
        timestamp = time.time()

        raw_landmarks = []
        for id, lm in enumerate(mp_landmarks.landmark):
            raw_landmarks.append({
                "id": id,
                "name": self.LANDMARK_NAMES[id],
                "x": round(lm.x, 5),
                "y": round(lm.y, 5),
                "z": round(lm.z, 5),
                "px": int(lm.x * img_width),
                "py": int(lm.y * img_height),
                "visibility": round(getattr(lm, "visibility", 1.0), 3)
            })

        # Calculate Normalized Coordinates (Wrist centered & Palm scale normalized)
        normalized_landmarks = self.normalize_coordinates(raw_landmarks)

        # Build ML Feature Vector
        feature_vector = self.build_feature_vector(raw_landmarks, normalized_landmarks, hand_type)

        return {
            "frame_number": frame_number,
            "timestamp": timestamp,
            "hand_type": hand_type,
            "confidence": confidence,
            "raw_landmarks": raw_landmarks,
            "normalized_landmarks": normalized_landmarks,
            "feature_vector": feature_vector,
        }

    def normalize_coordinates(self, raw_landmarks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Normalizes 3D landmarks relative to wrist origin (0,0,0)
        and scaled by distance between Wrist (0) and Middle MCP (9).
        """
        if not raw_landmarks:
            return []

        wrist = raw_landmarks[0]
        middle_mcp = raw_landmarks[9]

        # Calculate palm distance scale factor
        dx = middle_mcp["x"] - wrist["x"]
        dy = middle_mcp["y"] - wrist["y"]
        dz = middle_mcp["z"] - wrist["z"]
        scale_factor = math.sqrt(dx * dx + dy * dy + dz * dz)
        if scale_factor == 0:
            scale_factor = 1.0

        normalized = []
        for lm in raw_landmarks:
            norm_x = round((lm["x"] - wrist["x"]) / scale_factor, 5)
            norm_y = round((lm["y"] - wrist["y"]) / scale_factor, 5)
            norm_z = round((lm["z"] - wrist["z"]) / scale_factor, 5)

            normalized.append({
                "id": lm["id"],
                "name": lm["name"],
                "norm_x": norm_x,
                "norm_y": norm_y,
                "norm_z": norm_z,
            })

        return normalized

    def build_feature_vector(
        self,
        raw_landmarks: List[Dict[str, Any]],
        normalized_landmarks: List[Dict[str, Any]],
        hand_type: str
    ) -> List[float]:
        """
        Flattens 21 (x, y, z) raw + 21 (x, y, z) normalized landmarks into 126-float array.
        """
        vec = []
        # Hand type encoding: 1.0 for Right, -1.0 for Left
        hand_code = 1.0 if hand_type == "Right" else -1.0
        vec.append(hand_code)

        for lm in raw_landmarks:
            vec.extend([lm["x"], lm["y"], lm["z"]])

        for lm in normalized_landmarks:
            vec.extend([lm["norm_x"], lm["norm_y"], lm["norm_z"]])

        return vec
