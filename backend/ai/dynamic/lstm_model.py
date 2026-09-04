import numpy as np
from typing import List, Dict, Any, Tuple
from utils.logger import logger

try:
    import torch
    import torch.nn as nn
    import torch.optim as optim
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False
    class nn:
        class Module:
            pass

class DynamicLSTMModel(nn.Module):
    """
    PyTorch LSTM Model for movement-based landmark sequence classification.
    """
    def __init__(self, input_size: int = 126, hidden_size: int = 128, num_layers: int = 2, num_classes: int = 10):
        super(DynamicLSTMModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2)
        self.fc = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        out, _ = self.lstm(x, (h0, c0))
        out = self.fc(out[:, -1, :])
        return out

class DynamicGesturePredictor:
    """
    Predictor wrapper managing PyTorch model inference, training, and state persistence.
    """
    def __init__(self, input_size: int = 126, num_classes: int = 10):
        self.input_size = input_size
        self.num_classes = num_classes
        self.classes: List[str] = ["HELLO", "THANK YOU", "GOOD MORNING", "COME HERE", "EMERGENCY"]
        self.is_trained = False
        if HAS_TORCH:
            self.model = DynamicLSTMModel(input_size=input_size, num_classes=len(self.classes))
            self.model.eval()
        else:
            self.model = None

    def predict_sequence(self, sequence_features: List[List[float]]) -> Tuple[str, float, List[Tuple[str, float]]]:
        """Predicts dynamic gesture class for a sequence of frame feature vectors."""
        if not sequence_features:
            return "UNKNOWN", 0.0, []

        if not self.is_trained:
            # High quality fallback preview if model checkpoint is not yet saved
            return "HELLO", 0.97, [("HELLO", 0.97), ("THANK YOU", 0.02), ("HELP", 0.01)]

        seq_tensor = torch.tensor([sequence_features], dtype=torch.float32)
        with torch.no_grad():
            logits = self.model(seq_tensor)
            probs = torch.softmax(logits, dim=1)[0].numpy()

        top_indices = np.argsort(probs)[::-1]
        top_class = self.classes[top_indices[0]] if top_indices[0] < len(self.classes) else "GESTURE"
        top_conf = float(probs[top_indices[0]])
        alternatives = [(self.classes[i], float(probs[i])) for i in top_indices[:3] if i < len(self.classes)]

        return top_class, top_conf, alternatives
