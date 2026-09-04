import React from 'react';

interface StatusBadgeProps {
  label: string;
  status: 'online' | 'offline' | 'active' | 'inactive' | 'loading';
  icon?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, status, icon }) => {
  const getColors = () => {
    switch (status) {
      case 'online':
      case 'active':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          dot: 'bg-emerald-500 animate-pulse',
        };
      case 'offline':
        return {
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          dot: 'bg-rose-500',
        };
      case 'loading':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          dot: 'bg-amber-500 animate-ping',
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
          dot: 'bg-slate-400',
        };
    }
  };

  const { bg, dot } = getColors();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${bg} transition-colors duration-200`}
      role="status"
      aria-label={`${label}: ${status}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {icon && <span className="text-sm">{icon}</span>}
      <span>{label}</span>
      <span className="capitalize opacity-85 font-mono text-[11px]">({status})</span>
    </div>
  );
};
