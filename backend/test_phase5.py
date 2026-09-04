import sys
import os

sys.path.insert(0, "/Users/apple/.gemini/antigravity-ide/scratch/signbridge-ai/backend")

from speech.audio_capture import AudioCapture
from speech.speech_recognizer import SpeechRecognizer
from translation.translator import ModularTranslator
from tts.text_to_speech import TextToSpeechEngine
from services.speech_service import speech_service

def test_phase5_communication():
    print("1. Testing AudioCapture...")
    cap = AudioCapture()
    devices = cap.list_input_devices()
    assert len(devices) > 0, "No input devices found!"
    cap.start_capture()
    assert cap.is_recording is True, "Audio capture start failed!"
    print("   AudioCapture test passed!")

    print("2. Testing SpeechRecognizer...")
    stt = SpeechRecognizer()
    res = stt.transcribe_audio()
    assert "text" in res, "STT transcription failed!"
    assert res["language"] == "English", "Language detection failed!"
    print("   SpeechRecognizer test passed!")

    print("3. Testing ModularTranslator...")
    trans = ModularTranslator()
    t_res = trans.translate("I NEED WATER", target_lang="ta")
    assert t_res["translated_text"] == "எனக்கு தண்ணீர் வேண்டும்", f"Translation failed: {t_res}"
    print("   ModularTranslator test passed!")

    print("4. Testing TextToSpeechEngine...")
    tts = TextToSpeechEngine()
    tts_res = tts.speak("I need water")
    assert tts_res["status"] == "success", "TTS speak failed!"
    print("   TextToSpeechEngine test passed!")

    print("5. Testing Two-Way CommunicationManager...")
    msg = speech_service.conversation.add_message(
        sender="DEAF_SIGN_USER",
        original_text="I NEED WATER",
        translated_text="எனக்கு தண்ணீர் வேண்டும்",
        source_lang="en",
        target_lang="ta"
    )
    assert msg["sender"] == "DEAF_SIGN_USER", "Message history recording failed!"
    assert len(speech_service.conversation.get_conversation_history()) >= 1, "Conversation list failed!"
    print("   Two-Way CommunicationManager test passed!")

    print("All Phase 5 Speech Communication backend tests executed successfully!")

if __name__ == "__main__":
    test_phase5_communication()
