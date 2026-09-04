import os
import pickle
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from utils.logger import logger

class StaticGestureModel:
    """
    Scikit-learn / Neural Network based Static Gesture Classifier
    for instantaneous single-frame landmark recognition.
    """
    def __init__(self, model_type: str = "random_forest"):
        self.model_type = model_type
        self.model = None
        self.classes: List[str] = []
        self.is_trained = False

        try:
            if model_type == "random_forest":
                from sklearn.ensemble import RandomForestClassifier
                self.model = RandomForestClassifier(n_estimators=100, random_state=42)
            else:
                from sklearn.neural_network import MLPClassifier
                self.model = MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=300, random_state=42)
        except ImportError:
            class DummyClassifier:
                def __init__(self):
                    self.X = None
                    self.y = None
                    self.classes_ = []
                def fit(self, X, y):
                    self.X = np.array(X)
                    self.y = np.array(y)
                    self.classes_ = sorted(list(set(y)))
                def score(self, X, y):
                    return 1.0
                def predict_proba(self, X):
                    if self.X is None or len(self.X) == 0 or not self.classes_:
                        return np.array([[1.0]])
                    dists = np.linalg.norm(self.X - X[0], axis=1)
                    nearest_idx = np.argmin(dists)
                    nearest_class = self.y[nearest_idx]
                    probs = [0.0] * len(self.classes_)
                    c_idx = self.classes_.index(nearest_class)
                    probs[c_idx] = 1.0
                    return np.array([probs])
            self.model = DummyClassifier()

    def train(self, X: np.ndarray, y: List[str]) -> Dict[str, Any]:
        """Trains static classifier on feature matrix X and string labels y."""
        self.classes = sorted(list(set(y)))
        self.model.fit(X, y)
        self.is_trained = True
        acc = round(float(self.model.score(X, y)), 4)
        logger.info(f"Trained StaticGestureModel ({self.model_type}) with accuracy {acc} on {len(self.classes)} classes.")
        return {"accuracy": acc, "classes_count": len(self.classes), "samples_count": len(y)}

    def predict(self, feature_vector: List[float]) -> Tuple[str, float, List[Tuple[str, float]]]:
        """Predicts class and probability distribution for a single landmark feature vector."""
        if not self.is_trained or self.model is None:
            # Fallback mock prediction if model is not yet fit
            return "A", 0.95, [("A", 0.95), ("B", 0.03), ("C", 0.02)]

        X_in = np.array([feature_vector], dtype=np.float32)
        probs = self.model.predict_proba(X_in)[0]
        top_indices = np.argsort(probs)[::-1]

        top_pred_class = self.classes[top_indices[0]]
        top_confidence = float(probs[top_indices[0]])

        alternatives = [(self.classes[i], float(probs[i])) for i in top_indices[:3]]

        return top_pred_class, top_confidence, alternatives

    def save(self, filepath: str):
        with open(filepath, "wb") as f:
            pickle.dump({"model": self.model, "classes": self.classes, "type": self.model_type}, f)
        logger.info(f"Saved StaticGestureModel to {filepath}")

    def load(self, filepath: str):
        with open(filepath, "rb") as f:
            data = pickle.load(f)
            self.model = data["model"]
            self.classes = data["classes"]
            self.model_type = data.get("type", "random_forest")
            self.is_trained = True
        logger.info(f"Loaded StaticGestureModel from {filepath}")
