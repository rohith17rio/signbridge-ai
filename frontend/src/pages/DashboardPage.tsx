import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { useMedia } from '../context/MediaContext';
import { useApp } from '../context/AppContext';
import {
  FiVideo,
  FiMic,
  FiDatabase,
  FiCpu,
  FiSettings,
  FiArrowRight,
  FiCheckCircle,
  FiActivity,
  FiServer,
} from 'react-icons/fi';
import { TbHandClick } from 'react-icons/tb';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { cameraState, microphoneState } = useMedia();
  const { backendHealth, settings } = useApp();

  const quickCards = [
    {
      title: 'Live Sign Recognition',
      description: 'Capture real-time webcam video feeds for sign language landmark detection.',
      path: '/live-recognition',
      icon: <FiVideo className="w-6 h-6 text-brand-500" />,
      badge: 'Vision API',
      gradient: 'from-brand-500/10 via-indigo-500/5 to-transparent',
    },
    {
      title: 'Speech Recognition',
      description: 'Monitor live microphone stream with Web Audio API real-time volume level visualizer.',
      path: '/speech-recognition',
      icon: <FiMic className="w-6 h-6 text-indigo-500" />,
      badge: 'Speech STT',
      gradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
    },
    {
      title: 'Dataset Manager',
      description: 'Upload sign language video samples, export landmark arrays, and organize gestures.',
      path: '/dataset-manager',
      icon: <FiDatabase className="w-6 h-6 text-emerald-500" />,
      badge: 'Dataset',
      gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    },
    {
      title: 'Model Training',
      description: 'Train PyTorch neural network classifiers and inspect real-time training progress logs.',
      path: '/model-training',
      icon: <FiCpu className="w-6 h-6 text-purple-500" />,
      badge: 'PyTorch AI',
      gradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
    },
    {
      title: 'Settings & Preferences',
      description: 'Configure camera, microphone, 12-language translation target, and theme options.',
      path: '/settings',
      icon: <FiSettings className="w-6 h-6 text-amber-500" />,
      badge: 'Config',
      gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Overview Header Banner */}
      <GlassCard className="relative overflow-hidden bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 dark:from-brand-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 border-sky-500/30 dark:border-brand-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 dark:bg-brand-500/20 text-sky-700 dark:text-brand-300 border border-sky-500/30 dark:border-brand-500/30 text-xs font-semibold">
              <TbHandClick className="w-4 h-4 text-sky-600 dark:text-[#00E5FF]" />
              <span>Phase 1 Production Infrastructure</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-tech text-slate-900 dark:text-white">
              Welcome to SIGNSETU AI
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              A production-ready communication bridge empowering seamless connection between Deaf, Mute, and Hearing individuals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/live-recognition')}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 text-white font-semibold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              Launch Live Recognition
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* System Status Monitor Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <FiActivity className="text-brand-500" />
          System Hardware & Backend Monitor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20">
                <FiVideo className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Camera Status
                </span>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate max-w-[140px]">
                  {cameraState.isActive ? cameraState.devices.find(d => d.deviceId === cameraState.deviceId)?.label || 'Active Camera' : 'Disconnected'}
                </p>
              </div>
            </div>
            <StatusBadge label="Webcam" status={cameraState.isActive ? 'active' : 'inactive'} />
          </GlassCard>

          <GlassCard className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <FiMic className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Microphone Status
                </span>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate max-w-[140px]">
                  {microphoneState.isActive ? microphoneState.devices.find(d => d.deviceId === microphoneState.deviceId)?.label || 'Active Mic' : 'Disconnected'}
                </p>
              </div>
            </div>
            <StatusBadge label="Mic" status={microphoneState.isActive ? 'active' : 'inactive'} />
          </GlassCard>

          <GlassCard className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <FiServer className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  FastAPI Backend
                </span>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {backendHealth.isOnline ? `v${backendHealth.version} Online` : 'Offline'}
                </p>
              </div>
            </div>
            <StatusBadge label="Server" status={backendHealth.isOnline ? 'online' : 'offline'} />
          </GlassCard>
        </div>
      </div>

      {/* Action Launcher Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
          Quick Launcher Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickCards.map((card) => (
            <GlassCard
              key={card.path}
              hoverEffect
              className={`cursor-pointer bg-gradient-to-br ${card.gradient}`}
              onClick={() => navigate(card.path)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                  {card.icon}
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  {card.badge}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">
                {card.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {card.description}
              </p>

              <div className="flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 group">
                <span>Access Module</span>
                <FiArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
