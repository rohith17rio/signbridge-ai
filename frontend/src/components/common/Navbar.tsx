import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useMedia } from '../../context/MediaContext';
import { StatusBadge } from './StatusBadge';
import { Logo } from './Logo';
import { FiSun, FiMoon, FiCamera, FiMic, FiServer, FiVideo, FiDatabase, FiCpu, FiSettings } from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { backendHealth, settings, setLanguage, t } = useApp();
  const { cameraState, microphoneState } = useMedia();

  const navItems = [
    { key: 'liveRecognition', path: '/live-recognition', icon: <FiVideo className="w-4 h-4" /> },
    { key: 'datasetManager', path: '/dataset-manager', icon: <FiDatabase className="w-4 h-4" /> },
    { key: 'modelTraining', path: '/model-training', icon: <FiCpu className="w-4 h-4" /> },
    { key: 'settings', path: '/settings', icon: <FiSettings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 glass-nav px-4 sm:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 max-w-[1500px] mx-auto">
        {/* Left Section: Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <Logo showText size={40} />
        </Link>

        {/* Center Section: Top Horizontal Navigation Bar */}
        <nav className="hidden sm:flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#121A2B] border border-slate-200 dark:border-[#00E5FF]/20 font-exo transition-colors">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-250 ${
                  isActive
                    ? 'bg-sky-600 dark:bg-[#00E5FF] text-white dark:text-[#0B0F19] font-bold shadow-md dark:shadow-[0_0_15px_rgba(0,229,255,0.6)]'
                    : 'text-slate-600 dark:text-[#B8C5D6] hover:text-sky-600 dark:hover:text-[#00E5FF] hover:bg-slate-200/60 dark:hover:bg-[#3B82F6]/20'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{t(item.key as any)}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Section: Hardware Status, Language & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <StatusBadge
              label="Cam"
              status={cameraState.isActive ? 'active' : 'inactive'}
              icon={<FiCamera className="w-3 h-3 text-sky-600 dark:text-[#00E5FF]" />}
            />
            <StatusBadge
              label="Mic"
              status={microphoneState.isActive ? 'active' : 'inactive'}
              icon={<FiMic className="w-3 h-3 text-sky-600 dark:text-[#00E5FF]" />}
            />
            <StatusBadge
              label="API"
              status={backendHealth.isOnline ? 'online' : 'offline'}
              icon={<FiServer className="w-3 h-3 text-sky-600 dark:text-[#00E5FF]" />}
            />
          </div>

          <select
            value={settings.language === 'ta' ? 'ta' : 'en'}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="text-xs font-rajdhani font-bold px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#121A2B] text-slate-800 dark:text-white border border-slate-300 dark:border-[#00E5FF]/30 focus:outline-none focus:border-sky-500 dark:focus:border-[#00E5FF] cursor-pointer transition-colors"
          >
            <option value="en">🇺🇸 EN</option>
            <option value="ta">🇮🇳 தமிழ்</option>
          </select>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#121A2B] text-slate-700 dark:text-[#00E5FF] hover:bg-slate-200 dark:hover:bg-[#00E5FF]/10 border border-slate-300 dark:border-[#00E5FF]/30 transition-all shadow-sm focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <FiSun className="w-4 h-4 text-amber-400" />
            ) : (
              <FiMoon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
