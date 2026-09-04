# SIGNBRIDGE AI - Technical Architecture Document

## 1. System Architecture Overview

SIGNBRIDGE AI is constructed on a decoupled client-server architecture designed for real-time video/audio stream processing and sub-100ms inference latency in Phase 2.

```
+-------------------------------------------------------------------+
|                        React 18 Frontend                          |
|  +----------------+  +-------------------+  +------------------+  |
|  | Webcam Module  |  | Microphone Module |  | Global Context   |  |
|  | MediaDevices   |  | AudioContext      |  | Theme/App/Media  |  |
|  +-------+--------+  +---------+---------+  +--------+---------+  |
+----------|---------------------|-------------------|--------------+
           |                     |                   | HTTP Polling / REST
           v                     v                   v
+-------------------------------------------------------------------+
|                        FastAPI Python Backend                     |
|  +----------------+  +-------------------+  +------------------+  |
|  | /health        |  | /api/vision       |  | /api/speech      |  |
|  +----------------+  +-------------------+  +------------------+  |
|  +----------------+  +-------------------+  +------------------+  |
|  | /api/train     |  | /api/translation  |  | Logger Service   |  |
|  +----------------+  +-------------------+  +------------------+  |
+-------------------------------------------------------------------+
```

---

## 2. Frontend State & Hardware Architecture

- **`ThemeContext`**: React Context controlling HTML root class toggling (`dark` mode), persisting settings in `localStorage`.
- **`AppContext`**: Manages backend health status polling (interval: 5s to `http://localhost:8000/health`), selected translation language (12 languages), font scaling, and high contrast mode.
- **`MediaContext`**: Encapsulates browser `navigator.mediaDevices.getUserMedia` streams. Tracks video track settings (resolution width/height), FPS counter computation, frame counters, Web Audio API `AudioContext` frequency analyser, and device switching.

---

## 3. Backend Architecture & Extensibility

- **FastAPI Core**: Built with Pydantic v2 schemas and CORS middleware configured for cross-origin frontend requests.
- **Modular Directory Layout**:
  - `backend/vision/`: Dedicated workspace for OpenCV & MediaPipe landmark extraction scripts.
  - `backend/speech/`: Dedicated workspace for Whisper STT model loaders and audio buffer decoders.
  - `backend/translation/`: Dedicated workspace for neural machine translation APIs.
  - `backend/training/`: PyTorch model training loops, loss logging, and checkpoint saving.
  - `backend/database/`: SQLite session management and schema migrations.
