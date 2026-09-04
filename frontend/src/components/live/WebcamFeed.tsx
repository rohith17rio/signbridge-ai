import React, { useState, useEffect, useRef } from 'react';
import { useWebcam } from '../../hooks/useWebcam';
import { ErrorBanner } from '../common/ErrorBanner';
import { FiCamera, FiVideoOff, FiRefreshCw, FiActivity } from 'react-icons/fi';
import { TbHandGrab } from 'react-icons/tb';

interface WebcamFeedProps {
  onLandmarksDetected?: (landmarks: any[]) => void;
  onSignDetected?: (sign: string, confidence: number) => void;
}

export const WebcamFeed: React.FC<WebcamFeedProps> = ({ onLandmarksDetected, onSignDetected }) => {
  const {
    isActive,
    deviceId,
    devices,
    fps,
    resolution,
    frameCount,
    error,
    isLoading,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
  } = useWebcam();

  const [currentSign, setCurrentSign] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [handDetected, setHandDetected] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Real-Time MediaPipe Hand Tracking & Inference Loop
  useEffect(() => {
    if (!isActive || !videoRef.current) {
      setCurrentSign(null);
      setConfidence(0);
      setHandDetected(false);
      return;
    }

    let handsDetector: any = null;
    let isCancelled = false;

    const setupMediaPipe = async () => {
      try {
        const WinMediaPipe = window as any;
        if (WinMediaPipe.Hands) {
          handsDetector = new WinMediaPipe.Hands({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
          });

          handsDetector.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.6,
          });

          handsDetector.onResults(async (results: any) => {
            if (isCancelled) return;

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
              setHandDetected(true);
              const rawLandmarks = results.multiHandLandmarks[0].map((lm: any) => ({
                x: lm.x,
                y: lm.y,
                z: lm.z,
              }));

              if (onLandmarksDetected) {
                onLandmarksDetected(rawLandmarks);
              }

              // Send real hand landmarks to backend binary YOU classifier
              try {
                const res = await fetch('/api/vision/process', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ landmarks: rawLandmarks }),
                });

                if (res.ok) {
                  const data = await res.json();
                  const conf = Math.round((data.confidence || 0.0) * 100);
                  if (data.recognized_text === 'YOU') {
                    setCurrentSign('YOU');
                    setConfidence(conf);
                    if (onSignDetected) {
                      onSignDetected('YOU', conf);
                    }
                  } else {
                    setCurrentSign(null);
                    setConfidence(conf);
                  }
                }
              } catch (err) {
                console.warn('Vision process API error:', err);
              }
            } else {
              setHandDetected(false);
              setCurrentSign(null);
              setConfidence(0);
              if (onLandmarksDetected) {
                onLandmarksDetected([]);
              }
            }
          });

          const processFrame = async () => {
            if (isCancelled || !videoRef.current || !isActive) return;
            if (videoRef.current.readyState >= 2) {
              try {
                await handsDetector.send({ image: videoRef.current });
              } catch (e) {}
            }
            if (!isCancelled && isActive) {
              requestAnimationFrame(processFrame);
            }
          };

          processFrame();
        }
      } catch (err) {
        console.error('MediaPipe initialization error:', err);
      }
    };

    setupMediaPipe();

    return () => {
      isCancelled = true;
      if (handsDetector) {
        try {
          handsDetector.close();
        } catch (e) {}
      }
    };
  }, [isActive, videoRef]);

  return (
    <div className="flex flex-col gap-4">
      {error && <ErrorBanner message={error} />}

      {/* Futuristic Video Viewport Container */}
      <div className="relative min-h-[380px] sm:min-h-[420px] aspect-video bg-[#0B0F19] rounded-2xl overflow-hidden border-2 border-[#00E5FF]/40 shadow-[0_0_30px_rgba(0,229,255,0.2)] flex items-center justify-center group">
        {/* Corner Targeting Brackets */}
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-tr" />
        <div className="corner-bracket-bl" />
        <div className="corner-bracket-br" />

        {/* Animated Horizontal Scanline Effect */}
        {isActive && <div className="animate-scanline" />}

        <video
          ref={videoRef}
          className={`w-full h-full object-cover transform -scale-x-100 ${
            isActive ? 'block' : 'hidden'
          }`}
          playsInline
          muted
          autoPlay
        />
        <canvas ref={canvasRef} className="hidden" />

        {!isActive && !isLoading && (
          <div className="flex flex-col items-center gap-3 p-6 text-center text-[#B8C5D6]">
            <div className="w-16 h-16 rounded-full bg-[#121A2B] flex items-center justify-center text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <FiVideoOff className="w-8 h-8" />
            </div>
            <div>
              <p className="font-orbitron font-bold text-white text-base">CAMERA DISCONNECTED</p>
              <p className="text-xs font-inter text-[#B8C5D6] mt-1">
                Click "Start Camera" to initialize live AI vision scanning pipeline.
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-3 p-6 text-[#00E5FF]">
            <FiRefreshCw className="w-8 h-8 animate-spin" />
            <p className="text-sm font-rajdhani font-bold tracking-wider">INITIALIZING MEDIAPIPE TRACKER...</p>
          </div>
        )}

        {/* Live Metrics Overlay Badges */}
        {isActive && (
          <>
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#0B0F19]/80 backdrop-blur-md text-[#22C55E] text-xs font-mono font-bold border border-[#22C55E]/40 flex items-center gap-2 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  LIVE STREAM
                </span>
                <span className="px-3 py-1 rounded-lg bg-[#0B0F19]/80 backdrop-blur-md text-[#B8C5D6] text-xs font-mono border border-[#00E5FF]/20 flex items-center gap-1.5">
                  <FiActivity className="text-[#00E5FF]" />
                  {fps > 0 ? fps : 30} FPS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg backdrop-blur-md text-xs font-space font-bold border shadow ${
                  handDetected
                    ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/50 shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                    : 'bg-[#0B0F19]/80 text-[#B8C5D6] border-[#00E5FF]/20'
                }`}>
                  {handDetected ? '🖐 HAND TRACKING ACTIVE' : 'NO HAND IN FRAME'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Camera Controls Panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-[#00E5FF]/20 transition-colors">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isActive ? (
            <button
              onClick={() => startCamera()}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 btn-cyan-primary text-white font-rajdhani font-bold text-base tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiCamera className="w-5 h-5" />
              START CAMERA
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-rajdhani font-bold text-base shadow-md dark:shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <FiVideoOff className="w-5 h-5" />
              STOP CAMERA
            </button>
          )}
        </div>

        {devices.length > 0 && (
          <div className="w-full sm:w-auto flex items-center gap-2">
            <label className="text-xs font-space font-bold text-slate-700 dark:text-[#B8C5D6] whitespace-nowrap">
              CAMERA SOURCE:
            </label>
            <select
              value={deviceId || ''}
              onChange={(e) => switchCamera(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white text-xs font-mono border border-slate-300 dark:border-[#00E5FF]/30 focus:outline-none focus:border-sky-500 dark:focus:border-[#00E5FF]"
            >
              {devices.map((dev) => (
                <option key={dev.deviceId} value={dev.deviceId}>
                  {dev.label || `Camera ${dev.deviceId.slice(0, 5)}...`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Result Summary Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-[#00E5FF]/30 shadow-lg space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#00E5FF]/20 pb-3">
          <span className="text-xs font-space font-bold text-slate-700 dark:text-[#B8C5D6] uppercase tracking-wider flex items-center gap-2">
            <TbHandGrab className="text-sky-600 dark:text-[#00E5FF] w-4 h-4" />
            LIVE DETECTION SUMMARY
          </span>
          <span className="text-[11px] font-mono text-sky-700 dark:text-[#00E5FF] px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-[#00E5FF]/10 border border-sky-200 dark:border-[#00E5FF]/30 font-semibold">
            Single-Sign "YOU" Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Detected Sign Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#00E5FF]/20 space-y-1">
            <div className="text-[11px] font-space text-slate-600 dark:text-[#B8C5D6] uppercase font-bold">Detected Sign</div>
            <div className="text-2xl font-orbitron font-extrabold tracking-wider">
              {currentSign === 'YOU' ? (
                <span className="text-emerald-600 dark:text-[#22C55E] drop-shadow-sm dark:drop-shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse flex items-center gap-2">
                  YOU <span className="text-xs font-sans px-2 py-0.5 rounded bg-emerald-100 dark:bg-[#22C55E]/20 text-emerald-700 dark:text-[#22C55E] border border-emerald-300 dark:border-[#22C55E]/40 font-normal">MATCH</span>
                </span>
              ) : (
                <span className="text-slate-400 dark:text-slate-400 italic text-base font-normal">Waiting for sign...</span>
              )}
            </div>
          </div>

          {/* Confidence Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#00E5FF]/20 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-space text-slate-600 dark:text-[#B8C5D6] font-bold">
              <span>Confidence</span>
              <span className="font-mono text-emerald-600 dark:text-[#22C55E]">{confidence}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-[#121A2B] overflow-hidden border border-slate-300 dark:border-[#00E5FF]/20">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 dark:from-[#00E5FF] dark:via-[#3B82F6] dark:to-[#22C55E] rounded-full transition-all duration-300"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Demo Instruction Hint */}
      <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-[#00E5FF]/10 border border-sky-200 dark:border-[#00E5FF]/30 text-xs text-sky-800 dark:text-[#00E5FF] font-space leading-relaxed shadow-sm">
        <strong>Demo Instruction:</strong> Point index finger towards camera to perform the word gesture for <strong>"YOU"</strong>.
      </div>
    </div>
  );
};
