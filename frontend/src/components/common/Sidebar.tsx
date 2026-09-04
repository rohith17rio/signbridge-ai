import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiVideo,
  FiMic,
  FiDatabase,
  FiCpu,
  FiClock,
  FiSettings,
  FiInfo,
  FiX,
} from 'react-icons/fi';

import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  key: any;
  path: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useApp();

  const navItems: NavItem[] = [
    { key: 'liveRecognition', path: '/live-recognition', icon: <FiVideo className="w-5 h-5" /> },
    { key: 'datasetManager', path: '/dataset-manager', icon: <FiDatabase className="w-5 h-5" /> },
    { key: 'modelTraining', path: '/model-training', icon: <FiCpu className="w-5 h-5" /> },
    { key: 'settings', path: '/settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 glass-sidebar pt-16 lg:pt-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main Navigation Sidebar"
      >
        <div className="flex items-center justify-between px-6 py-4 lg:hidden border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Navigation Menu</span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            aria-label="Close sidebar menu"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{t(item.key)}</span>
            </NavLink>
          ))}
        </nav>

        {/* Phase 1 Badge Footer */}
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Phase 1 Infrastructure</p>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px] leading-tight">
            Production foundation for Sign Recognition, Speech & Translation modules.
          </p>
        </div>
      </aside>
    </>
  );
};
