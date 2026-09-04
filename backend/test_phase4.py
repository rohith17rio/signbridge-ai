import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, "/Users/apple/.gemini/antigravity-ide/scratch/signbridge-ai/backend")

from ai.router.gesture_router import GestureRouter
from ai.static.static_model import StaticGestureModel
from ai.dynamic.lstm_model import DynamicGesturePredictor
from ai.fusion.prediction_fusion import PredictionFusionEngine
from ai.learning.personal_learning import PersonalLearningEngine
from services.ai_service import ai_service

def test_phase4_ai_engine():
    print("1. Testing GestureRouter...")
    router = GestureRouter()
    static_frames = [
        {"hands": [{"raw_landmarks": [{"x": 0.5, "y": 0.5, "z": 0.0} for _ in range(21)]}]},
        {"hands": [{"raw_landmarks": [{"x": 0.5, "y": 0.5, "z": 0.0} for _ in range(21)]}]},
        {"hands": [{"raw_landmarks": [{"x": 0.5, "y": 0.5, "z": 0.0} for _ in range(21)]}]},
    ]
    route_result = router.determine_gesture_type(static_frames)
    assert route_result == "STATIC", f"Router expected STATIC, got {route_result}"
    print("   GestureRouter test passed!")

    print("2. Testing StaticGestureModel...")
    static_model = StaticGestureModel(model_type="random_forest")
    # Generate synthetic training data
    X = [[0.1] * 126, [0.9] * 126]
    y = ["YES", "NO"]
    train_res = static_model.train(X, y)
    assert train_res["accuracy"] == 1.0, "Static model training failed!"
    pred, conf, alts = static_model.predict([0.1] * 126)
    assert pred == "YES", f"Static model prediction failed, got {pred}"
    print("   StaticGestureModel test passed!")

    print("3. Testing DynamicGesturePredictor...")
    dynamic_model = DynamicGesturePredictor()
    pred_dyn, conf_dyn, alts_dyn = dynamic_model.predict_sequence([[0.1] * 126, [0.2] * 126])
    assert pred_dyn in dynamic_model.classes, "Dynamic model prediction failed!"
    print("   DynamicGesturePredictor test passed!")

    print("4. Testing PredictionFusionEngine...")
    fusion = PredictionFusionEngine()
    fused = fusion.fuse_and_stabilize("HELLO", 0.95, [("HELLO", 0.95), ("THANK YOU", 0.03)], "DYNAMIC")
    assert fused["prediction"] == "HELLO", "PredictionFusion failed!"
    assert fused["confidence_percentage"] == 95.0, "Confidence calculation failed!"
    print("   PredictionFusionEngine test passed!")

    print("5. Testing PersonalLearningEngine...")
    personal = PersonalLearningEngine()
    add_res = personal.add_personal_gesture("DRINK_WATER", "I need water", static_frames)
    assert add_res["status"] == "success", "PersonalLearning registration failed!"
    print("   PersonalLearningEngine test passed!")

    print("6. Testing End-to-End AIService...")
    res = ai_service.predict_sign(static_frames)
    assert "prediction" in res, "AIService predict failed!"
    assert "latency_ms" in res, "Latency metric missing!"
    print("   End-to-End AIService test passed!")

    print("All Phase 4 AI Engine backend tests executed successfully!")

if __name__ == "__main__":
    test_phase4_ai_engine()
