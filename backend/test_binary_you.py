import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from vision.binary_you_classifier import binary_you_classifier

# Test 1: Simulated "YOU" gesture landmarks (Index extended, others curled)
# 21 points with wrist at (0,0,0)
mock_you_landmarks = [
    {"norm_x": 0.0, "norm_y": 0.0, "norm_z": 0.0},        # 0 Wrist
    {"norm_x": -0.1, "norm_y": -0.1, "norm_z": 0.0},     # 1 Thumb CMC
    {"norm_x": -0.2, "norm_y": -0.1, "norm_z": 0.0},     # 2 Thumb MCP
    {"norm_x": -0.25, "norm_y": -0.1, "norm_z": 0.0},    # 3 Thumb IP
    {"norm_x": -0.3, "norm_y": -0.1, "norm_z": 0.0},     # 4 Thumb Tip
    {"norm_x": 0.05, "norm_y": -0.2, "norm_z": 0.0},     # 5 Index MCP
    {"norm_x": 0.08, "norm_y": -0.4, "norm_z": 0.0},     # 6 Index PIP
    {"norm_x": 0.10, "norm_y": -0.6, "norm_z": 0.0},     # 7 Index DIP
    {"norm_x": 0.12, "norm_y": -0.85, "norm_z": 0.0},    # 8 Index Tip (EXTENDED)
    {"norm_x": 0.20, "norm_y": -0.2, "norm_z": 0.0},     # 9 Middle MCP
    {"norm_x": 0.22, "norm_y": -0.25, "norm_z": 0.0},    # 10 Middle PIP
    {"norm_x": 0.23, "norm_y": -0.22, "norm_z": 0.0},    # 11 Middle DIP
    {"norm_x": 0.22, "norm_y": -0.20, "norm_z": 0.0},    # 12 Middle Tip (CURLED)
    {"norm_x": 0.30, "norm_y": -0.18, "norm_z": 0.0},    # 13 Ring MCP
    {"norm_x": 0.31, "norm_y": -0.22, "norm_z": 0.0},    # 14 Ring PIP
    {"norm_x": 0.31, "norm_y": -0.20, "norm_z": 0.0},    # 15 Ring DIP
    {"norm_x": 0.30, "norm_y": -0.18, "norm_z": 0.0},    # 16 Ring Tip (CURLED)
    {"norm_x": 0.40, "norm_y": -0.15, "norm_z": 0.0},    # 17 Pinky MCP
    {"norm_x": 0.41, "norm_y": -0.18, "norm_z": 0.0},    # 18 Pinky PIP
    {"norm_x": 0.41, "norm_y": -0.16, "norm_z": 0.0},    # 19 Pinky DIP
    {"norm_x": 0.40, "norm_y": -0.15, "norm_z": 0.0},    # 20 Pinky Tip (CURLED)
]

# Test 2: Simulated "Neutral / Open Hand" (All fingers extended)
mock_open_hand_landmarks = [
    {"norm_x": 0.0, "norm_y": 0.0, "norm_z": 0.0},        # 0 Wrist
    {"norm_x": -0.2, "norm_y": -0.2, "norm_z": 0.0},     # 1
    {"norm_x": -0.3, "norm_y": -0.3, "norm_z": 0.0},     # 2
    {"norm_x": -0.4, "norm_y": -0.4, "norm_z": 0.0},     # 3
    {"norm_x": -0.5, "norm_y": -0.5, "norm_z": 0.0},     # 4
    {"norm_x": -0.1, "norm_y": -0.3, "norm_z": 0.0},     # 5
    {"norm_x": -0.15, "norm_y": -0.5, "norm_z": 0.0},    # 6
    {"norm_x": -0.18, "norm_y": -0.7, "norm_z": 0.0},    # 7
    {"norm_x": -0.20, "norm_y": -0.85, "norm_z": 0.0},   # 8 Index Tip
    {"norm_x": 0.0, "norm_y": -0.3, "norm_z": 0.0},      # 9
    {"norm_x": 0.0, "norm_y": -0.55, "norm_z": 0.0},     # 10
    {"norm_x": 0.0, "norm_y": -0.75, "norm_z": 0.0},     # 11
    {"norm_x": 0.0, "norm_y": -0.90, "norm_z": 0.0},     # 12 Middle Tip (EXTENDED)
    {"norm_x": 0.1, "norm_y": -0.3, "norm_z": 0.0},      # 13
    {"norm_x": 0.12, "norm_y": -0.5, "norm_z": 0.0},     # 14
    {"norm_x": 0.15, "norm_y": -0.7, "norm_z": 0.0},     # 15
    {"norm_x": 0.18, "norm_y": -0.85, "norm_z": 0.0},    # 16 Ring Tip (EXTENDED)
    {"norm_x": 0.2, "norm_y": -0.25, "norm_z": 0.0},     # 17
    {"norm_x": 0.23, "norm_y": -0.45, "norm_z": 0.0},    # 18
    {"norm_x": 0.25, "norm_y": -0.65, "norm_z": 0.0},    # 19
    {"norm_x": 0.28, "norm_y": -0.80, "norm_z": 0.0},    # 20 Pinky Tip (EXTENDED)
]

is_you_1, conf_1, status_1 = binary_you_classifier.evaluate_landmarks(mock_you_landmarks)
print(f"Test 1 (YOU Gesture): Detected={is_you_1}, Conf={conf_1}, Status={status_1}")
assert is_you_1 == True, "Failed to detect YOU gesture"

is_you_2, conf_2, status_2 = binary_you_classifier.evaluate_landmarks(mock_open_hand_landmarks)
print(f"Test 2 (Open Hand): Detected={is_you_2}, Conf={conf_2}, Status={status_2}")
assert is_you_2 == False, "Falsely triggered YOU gesture on open hand"

print("ALL BINARY CLASSIFIER TESTS PASSED!")
