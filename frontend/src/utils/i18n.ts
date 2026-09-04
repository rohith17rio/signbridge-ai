export type Language = 'en' | 'ta';

export const translations = {
  en: {
    // Navigation
    home: 'Home Landing',
    liveRecognition: 'Live Recognition',
    chat: 'Unified Chat',
    datasetManager: 'Data Manager',
    modelTraining: 'Model Training',
    settings: 'Settings',
    about: 'About',
    dashboard: 'Dashboard',
    back: '← Back to Home',

    // Landing Page
    landingTitle: 'SIGNSETU AI',
    landingSubtitle: 'Bridge the gap between Sign Language, Speech, and Text with continuous AI gesture recognition and a unified real-time chat.',
    startSigns: 'START SIGNS',
    requestingCamera: 'Requesting Camera Access...',

    // Live Recognition & Merged Chat
    webcamFeed: 'Live Webcam Capture',
    mediapipeActive: 'MediaPipe Hands Active',
    activeModel: 'Active Model',
    recognizedSign: 'Recognized Sign',
    liveSubtitles: 'Live Subtitle Feed',
    recentSigns: 'Recent Gestures Stream',
    
    // Chat Interface
    chatHeader: 'SignSetu Conversation Feed',
    typePlaceholder: 'செய்தியை எழுதுங்கள் / Type a message...',
    send: 'Send',
    recordingVoice: 'Recording Voice...',
    clickToSendVoice: 'Click Send to submit voice message',
    clearChat: 'Clear Chat',
    signTag: '🖐️ Sign Recognized',
    speechTag: '🎤 Voice Speech-to-Text',
    typedTag: '⌨️ Typed Message',

    // Data Manager
    brainTitle: '🧠 The Brain — Master Dataset Repository',
    bulkImportTitle: '📁 Bulk Import Dataset (e.g. INCLUDE, WLASL, ISL folders)',
    startBulkImport: 'Start Bulk Import',
    teachSingleSign: '➕ Teach a Single Sign to The Brain',
    processSingleVideo: 'Process Single Video',
    wordLabelPlaceholder: 'Word Label (e.g. HELLO)',
    videoPathPlaceholder: 'Video File Path (e.g. /path/to/video.mp4)',
    exportBrain: 'Export The Brain',
    storedMappings: 'Stored Word Mappings',
    totalSamples: 'Total Samples',
    signCategories: 'Sign Categories (Words)',
    qualityPass: 'Audit Quality Pass',

    // Model Training
    trainerTitle: 'Multi-Source Gesture Model Trainer',
    trainModel: 'Train Model',
    trainingInProgress: 'Training in Progress...',
    uploadModel: 'Upload Model',
    loadCheckpoint: 'Load Checkpoint',
    accuracy: 'Accuracy',
    loss: 'Loss',
    epochs: 'Epochs',
    liveTerminal: '● LIVE TERMINAL',
    modelStatusReady: 'READY',
    modelStatusTraining: 'TRAINING',
    modelStatusComplete: 'COMPLETE',
  },
  ta: {
    // Navigation
    home: 'முகப்பு',
    liveRecognition: 'நேரடி அடையாளம்',
    chat: 'ஒருங்கிணைந்த அரட்டை',
    datasetManager: 'தரவு மேலாளர்',
    modelTraining: 'மாதிரி பயிற்சி',
    settings: 'அமைப்புகள்',
    about: 'பற்றி',
    dashboard: 'டாஷ்போர்டு',
    back: '← முகப்புக்கு செல்',

    // Landing Page
    landingTitle: 'சைன்சேது AI',
    landingSubtitle: 'சைகை மொழி, பேச்சு மற்றும் உரையை நேரடி AI சைகை அங்கீகாரம் மற்றும் ஒருங்கிணைந்த அரட்டையுடன் இணைக்கவும்.',
    startSigns: 'சைகைகளை தொடங்கு',
    requestingCamera: 'கேமரா அனுமதி கேட்கிறது...',

    // Live Recognition & Merged Chat
    webcamFeed: 'நேரடி கேமரா பதிவு',
    mediapipeActive: 'மீடியாபைப் கைகள் செயலில் உள்ளன',
    activeModel: 'செயலில் உள்ள மாதிரி',
    recognizedSign: 'அடையாளம் காணப்பட்ட சைகை',
    liveSubtitles: 'நேரடி துணைத் தலைப்புகள்',
    recentSigns: 'சமீபத்திய சைகைகளின் பட்டியல்',

    // Chat Interface
    chatHeader: 'சைன்சேது உரையாடல் அரட்டை',
    typePlaceholder: 'செய்தியை எழுதுங்கள்...',
    send: 'அனுப்பு',
    recordingVoice: 'குரல் பதிவு செய்யப்படுகிறது...',
    clickToSendVoice: 'குரல் செய்தியை அனுப்ப "அனுப்பு" பொத்தானை அழுத்தவும்',
    clearChat: 'அரட்டையை அழி',
    signTag: '🖐️ சைகை அடையாளம்',
    speechTag: '🎤 குரல் பேச்சு-உரை',
    typedTag: '⌨️ தட்டச்சு செய்த செய்தி',

    // Data Manager
    brainTitle: '🧠 பிரைன் — முதன்மை தரவுத்தொகுப்பு களஞ்சியம்',
    bulkImportTitle: '📁 மொத்த தரவு இறக்குமதி (எ.கா. INCLUDE, WLASL, ISL)',
    startBulkImport: 'மொத்த இறக்குமதியைத் தொடங்கு',
    teachSingleSign: '➕ ஒரு புதிய சைகையை கற்பிக்கவும்',
    processSingleVideo: 'வீடியோவைச் செயலாக்கு',
    wordLabelPlaceholder: 'சொல் அடையாளம் (எ.கா. வணக்கம்)',
    videoPathPlaceholder: 'வீடியோ கோப்பு பாதை',
    exportBrain: 'தரவை ஏற்றுமதி செய்',
    storedMappings: 'சேமிக்கப்பட்ட சொற்கள்',
    totalSamples: 'மொத்த மாதிரிகள்',
    signCategories: 'சைகை பிரிவுகள் (சொற்கள்)',
    qualityPass: 'தரத் தணிக்கை தேர்ச்சி',

    // Model Training
    trainerTitle: 'சைகை மாதிரி பயிற்சி மையம்',
    trainModel: 'பயிற்சியைத் தொடங்கு',
    trainingInProgress: 'பயிற்சி நடைபெறுகிறது...',
    uploadModel: 'மாதிரியைப் பதிவேற்று',
    loadCheckpoint: 'மாதிரியை ஏற்று',
    accuracy: 'துல்லியம்',
    loss: 'இழப்பு',
    epochs: 'சுற்றுகள் (Epochs)',
    liveTerminal: '● நேரடி முனையம்',
    modelStatusReady: 'தயார்',
    modelStatusTraining: 'பயிற்சி',
    modelStatusComplete: 'நிறைவடைந்தது',
  },
};

export const getTranslation = (lang: Language, key: keyof typeof translations['en']): string => {
  return translations[lang]?.[key] || translations['en'][key] || key;
};
