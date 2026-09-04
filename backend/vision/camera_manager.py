import cv2
import time
from typing import Optional, Tuple, Dict, Any
from utils.logger import logger

class CameraManager:
    """
    Manages OpenCV webcam connection, frame capture, resolution query,
    FPS estimation, and reconnection handling.
    """
    def __init__(self, camera_id: int = 0):
        self.camera_id = camera_id
        self.cap: Optional[cv2.VideoCapture] = None
        self.is_active = False
        self.frame_count = 0
        self.fps = 0.0
        self.width = 1280
        self.height = 720
        self.last_frame_time = time.time()
        self.fps_counter = 0
        self.fps_timer = time.time()

    def start(self, camera_id: Optional[int] = None) -> bool:
        if camera_id is not None:
            self.camera_id = camera_id

        if self.cap is not None:
            self.cap.release()

        logger.info(f"Opening camera index: {self.camera_id}")
        self.cap = cv2.VideoCapture(self.camera_id)
        if not self.cap.isOpened():
            logger.error(f"Failed to open camera index {self.camera_id}")
            self.is_active = False
            return False

        # Configure preferred resolution
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

        self.width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        self.is_active = True
        self.frame_count = 0
        self.fps_timer = time.time()
        logger.info(f"Camera opened successfully ({self.width}x{self.height})")
        return True

    def read_frame(self) -> Tuple[bool, Optional[Any]]:
        if not self.is_active or self.cap is None:
            return False, None

        ret, frame = self.cap.read()
        if not ret:
            logger.warn("Failed to read frame from camera. Attempting reconnect...")
            self.reconnect()
            return False, None

        self.frame_count += 1
        self.fps_counter += 1

        # Update FPS telemetry every 1 second
        now = time.time()
        if now - self.fps_timer >= 1.0:
            self.fps = round(self.fps_counter / (now - self.fps_timer), 1)
            self.fps_counter = 0
            self.fps_timer = now

        return True, frame

    def reconnect(self) -> bool:
        logger.info("Reconnecting camera...")
        return self.start(self.camera_id)

    def stop(self):
        if self.cap is not None:
            self.cap.release()
            self.cap = None
        self.is_active = False
        self.fps = 0.0
        logger.info("Camera manager stopped.")

    def get_status(self) -> Dict[str, Any]:
        return {
            "is_active": self.is_active,
            "camera_id": self.camera_id,
            "resolution": {"width": self.width, "height": self.height},
            "fps": self.fps,
            "frame_count": self.frame_count,
        }
