import os
import json
import time
from typing import List, Dict, Any, Optional
from utils.logger import logger

class PersonalLearningEngine:
    """
    Manages custom user-defined gesture samples, labels, and adaptive model updates.
    """
    def __init__(self, storage_dir: Optional[str] = None):
        if storage_dir is None:
            storage_dir = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "datasets", "personal"
            )
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)

    def add_personal_gesture(self, gesture_name: str, phrase_translation: str, landmark_sequence: List[Any]) -> Dict[str, Any]:
        """Saves a personal user gesture sequence and updates local dataset registry."""
        sample_id = f"PERSONAL_{gesture_name.upper().replace(' ', '_')}_{int(time.time())}"
        filepath = os.path.join(self.storage_dir, f"{sample_id}.json")

        payload = {
            "sample_id": sample_id,
            "gesture_name": gesture_name.upper(),
            "phrase_translation": phrase_translation,
            "is_personal": True,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "frame_count": len(landmark_sequence),
            "sequence": landmark_sequence,
        }

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)

        logger.info(f"Registered personal gesture sample '{sample_id}' with phrase '{phrase_translation}'")

        return {
            "status": "success",
            "sample_id": sample_id,
            "gesture_name": gesture_name.upper(),
            "filepath": filepath,
            "message": f"Personal gesture '{gesture_name}' added to training queue."
        }
