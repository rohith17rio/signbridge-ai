# SIGNBRIDGE AI

> **Real-Time Sign Language & Speech Communication Platform**  
> *Phase 1: Production-Ready Foundation & Hardware/Service Infrastructure*

---

## 🌟 Overview

**SIGNBRIDGE AI** is a real-time communication platform designed to connect **Deaf, Mute, and Hearing users** seamlessly. 

Phase 1 provides the **production-ready architecture**, UI/UX design system, hardware streaming pipelines (Webcam and Microphone), global state management, and a Python FastAPI backend server with real-time health monitoring and mock service contracts ready for Phase 2 AI prediction engines.

---

## ✨ Features Implemented in Phase 1

- 🎨 **Modern Glassmorphism UI**: High-contrast, responsive dashboard with dark and light mode theme support.
- 📹 **Webcam Stream Module**: Browser MediaDevices API integration with start/stop controls, device enumeration, live FPS counter, resolution reader, and frame counter.
- 🎙️ **Microphone Stream Module**: Web Audio API `AudioContext` volume visualizer meter, sample rate metrics, device selection, and start/stop controls.
- ⚡ **FastAPI Backend Connected**: Production Python FastAPI server exposing `/health` monitoring, returning server uptime, version, and status.
- 🩺 **Dynamic Health Monitor**: Frontend polls `/health` every 5s with live "Online" / "Offline" status badges in the top navigation bar.
- 🔌 **Mock API Endpoints**:
  - `POST /api/vision/process` (MediaPipe vision pipeline mock)
  - `POST /api/speech/process` (Whisper speech recognition mock)
  - `POST /api/translation/process` (Multi-lingual neural translation mock)
  - `POST /api/train` (PyTorch model trainer mock)
- 🌐 **12 Supported Languages Selection**: English, Tamil, Hindi, Malayalam, Telugu, Kannada, French, German, Spanish, Japanese, Arabic, Chinese.
- ♿ **Accessibility Support**: Keyboard navigation, screen-reader friendly ARIA live regions, font size customization, high contrast mode.

---

## 📂 Project Structure

```
signbridge-ai/
├── README.md
├── docs/
│   └── architecture.md
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/         # Navbar, Sidebar, StatusBadge, GlassCard, ErrorBanner
│       │   ├── live/           # WebcamFeed, RecognitionPanel
│       │   ├── speech/         # MicrophoneFeed, AudioVisualizer
│       │   ├── dataset/        # DatasetManagerCard
│       │   └── training/       # ModelTrainingProgress
│       ├── context/            # AppContext, MediaContext, ThemeContext
│       ├── hooks/              # useWebcam, useMicrophone, useBackendHealth
│       ├── layouts/            # MainLayout
│       ├── pages/              # 8 full views (Dashboard, Live, Speech, Dataset, Training, History, Settings, About)
│       ├── services/           # api.ts, logger.ts
│       ├── types/              # Strict TypeScript type definitions
│       ├── utils/              # storage.ts
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
└── backend/
    ├── main.py                 # FastAPI main app entrypoint
    ├── requirements.txt        # Python dependencies
    ├── config/                 # settings.py
    ├── api/                    # Health, Vision, Speech, Translation, Train routes
    ├── vision/                 # Future MediaPipe / OpenCV sign recognition module
    ├── speech/                 # Future Whisper STT module
    ├── translation/            # Future Translation module
    ├── training/               # Future ML Training module
    ├── database/               # SQLite database & session management
    ├── models/                 # Pydantic schemas
    ├── services/               # Health service & business logic
    ├── utils/                  # Structured logger
    └── logs/                   # Log output destination
```

---

## 🚀 Running the Application Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.9 or higher

---

### 1. Starting the FastAPI Backend

Navigate to the `backend/` directory:
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
The FastAPI backend server will start on **`http://localhost:8000`**.  
Inspect live Swagger documentation at **`http://localhost:8000/docs`**.

---

### 2. Starting the React Frontend

In a separate terminal window, navigate to the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
The React Vite development server will start on **`http://localhost:5173`**.

---

## 🛠️ API Contracts Summary

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | Returns server health, version, uptime, and timestamp |
| `/api/vision/process` | `POST` | Processes video frames for hand landmarks & gestures |
| `/api/speech/process` | `POST` | Processes audio PCM chunks for speech recognition |
| `/api/translation/process` | `POST` | Translates recognized text to 12 target languages |
| `/api/train` | `POST` | Triggers model training jobs and PyTorch pipelines |

---

## 🗺️ Multi-Phase Roadmap

- **Phase 1 (Complete)**: Architecture, Hardware streams (Webcam/Mic), FastAPI server, Glassmorphic UI dashboard, 12-language options, state management, and mock API endpoints.
- **Phase 2 (Upcoming)**: MediaPipe 21-hand landmark detection engine, Whisper speech-to-text model, PyTorch gesture classifier inference loop.
- **Phase 3 (Upcoming)**: Multi-lingual neural translation API, text-to-speech audio synthesis, sign avatar animation, cloud synchronization.
