import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'Hardware / Connection Alert',
  message,
  onDismiss,
}) => {
  return (
    <div
      className="flex items-start gap-3 p-4 mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 shadow-lg transition-all"
      role="alert"
      aria-live="assertive"
    >
      <FiAlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        <h4 className="font-semibold text-rose-800 dark:text-rose-200">{title}</h4>
        <p className="mt-0.5 leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 rounded-lg hover:bg-rose-500/20 transition-colors"
          aria-label="Dismiss message"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
