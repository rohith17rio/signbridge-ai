import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { MediaProvider } from './context/MediaContext';
import { ChatProvider } from './context/ChatContext';
import { MainLayout } from './layouts/MainLayout';

import { LandingPage } from './pages/LandingPage';
import { LiveRecognitionPage } from './pages/LiveRecognitionPage';
import { SpeechRecognitionPage } from './pages/SpeechRecognitionPage';
import { DatasetManagerPage } from './pages/DatasetManagerPage';
import { ModelTrainingPage } from './pages/ModelTrainingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <MediaProvider>
          <ChatProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<LandingPage />} />
                  <Route path="landing" element={<LandingPage />} />
                  <Route path="live-recognition" element={<LiveRecognitionPage />} />
                  <Route path="chat" element={<SpeechRecognitionPage />} />
                  <Route path="speech-recognition" element={<Navigate to="/chat" replace />} />
                  <Route path="dataset-manager" element={<DatasetManagerPage />} />
                  <Route path="model-training" element={<ModelTrainingPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </MediaProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
