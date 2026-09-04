import React from 'react';
import { useMicrophone } from '../../hooks/useMicrophone';
import { AudioVisualizer } from './AudioVisualizer';
import { ErrorBanner } from '../common/ErrorBanner';
import { GlassCard } from '../common/GlassCard';
import { FiMic, FiMicOff, FiActivity, FiVolume2 } from 'react-icons/fi';

export const MicrophoneFeed: React.FC = () => {
  const {
    isActive,
    deviceId,
    devices,
    volume,
    sampleRate,
    error,
    isLoading,
    startMicrophone,
    stopMicrophone,
    switchMicrophone,
  } = useMicrophone();

  return (
    <GlassCard className="flex flex-col gap-6">
      {error && <ErrorBanner message={error} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <FiMic className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
              Live Microphone Hardware Stream
            </h3>
            <p className="text-xs text-slate-500">
              Web Audio API real-time audio volume capture pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              MIC RECORDING ACTIVE
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
              MIC INACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Interactive Waveform Visualizer Component */}
      <AudioVisualizer volume={volume} isActive={isActive} />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Audio Input Volume Level
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-lg font-mono font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <FiVolume2 className="text-brand-500" />
              {volume}%
            </span>
            <div className="w-20 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-brand-500 transition-all duration-75"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Sample Rate Metric
          </span>
          <span className="text-lg font-mono font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-1">
            <FiActivity className="text-emerald-500" />
            {sampleRate} Hz
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Speech AI Module State
          </span>
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-1 block">
            Ready for Whisper STT (Phase 2)
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="w-full sm:w-auto">
          {!isActive ? (
            <button
              onClick={() => startMicrophone()}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <FiMic className="w-4 h-4" />
              Start Microphone
            </button>
          ) : (
            <button
              onClick={stopMicrophone}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <FiMicOff className="w-4 h-4" />
              Stop Microphone
            </button>
          )}
        </div>

        {/* Microphone Selector */}
        <div className="w-full sm:w-72">
          <label htmlFor="mic-select" className="sr-only">
            Select Microphone Device
          </label>
          <select
            id="mic-select"
            value={deviceId}
            onChange={(e) => switchMicrophone(e.target.value)}
            disabled={devices.length === 0}
            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {devices.length === 0 ? (
              <option value="">No microphone detected</option>
            ) : (
              devices.map((device, idx) => (
                <option key={device.deviceId || idx} value={device.deviceId}>
                  {device.label || `Microphone ${idx + 1}`}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </GlassCard>
  );
};
