import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useMedia } from '../context/MediaContext';
import { DashboardPage } from './DashboardPage';
import { AboutPage } from './AboutPage';
import { SupportedLanguage, ThemeMode } from '../types';
import {
  FiSettings,
  FiCamera,
  FiMic,
  FiGlobe,
  FiSun,
  FiMoon,
  FiCheckCircle,
  FiGrid,
  FiInfo,
} from 'react-icons/fi';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, setLanguage, t } = useApp();
  const { theme, setTheme } = useTheme();
  const { cameraState, microphoneState, switchCamera, switchMicrophone } = useMedia();

  const [activeTab, setActiveTab] = useState<'settings' | 'dashboard' | 'about'>('settings');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-tech text-slate-900 dark:text-white tracking-tight">
            {t('settings')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure system parameters, view system telemetry dashboard, or read project mission details
          </p>
        </div>

        {/* Nested Sub-Tabs (Section 9 Specification) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FiSettings className="w-4 h-4" />
            <span>{t('settings')}</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FiGrid className="w-4 h-4" />
            <span>{t('dashboard')}</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'about'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FiInfo className="w-4 h-4" />
            <span>{t('about')}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <FiCheckCircle className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Render Active Sub-Tab */}
      {activeTab === 'dashboard' ? (
        <DashboardPage />
      ) : activeTab === 'about' ? (
        <AboutPage />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language & Theme Configuration */}
          <GlassCard className="space-y-4">
            <h3 className="font-bold text-base font-tech text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FiGlobe className="text-brand-400" /> Language & Localization
            </h3>
            <p className="text-xs text-slate-500">Select application primary language for UI and translation</p>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 block">Primary Application Language</label>
              <select
                value={settings.language === 'ta' ? 'ta' : 'en'}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="en">🇺🇸 English (EN)</option>
                <option value="ta">🇮🇳 தமிழ் (Tamil / TA)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <label className="text-xs font-semibold text-slate-400 block">Theme Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <FiMoon className="w-4 h-4" />
                  Dark Mode
                </button>
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    theme === 'light'
                      ? 'bg-brand-600/20 text-brand-300 border-brand-500/40'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <FiSun className="w-4 h-4" />
                  Light Mode
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Hardware Device Selection */}
          <GlassCard className="space-y-4">
            <h3 className="font-bold text-base font-tech text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FiCamera className="text-indigo-400" /> Hardware Device Management
            </h3>
            <p className="text-xs text-slate-500">Configure connected webcam and microphone input devices</p>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <FiCamera className="text-brand-400" /> Camera Device
              </label>
              <select
                value={cameraState.deviceId || ''}
                onChange={(e) => switchCamera(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {(cameraState.devices || []).map((dev: any) => (
                  <option key={dev.deviceId} value={dev.deviceId}>
                    {dev.label || `Camera ${dev.deviceId.slice(0, 5)}...`}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 space-y-3">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <FiMic className="text-indigo-400" /> Microphone Device
              </label>
              <select
                value={microphoneState.deviceId || ''}
                onChange={(e) => switchMicrophone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {(microphoneState.devices || []).map((dev: any) => (
                  <option key={dev.deviceId} value={dev.deviceId}>
                    {dev.label || `Microphone ${dev.deviceId.slice(0, 5)}...`}
                  </option>
                ))}
              </select>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
