from typing import Dict, Any, List

SUPPORTED_LANGUAGES = {
    "en": "English",
    "ta": "Tamil",
    "hi": "Hindi",
    "ml": "Malayalam",
    "te": "Telugu",
    "kn": "Kannada",
    "bn": "Bengali",
    "fr": "French",
    "de": "German",
    "es": "Spanish",
    "ar": "Arabic",
    "ja": "Japanese",
    "zh": "Chinese"
}

# Translation Dictionary for Multi-Language Output
TRANSLATION_MAP = {
    "WHERE DO YOU WANT TO GO TODAY?": {
        "ta": "இன்று நீங்கள் எங்கு செல்ல விரும்புகிறீர்கள்?",
        "hi": "आज आप कहां जाना चाहते हैं?",
        "es": "¿A dónde quieres ir hoy?",
        "fr": "Où voulez-vous aller aujourd'hui?"
    },
    "I NEED WATER": {
        "ta": "எனக்கு தண்ணீர் வேண்டும்",
        "hi": "मुझे पानी चाहिए",
        "es": "Necesito agua",
        "fr": "J'ai besoin d'eau"
    },
    "I WANT HOSPITAL": {
        "ta": "எனக்கு மருத்துவமனை செல்ல வேண்டும்",
        "hi": "मुझे अस्पताल जाना है",
        "es": "Quiero ir al hospital",
        "fr": "Je veux aller à l'hôpital"
    },
    "HELLO": {
        "ta": "வணக்கம்",
        "hi": "नमस्ते",
        "es": "Hola",
        "fr": "Bonjour"
    },
    "THANK YOU": {
        "ta": "நன்றி",
        "hi": "धन्यवाद",
        "es": "Gracias",
        "fr": "Merci"
    }
}

class ModularTranslator:
    """
    Translates input text between supported languages.
    """
    def translate(self, text: str, source_lang: str = "en", target_lang: str = "ta") -> Dict[str, Any]:
        text_clean = text.strip().upper()
        translated = text

        if text_clean in TRANSLATION_MAP and target_lang in TRANSLATION_MAP[text_clean]:
            translated = TRANSLATION_MAP[text_clean][target_lang]
        elif target_lang == "ta" and "HOSPITAL" in text_clean:
            translated = "எனக்கு மருத்துவமனை செல்ல வேண்டும்"
        elif target_lang == "ta" and "WATER" in text_clean:
            translated = "எனக்கு தண்ணீர் வேண்டும்"

        return {
            "original_text": text,
            "translated_text": translated,
            "source_language": SUPPORTED_LANGUAGES.get(source_lang, source_lang),
            "target_language": SUPPORTED_LANGUAGES.get(target_lang, target_lang),
        }
