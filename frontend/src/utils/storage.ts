import { AppSettings, SupportedLanguage, ThemeMode } from '../types';

const SETTINGS_KEY = 'signbridge_app_settings';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'English',
  selectedCameraId: '',
  selectedMicId: '',
  highContrast: false,
  fontSize: 'normal',
};

export const loadSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Partial<AppSettings>): AppSettings => {
  try {
    const current = loadSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
    return DEFAULT_SETTINGS;
  }
};
