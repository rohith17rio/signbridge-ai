import React from 'react';

interface AudioVisualizerProps {
  volume: number; // 0 to 100
  isActive: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ volume, isActive }) => {
  const barsCount = 28;

  return (
    <div className="w-full h-32 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex items-center justify-center gap-1.5 shadow-inner">
      {Array.from({ length: barsCount }).map((_, index) => {
        // Compute pseudo frequency variations based on volume input
        const factor = Math.sin((index / barsCount) * Math.PI);
        const barHeight = isActive ? Math.max(8, Math.min(100, volume * factor * (0.6 + (index % 3) * 0.2))) : 6;

        return (
          <div
            key={index}
            className="flex-1 bg-gradient-to-t from-brand-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-75"
            style={{
              height: `${barHeight}%`,
              opacity: isActive ? 0.4 + (barHeight / 100) * 0.6 : 0.2,
            }}
          />
        );
      })}
    </div>
  );
};
