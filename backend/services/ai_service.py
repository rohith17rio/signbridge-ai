import time
from typing import Dict, Any, List, Optional
from ai.router.gesture_router import GestureRouter
from ai.static.static_model import StaticGestureModel
from ai.dynamic.lstm_model import DynamicGesturePredictor
from ai.fusion.prediction_fusion import PredictionFusionEngine
from ai.learning.personal_learning import PersonalLearningEngine
from utils.logger import logger

class AIService:
    """
    Central Singleton Service orchestrating the complete Multi-Model AI Engine:
    Landmarks -> Router -> Static/Dynamic Model -> Fusion & Temporal Stabilization.
    """
    _instance: Optional["AIService"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIService, cls).__new__(cls)
            cls._instance.router = GestureRouter()
            cls._instance.static_model = StaticGestureModel()
            cls._instance.dynamic_model = DynamicGesturePredictor()
            cls._instance.fusion_engine = PredictionFusionEngine()
            cls._instance.personal_learning = PersonalLearningEngine()
            cls._instance.is_loaded = True
            cls._instance.active_model_name = "SignBridge-MultiModel-v1.0"
        return cls._instance

    def predict_sign(self, sequence_frames: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Runs multi-model inference pipeline on input landmark frame sequence."""
        if not sequence_frames:
            return self.fusion_engine.fuse_and_stabilize("Unknown Gesture", 0.0, [], "NONE")

        start_time = time.time()
        gesture_type = self.router.determine_gesture_type(sequence_frames)

        if gesture_type == "STATIC":
            # Extract feature vector from latest frame
            latest_frame = sequence_frames[-1]
            hands = latest_frame.get("hands", [])
            fvec = hands[0].get("feature_vector", []) if hands else []
            raw_pred, conf, alts = self.static_model.predict(fvec)
        else:
            # Extract sequence feature matrix
            seq_matrix = []
            for f in sequence_frames:
                for h in f.get("hands", []):
                    fvec = h.get("feature_vector", [])
                    if fvec:
                        seq_matrix.append(fvec)
            raw_pred, conf, alts = self.dynamic_model.predict_sequence(seq_matrix)

        elapsed_ms = round((time.time() - start_time) * 1000, 2)
        fused = self.fusion_engine.fuse_and_stabilize(raw_pred, conf, alts, gesture_type)
        fused["latency_ms"] = elapsed_ms
        fused["model_version"] = self.active_model_name
        return fused

    def get_model_status(self) -> Dict[str, Any]:
        return {
            "status": "loaded" if self.is_loaded else "unloaded",
            "active_model": self.active_model_name,
            "version": "1.0.0",
            "static_model_type": self.static_model.model_type,
            "dynamic_model_type": "LSTM",
            "classes_count": len(self.dynamic_model.classes),
            "latency_target_ms": 20,
        }

ai_service = AIService()
