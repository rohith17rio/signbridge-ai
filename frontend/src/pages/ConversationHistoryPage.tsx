import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { FiClock, FiSearch, FiFilter, FiInbox, FiDownload, FiTrash2 } from 'react-icons/fi';

export const ConversationHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Conversation History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Archived record of recognized signs, speech transcripts, and multi-lingual translations
        </p>
      </div>

      <GlassCard className="space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search history transcripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-all">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-all">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
            <button className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-medium border border-rose-500/20 flex items-center gap-1.5 transition-all">
              <FiTrash2 className="w-4 h-4" />
              Clear History
            </button>
          </div>
        </div>

        {/* Empty State Presentation */}
        <div className="py-20 px-4 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
          <div className="w-16 h-16 rounded-full bg-slate-200/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 mb-3 border border-slate-300 dark:border-slate-700">
            <FiClock className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">
            No Conversation Records Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1 leading-relaxed">
            Your live sign recognition sessions, speech transcripts, and translations will be logged chronologically here in Phase 2.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};
