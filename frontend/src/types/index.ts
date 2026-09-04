export type ThemeMode = 'dark' | 'light';

export type SupportedLanguage = 
  | 'English' 
  | 'Tamil' 
  | 'en'
  | 'ta' 
  | 'Hindi' 
  | 'Malayalam' 
  | 'Telugu' 
  | 'Kannada' 
  | 'French' 
  | 'German' 
  | 'Spanish' 
  | 'Japanese' 
  | 'Arabic' 
  | 'Chinese';

export interface MediaDeviceInfoOption {
  deviceId: string;
  label: string;
}

export interface CameraState {
  isActive: boolean;
  deviceId: string;
  devices: MediaDeviceInfoOption[];
  fps: number;
  resolution: { width: number; height: number };
  frameCount: number;
  error: string | null;
  isLoading: boolean;
}

export interface MicrophoneState {
  isActive: boolean;
  deviceId: string;
  devices: MediaDeviceInfoOption[];
  volume: number; // 0 to 100
  sampleRate: number;
  error: string | null;
  isLoading: boolean;
}

export interface BackendHealth {
  isOnline: boolean;
  version: string;
  uptime: number;
  lastChecked: string | null;
  error: string | null;
}

export interface AppSettings {
  theme: ThemeMode;
  language: SupportedLanguage;
  selectedCameraId: string;
  selectedMicId: string;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export interface RecognitionResult {
  gesture: string;
  confidence: number;
  translatedOutput: string;
  speechOutput: string;
  timestamp: string;
}

export interface ConversationRecord {
  id: string;
  timestamp: string;
  type: 'sign' | 'speech';
  originalInput: string;
  translatedText: string;
  confidence: number;
}
