import React from 'react';
import { ModelTrainingProgress } from '../components/training/ModelTrainingProgress';

export const ModelTrainingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Model Training Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Train custom sign gesture models, inspect loss curves, and monitor real-time training logs
        </p>
      </div>

      <ModelTrainingProgress />
    </div>
  );
};
