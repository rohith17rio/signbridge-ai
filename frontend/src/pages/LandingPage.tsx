import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiArrowRight, FiActivity, FiShield } from 'react-icons/fi';
import { Logo } from '../components/common/Logo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);

  const handleStartApp = async () => {
    setIsRequestingCamera(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
      }
      navigate('/live-recognition');
    } catch (err: any) {
      console.warn('Camera access warning:', err);
      navigate('/live-recognition');
    } finally {
      setIsRequestingCamera(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-200">
      {/* Futuristic Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-sky-500/20 via-blue-500/15 to-transparent dark:from-[#00E5FF]/20 dark:via-[#3B82F6]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl space-y-8 relative z-10">
        {/* Brand Logo & Tag */}
        <div className="flex flex-col items-center justify-center gap-4">
          <Logo size={100} className="w-24 h-24" />

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-[#121A2B] text-sky-700 dark:text-[#00E5FF] border border-slate-300 dark:border-[#00E5FF]/30 text-xs font-space font-bold uppercase tracking-widest shadow-md dark:shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-sky-600 dark:bg-[#00E5FF] animate-ping" />
            <span>SIGNSETU AI CONTROL CENTER</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wider font-orbitron text-slate-900 dark:text-white">
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-[#00E5FF] dark:via-white dark:to-[#3B82F6] bg-clip-text text-transparent drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              SIGNSETU AI
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-[#B8C5D6] max-w-2xl mx-auto leading-relaxed font-inter">
            Real-Time Sign Language Gesture Recognition & Autonomous Vision Subtitle Engine.
          </p>
        </div>

        {/* Primary Start Signs Action Button */}
        <div className="pt-6 flex flex-col items-center space-y-4">
          <button
            onClick={handleStartApp}
            disabled={isRequestingCamera}
            className="group relative inline-flex items-center justify-center gap-4 px-12 py-5 rounded-2xl btn-cyan-primary text-white font-rajdhani font-extrabold text-2xl tracking-wider transition-all duration-300 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <FiCamera className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span>{isRequestingCamera ? 'INITIALIZING CAMERA...' : 'START RECOGNITION'}</span>
            <FiArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </button>

          <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-[#B8C5D6] font-space pt-4">
            <span className="flex items-center gap-1.5">
              <FiShield className="text-emerald-600 dark:text-[#22C55E]" /> Camera Permission Required
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <FiActivity className="text-sky-600 dark:text-[#00E5FF]" /> Real-Time MediaPipe Tracker
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
