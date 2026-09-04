import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { useApp } from '../context/AppContext';

export const MainLayout: React.FC = () => {
  const { backendHealth } = useApp();
  const location = useLocation();

  // Hide top navigation bar on Start Landing page (Section 2 Specification)
  const isStartPage = location.pathname === '/' || location.pathname === '/landing';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {!isStartPage && <Navbar />}

      <div className="flex-1 flex max-w-[1500px] w-full mx-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {!isStartPage && !backendHealth.isOnline && (
            <ErrorBanner
              title="Backend Server Offline"
              message="The FastAPI backend is currently unreachable. Make sure Uvicorn is running on http://localhost:8000."
            />
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};
