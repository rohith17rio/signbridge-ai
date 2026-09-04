import math
import random
import copy
import numpy as np
from typing import List, Dict, Any

class DataAugmenter:
    """
    Applies 3D spatial and temporal data augmentations to landmark sequences.
    """
    def augment_sequence(
        self,
        sequence: List[Dict[str, Any]],
        rotation_degrees: float = 10.0,
        scale_factor: float = 1.1,
        noise_std: float = 0.005,
        speed_rate: float = 1.0,
        target_length: int = 0
    ) -> List[Dict[str, Any]]:
        if not sequence:
            return []

        aug_sequence = copy.deepcopy(sequence)

        # 1. Temporal Speed Adjustment / Resampling
        if speed_rate != 1.0 and speed_rate > 0:
            indices = np.linspace(0, len(aug_sequence) - 1, num=int(len(aug_sequence) / speed_rate)).astype(int)
            aug_sequence = [aug_sequence[i] for i in indices]

        # 2. 3D Spatial Transforms (Rotation, Scaling, Gaussian Noise)
        rad = math.radians(rotation_degrees)
        cos_a, sin_a = math.cos(rad), math.sin(rad)

        for frame in aug_sequence:
            for hand in frame.get("hands", []):
                raw_lm = hand.get("raw_landmarks", [])
                norm_lm = hand.get("normalized_landmarks", [])

                for lm in raw_lm:
                    # Rotation around Z-axis
                    x, y = lm["x"], lm["y"]
                    lm["x"] = round(x * cos_a - y * sin_a + random.gauss(0, noise_std), 5)
                    lm["y"] = round(x * sin_a + y * cos_a + random.gauss(0, noise_std), 5)
                    lm["z"] = round(lm["z"] * scale_factor + random.gauss(0, noise_std), 5)

                for nlm in norm_lm:
                    nx, ny = nlm["norm_x"], nlm["norm_y"]
                    nlm["norm_x"] = round((nx * cos_a - ny * sin_a) * scale_factor + random.gauss(0, noise_std), 5)
                    nlm["norm_y"] = round((nx * sin_a + ny * cos_a) * scale_factor + random.gauss(0, noise_std), 5)
                    nlm["norm_z"] = round(nlm["norm_z"] * scale_factor + random.gauss(0, noise_std), 5)

                # Rebuild Feature Vector
                hand["feature_vector"] = self._rebuild_feature_vector(hand, raw_lm, norm_lm)

        # 3. Target Sequence Padding / Trimming
        if target_length > 0:
            curr_len = len(aug_sequence)
            if curr_len < target_length:
                # Pad with last frame
                last_frame = copy.deepcopy(aug_sequence[-1]) if aug_sequence else {}
                while len(aug_sequence) < target_length:
                    aug_sequence.append(last_frame)
            elif curr_len > target_length:
                aug_sequence = aug_sequence[:target_length]

        return aug_sequence

    @staticmethod
    def _rebuild_feature_vector(hand: Dict[str, Any], raw_lm: List[Dict[str, Any]], norm_lm: List[Dict[str, Any]]) -> List[float]:
        vec = []
        hand_code = 1.0 if hand.get("hand_type") == "Right" else -1.0
        vec.append(hand_code)
        for lm in raw_lm:
            vec.extend([lm.get("x", 0.0), lm.get("y", 0.0), lm.get("z", 0.0)])
        for nlm in norm_lm:
            vec.extend([nlm.get("norm_x", 0.0), nlm.get("norm_y", 0.0), nlm.get("norm_z", 0.0)])
        return vec
