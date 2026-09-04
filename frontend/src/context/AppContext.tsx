import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, BackendHealth, SupportedLanguage } from '../types';
import { loadSettings, saveSettings } from '../utils/storage';
import { checkBackendHealth } from '../services/api';
import { logger } from '../services/logger';
import { getTranslation, Language, translations } from '../utils/i18n';

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  backendHealth: BackendHealth;
  refreshBackendHealth: () => Promise<void>;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: keyof typeof translations['en']) => string;
  lang: Language;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);
  const [backendHealth, setBackendHealth] = useState<BackendHealth>({
    isOnline: false,
    version: '1.0.0',
    uptime: 0,
    lastChecked: null,
    error: 'Checking server connection...',
  });

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = saveSettings(newSettings);
    setSettingsState(updated);
  };

  const setLanguage = (language: SupportedLanguage) => {
    updateSettings({ language });
    logger.info(`App language updated to: ${language}`);
  };

  const refreshBackendHealth = async () => {
    try {
      const data = await checkBackendHealth();
      setBackendHealth({
        isOnline: true,
        version: data.version,
        uptime: data.uptime,
        lastChecked: new Date().toLocaleTimeString(),
        error: null,
      });
    } catch (err: any) {
      setBackendHealth((prev) => ({
        ...prev,
        isOnline: false,
        lastChecked: new Date().toLocaleTimeString(),
        error: 'Backend offline or unreachable',
      }));
    }
  };

  // Language mapping: 'en' or 'ta'
  const lang: Language = settings.language === 'ta' || settings.language === 'Tamil' ? 'ta' : 'en';

  const t = (key: keyof typeof translations['en']): string => {
    return getTranslation(lang, key);
  };

  useEffect(() => {
    refreshBackendHealth();
    const interval = setInterval(refreshBackendHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        backendHealth,
        refreshBackendHealth,
        setLanguage,
        t,
        lang,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
