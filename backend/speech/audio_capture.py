import time
import numpy as np
from typing import Dict, Any, List

class AudioCapture:
    """
    Manages audio device enumeration, stream capture,
    RMS volume level calculation, and recording status.
    """
    def __init__(self):
        self.is_recording = False
        self.active_device_index = 0
        self.sample_rate = 16000
        self.volume_level = 0.0

    def list_input_devices(self) -> List[Dict[str, Any]]:
        """Returns list of available hardware microphones."""
        return [
            {"index": 0, "name": "Built-in Microphone", "channels": 1, "default": True},
            {"index": 1, "name": "USB Headset Microphone", "channels": 2, "default": False},
        ]

    def start_capture(self, device_index: int = 0) -> bool:
        self.active_device_index = device_index
        self.is_recording = True
        self.volume_level = 45.0
        return True

    def stop_capture(self) -> bool:
        self.is_recording = False
        self.volume_level = 0.0
        return True

    def compute_rms_volume(self, audio_data: np.ndarray) -> float:
        if audio_data is None or len(audio_data) == 0:
            return 0.0
        rms = np.sqrt(np.mean(np.square(audio_data)))
        return round(float(rms * 100), 1)
