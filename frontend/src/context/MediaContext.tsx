import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CameraState, MediaDeviceInfoOption, MicrophoneState } from '../types';
import { logger } from '../services/logger';

interface MediaContextType {
  cameraState: CameraState;
  microphoneState: MicrophoneState;
  videoRef: React.RefObject<HTMLVideoElement>;
  startCamera: (deviceId?: string) => Promise<void>;
  stopCamera: () => void;
  switchCamera: (deviceId: string) => Promise<void>;
  startMicrophone: (deviceId?: string) => Promise<void>;
  stopMicrophone: () => void;
  switchMicrophone: (deviceId: string) => Promise<void>;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const fpsIntervalIdRef = useRef<number | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    deviceId: '',
    devices: [],
    fps: 0,
    resolution: { width: 0, height: 0 },
    frameCount: 0,
    error: null,
    isLoading: false,
  });

  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>({
    isActive: false,
    deviceId: '',
    devices: [],
    volume: 0,
    sampleRate: 44100,
    error: null,
    isLoading: false,
  });

  // Enumerate Media Devices (Cameras and Microphones)
  const refreshDevices = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setCameraState((prev) => ({ ...prev, error: 'MediaDevices API not supported by browser.' }));
        setMicrophoneState((prev) => ({ ...prev, error: 'MediaDevices API not supported by browser.' }));
        return;
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const cameras: MediaDeviceInfoOption[] = devices
        .filter((d) => d.kind === 'videoinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${index + 1}`,
        }));

      const mics: MediaDeviceInfoOption[] = devices
        .filter((d) => d.kind === 'audioinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${index + 1}`,
        }));

      setCameraState((prev) => ({
        ...prev,
        devices: cameras,
        deviceId: prev.deviceId || (cameras[0]?.deviceId ?? ''),
      }));

      setMicrophoneState((prev) => ({
        ...prev,
        devices: mics,
        deviceId: prev.deviceId || (mics[0]?.deviceId ?? ''),
      }));
    } catch (err: any) {
      logger.error('Failed to enumerate media devices:', err);
    }
  };

  useEffect(() => {
    refreshDevices();
    navigator.mediaDevices?.addEventListener('devicechange', refreshDevices);
    return () => {
      navigator.mediaDevices?.removeEventListener('devicechange', refreshDevices);
    };
  }, []);

  // Frame counter & FPS computation
  const lastFrameCountRef = useRef(0);

  const startFpsCounter = () => {
    if (fpsIntervalIdRef.current) clearInterval(fpsIntervalIdRef.current);
    fpsIntervalIdRef.current = window.setInterval(() => {
      setCameraState((prev) => {
        if (!prev.isActive) return prev;
        const currentCount = prev.frameCount;
        const delta = currentCount - lastFrameCountRef.current;
        lastFrameCountRef.current = currentCount;
        return { ...prev, fps: delta };
      });
    }, 1000);
  };

  const stopFpsCounter = () => {
    if (fpsIntervalIdRef.current) {
      clearInterval(fpsIntervalIdRef.current);
      fpsIntervalIdRef.current = null;
    }
  };

  // WEBCAM MODULE HANDLERS
  const startCamera = async (targetDeviceId?: string) => {
    const selectedId = targetDeviceId || cameraState.deviceId;
    setCameraState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: selectedId ? { deviceId: { exact: selectedId } } : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();

      setCameraState((prev) => ({
        ...prev,
        isActive: true,
        isLoading: false,
        deviceId: track.getSettings().deviceId || selectedId,
        resolution: {
          width: settings.width || 1280,
          height: settings.height || 720,
        },
        error: null,
      }));

      // Re-enumerate to capture proper device labels after permission granted
      refreshDevices();
      startFpsCounter();
      logger.info('Camera started successfully.');
    } catch (err: any) {
      let errorMessage = 'Failed to access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please enable camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera device found on your system.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is currently in use by another application.';
      } else {
        errorMessage = err.message || errorMessage;
      }

      setCameraState((prev) => ({
        ...prev,
        isActive: false,
        isLoading: false,
        error: errorMessage,
      }));
      logger.error('Camera access error:', errorMessage);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    stopFpsCounter();
    setCameraState((prev) => ({
      ...prev,
      isActive: false,
      fps: 0,
      isLoading: false,
    }));
    logger.info('Camera stopped.');
  };

  const switchCamera = async (newDeviceId: string) => {
    setCameraState((prev) => ({ ...prev, deviceId: newDeviceId }));
    if (cameraState.isActive) {
      stopCamera();
      await startCamera(newDeviceId);
    }
  };

  // MICROPHONE MODULE HANDLERS
  const startMicrophone = async (targetDeviceId?: string) => {
    const selectedId = targetDeviceId || microphoneState.deviceId;
    setMicrophoneState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        audio: selectedId ? { deviceId: { exact: selectedId } } : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolumeLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalizedVolume = Math.min(100, Math.round((average / 128) * 100));

        setMicrophoneState((prev) => ({ ...prev, volume: normalizedVolume }));
        animFrameIdRef.current = requestAnimationFrame(updateVolumeLevel);
      };

      updateVolumeLevel();

      const track = stream.getAudioTracks()[0];
      const audioSettings = track.getSettings();

      setMicrophoneState((prev) => ({
        ...prev,
        isActive: true,
        isLoading: false,
        deviceId: audioSettings.deviceId || selectedId,
        sampleRate: audioSettings.sampleRate || audioCtx.sampleRate || 44100,
        error: null,
      }));

      refreshDevices();
      logger.info('Microphone started successfully.');
    } catch (err: any) {
      let errorMessage = 'Failed to access microphone.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Microphone permission denied. Please enable microphone access in browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No microphone device detected on your system.';
      } else {
        errorMessage = err.message || errorMessage;
      }

      setMicrophoneState((prev) => ({
        ...prev,
        isActive: false,
        isLoading: false,
        error: errorMessage,
      }));
      logger.error('Microphone access error:', errorMessage);
    }
  };

  const stopMicrophone = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setMicrophoneState((prev) => ({
      ...prev,
      isActive: false,
      volume: 0,
      isLoading: false,
    }));
    logger.info('Microphone stopped.');
  };

  const switchMicrophone = async (newDeviceId: string) => {
    setMicrophoneState((prev) => ({ ...prev, deviceId: newDeviceId }));
    if (microphoneState.isActive) {
      stopMicrophone();
      await startMicrophone(newDeviceId);
    }
  };

  return (
    <MediaContext.Provider
      value={{
        cameraState,
        microphoneState,
        videoRef,
        startCamera,
        stopCamera,
        switchCamera,
        startMicrophone,
        stopMicrophone,
        switchMicrophone,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = (): MediaContextType => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};
