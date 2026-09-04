import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import {
  FiInfo,
  FiTarget,
  FiCpu,
  FiLayers,
  FiHeart,
  FiCheckCircle,
} from 'react-icons/fi';
import { TbHandClick } from 'react-icons/tb';

export const AboutPage: React.FC = () => {
  const techStack = [
    { name: 'React 18', type: 'Frontend Core Framework' },
    { name: 'Vite & TypeScript', type: 'Bundler & Strict Type Safety' },
    { name: 'TailwindCSS', type: 'Custom Glassmorphism Styling' },
    { name: 'Python & FastAPI', type: 'High-Performance Backend Server' },
    { name: 'OpenCV & MediaPipe', type: 'Computer Vision & Hand Landmark Extraction' },
    { name: 'Whisper STT', type: 'Speech-to-Text Recognition Engine' },
    { name: 'PyTorch', type: 'Neural Sign Language Classifier' },
    { name: 'SQLite', type: 'Local Conversation & Dataset Storage' },
  ];

  const roadmapPhases = [
    {
      phase: 'Phase 1 (Current)',
      title: 'Production Infrastructure & UI',
      status: 'Active Foundation',
      desc: 'Complete React dashboard, Web MediaDevices API streams (webcam/mic), FastAPI server, status health monitoring, and modular architecture.',
      active: true,
    },
    {
      phase: 'Phase 2',
      title: 'AI Prediction Engines Integration',
      status: 'Upcoming Module',
      desc: 'Connect MediaPipe hand landmark extraction, Whisper speech-to-text model, PyTorch sign classifier, and real-time inference loop.',
      active: false,
    },
    {
      phase: 'Phase 3',
      title: 'Multi-Lingual Neural Translation',
      status: 'Roadmap Target',
      desc: 'Real-time 12-language translation pipeline, voice synthesis (TTS), sign avatar rendering, and cloud synchronization.',
      active: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Mission Section */}
      <GlassCard className="relative overflow-hidden bg-gradient-to-r from-brand-900/40 via-indigo-900/30 to-purple-900/40 border-brand-500/30 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
              <TbHandClick className="w-4 h-4" />
              <span>Project Mission</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-tech text-slate-900 dark:text-white">
              About SIGNSETU AI
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              SIGNSETU AI is built to dismantle communication barriers between Deaf, Mute, and Hearing communities. By pairing real-time computer vision sign recognition with speech transcription and multi-lingual translation, SIGNSETU AI provides a universal digital bridge ("Setu").
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technology Stack Breakdown */}
        <GlassCard className="space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20">
              <FiCpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                Technology Stack Architecture
              </h3>
              <p className="text-xs text-slate-500">Production-ready stack components</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {techStack.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-500 block">{item.type}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Accessibility Commitments */}
        <GlassCard className="space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <FiHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                Accessibility Commitments
              </h3>
              <p className="text-xs text-slate-500">WCAG & Universal Design standards</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Screen Reader & ARIA Live Regions
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dynamic status updates and hardware telemetry announce gracefully to screen reader users.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Keyboard Navigable & High Contrast
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Full focus management with high-contrast outlines and toggleable high-contrast color scheme.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Large Readable Typography
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dynamic font scale customization ensuring clear readability across all devices.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Multi-Phase Architecture Roadmap */}
      <GlassCard className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <FiLayers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Future Development Roadmap
            </h3>
            <p className="text-xs text-slate-500">Multi-phase deployment milestones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmapPhases.map((phase, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                phase.active
                  ? 'bg-brand-500/10 border-brand-500/40 shadow-lg shadow-brand-500/10'
                  : 'bg-slate-100/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-brand-500">{phase.phase}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    phase.active
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {phase.status}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
                {phase.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {phase.desc}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
