from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.speech_service import speech_service, SUPPORTED_LANGUAGES
from utils.logger import logger

router = APIRouter()

class TranscribeRequest(BaseModel):
    language: str = "auto"

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "en"
    target_lang: str = "ta"

class TTSRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None
    speed: float = 1.0

@router.post("/start", tags=["Speech Engine"])
async def start_microphone():
    success = speech_service.audio_capture.start_capture()
    return {"status": "started" if success else "error"}

@router.post("/stop", tags=["Speech Engine"])
async def stop_microphone():
    speech_service.audio_capture.stop_capture()
    return {"status": "stopped"}

@router.post("/transcribe", tags=["Speech Engine"])
async def transcribe_speech(payload: TranscribeRequest):
    return speech_service.recognizer.transcribe_audio(language=payload.language)

@router.post("/translate", tags=["Translation Engine"])
async def translate_text(payload: TranslateRequest):
    return speech_service.translator.translate(payload.text, payload.source_lang, payload.target_lang)

@router.post("/tts/speak", tags=["TTS Engine"])
async def speak_text(payload: TTSRequest):
    return speech_service.tts.speak(payload.text, payload.voice_id, payload.speed)

@router.get("/languages", tags=["Translation Engine"])
async def get_supported_languages():
    return {"languages": SUPPORTED_LANGUAGES}

@router.get("/audio/status", tags=["Speech Engine"])
async def get_audio_status():
    return {
        "is_recording": speech_service.audio_capture.is_recording,
        "volume_level": speech_service.audio_capture.volume_level,
        "devices": speech_service.audio_capture.list_input_devices(),
    }
