import cv2
try:
    import mediapipe as mp
    HAS_MEDIAPIPE = True
except ImportError:
    mp = None
    HAS_MEDIAPIPE = False

from typing import List, Dict, Any

class Visualizer:
    """
    Renders hand skeleton joint overlays, bone connection lines,
    Left/Right hand labels, and performance metrics onto video frames.
    """
    def __init__(self):
        if HAS_MEDIAPIPE:
            self.mp_drawing = mp.solutions.drawing_utils
            self.mp_drawing_styles = mp.solutions.drawing_styles
            self.mp_hands = mp.solutions.hands
        else:
            self.mp_drawing = None
            self.mp_drawing_styles = None
            self.mp_hands = None

    def draw_skeleton_overlay(self, frame_bgr, results, fps: float = 0.0) -> Any:
        """
        Draws MediaPipe hand skeleton connections and node landmarks on frame.
        """
        if frame_bgr is None:
            return frame_bgr

        annotated_frame = frame_bgr.copy()

        if results and HAS_MEDIAPIPE and self.mp_drawing and results.multi_hand_landmarks:
            multi_landmarks = results.multi_hand_landmarks
            multi_handedness = results.multi_handedness or []

            for idx, hand_landmarks in enumerate(multi_landmarks):
                # Draw skeleton connections & landmarks
                self.mp_drawing.draw_landmarks(
                    annotated_frame,
                    hand_landmarks,
                    self.mp_hands.HAND_CONNECTIONS,
                    self.mp_drawing_styles.get_default_hand_landmarks_style(),
                    self.mp_drawing_styles.get_default_hand_connections_style()
                )

                # Draw Hand Label (Left / Right)
                hand_type = "Right"
                if idx < len(multi_handedness):
                    hand_type = multi_handedness[idx].classification[0].label

                wrist_lm = hand_landmarks.landmark[0]
                h, w, _ = annotated_frame.shape
                cx, cy = int(wrist_lm.x * w), int(wrist_lm.y * h)

                label_color = (0, 220, 100) if hand_type == "Right" else (240, 100, 50)
                cv2.putText(
                    annotated_frame,
                    f"{hand_type} Hand",
                    (cx - 30, cy - 20),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    label_color,
                    2,
                    cv2.LINE_AA
                )

        # Draw FPS overlay in top left corner
        cv2.putText(
            annotated_frame,
            f"FPS: {fps:.1f}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2,
            cv2.LINE_AA
        )

        return annotated_frame
