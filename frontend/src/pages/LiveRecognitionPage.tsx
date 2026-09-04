import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebcamFeed } from '../components/live/WebcamFeed';
import { RecognitionPanel } from '../components/live/RecognitionPanel';
import { useChat } from '../context/ChatContext';
import { FiArrowLeft } from 'react-icons/fi';

export const LiveRecognitionPage: React.FC = () => {
  const navigate = useNavigate();
  const { addMessage } = useChat();
  const [liveLandmarks, setLiveLandmarks] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all shadow-sm"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Start Screen</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-tech text-slate-900 dark:text-white tracking-tight">
              SignSetu AI — Live Recognition
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Single-Sign ("YOU") Hackathon Prototype Demo
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Left = Webcam Feed + Result Summary, Right = Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT SIDE: Live Camera Feed & Result Summary */}
        <div className="w-full">
          <WebcamFeed
            onLandmarksDetected={(landmarks) => setLiveLandmarks(landmarks)}
            onSignDetected={(sign) => addMessage(sign, 'sign')}
          />
        </div>

        {/* RIGHT SIDE: Modern Chat Interface */}
        <div className="w-full h-full">
          <RecognitionPanel lastLandmarks={liveLandmarks} />
        </div>
      </div>
    </div>
  );
};
