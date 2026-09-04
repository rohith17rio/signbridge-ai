import time
from typing import List, Dict, Any, Optional
from speech.audio_capture import AudioCapture
from speech.speech_recognizer import SpeechRecognizer
from translation.translator import ModularTranslator, SUPPORTED_LANGUAGES
from tts.text_to_speech import TextToSpeechEngine

class CommunicationManager:
    """
    Manages two-way real-time conversation history between Hearing Person and Sign User.
    """
    def __init__(self):
        self.history: List[Dict[str, Any]] = []

    def add_message(
        self,
        sender: str,  # 'HEARING_SPEAKER' or 'DEAF_SIGN_USER'
        original_text: str,
        translated_text: str,
        source_lang: str,
        target_lang: str
    ) -> Dict[str, Any]:
        msg = {
            "id": len(self.history) + 1,
            "sender": sender,
            "original_text": original_text,
            "translated_text": translated_text,
            "source_lang": source_lang,
            "target_lang": target_lang,
            "timestamp": time.strftime("%H:%M:%S"),
        }
        self.history.append(msg)
        return msg

    def get_conversation_history(self) -> List[Dict[str, Any]]:
        return self.history

class SpeechService:
    """
    Singleton service orchestrating Speech Capture, Recognition, Translation, TTS,
    and Two-Way Communication history.
    """
    _instance: Optional["SpeechService"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SpeechService, cls).__new__(cls)
            cls._instance.audio_capture = AudioCapture()
            cls._instance.recognizer = SpeechRecognizer()
            cls._instance.translator = ModularTranslator()
            cls._instance.tts = TextToSpeechEngine()
            cls._instance.conversation = CommunicationManager()
        return cls._instance

speech_service = SpeechService()
