import React from 'react';
import { DatasetManagerCard } from '../components/dataset/DatasetManagerCard';

export const DatasetManagerPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Dataset Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Organize, upload, export, and manage gesture video datasets
        </p>
      </div>

      <DatasetManagerCard />
    </div>
  );
};
