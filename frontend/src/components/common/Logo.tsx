import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  subtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'w-10 h-10',
  size,
  showText = false,
  subtitle = 'AI PROTOS',
}) => {
  return (
    <div className={`flex items-center gap-3 ${showText ? 'group' : ''}`}>
      <div
        className={`relative flex items-center justify-center shrink-0 ${className}`}
        style={size ? { width: size, height: size } : undefined}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(2,132,199,0.35)] dark:drop-shadow-[0_0_15px_rgba(0,229,255,0.5)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Dark Mode Gradient */}
            <linearGradient id="logoDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            {/* Light Mode Gradient */}
            <linearGradient id="logoLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Cyber Badge Shield with Curved Corners */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            className="fill-slate-100 dark:fill-[#121A2B] stroke-sky-600 dark:stroke-[#00E5FF] transition-colors"
            strokeWidth="3.5"
            strokeOpacity="0.8"
          />

          {/* Neural Circuit Grid Lines */}
          <path
            d="M 22 75 L 34 58 L 50 62 L 66 38 L 78 22"
            className="stroke-sky-500 dark:stroke-[#00E5FF]/70"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 3"
          />
          <path
            d="M 34 58 L 44 38 L 60 28"
            className="stroke-blue-500/80 dark:stroke-[#3B82F6]/80"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Stylized AI Hand Gesture Silhouette (Pointing Gesture for 'YOU' + Neural Bridge motif) */}
          <path
            d="M 30 76 C 28 76 26 73 26 68 L 26 48 C 26 45 28 43 31 43 C 34 43 36 45 36 48 L 36 60 L 38 60 L 38 38 C 38 35 40 33 43 33 C 46 33 48 35 48 38 L 48 60 L 50 60 L 50 24 C 50 20 53 18 57 18 C 61 18 64 20 64 24 L 64 58 C 64 60 66 62 68 62 L 70 62 C 73 62 76 65 76 68 C 76 73 72 76 66 76 Z"
            className="fill-sky-500/15 dark:fill-[#00E5FF]/20 stroke-sky-600 dark:stroke-[#00E5FF]"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Laser Scanbeam Line */}
          <line
            x1="12"
            y1="34"
            x2="88"
            y2="34"
            className="stroke-sky-500 dark:stroke-[#00E5FF]"
            strokeWidth="2.5"
            strokeDasharray="8 4"
            filter="url(#cyanGlow)"
          />

          {/* MediaPipe Neural Landmark Joint Nodes */}
          <circle cx="57" cy="20" r="5" className="fill-sky-600 dark:fill-[#00E5FF]" />
          <circle cx="48" cy="35" r="4" className="fill-blue-600 dark:fill-[#3B82F6]" />
          <circle cx="43" cy="40" r="4" className="fill-sky-600 dark:fill-[#00E5FF]" />
          <circle cx="31" cy="46" r="4" className="fill-blue-600 dark:fill-[#3B82F6]" />
          <circle cx="66" cy="48" r="4" className="fill-sky-600 dark:fill-[#00E5FF]" />
          <circle cx="50" cy="68" r="4.5" className="fill-sky-600 dark:fill-[#00E5FF]" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="font-orbitron font-extrabold text-lg tracking-wider text-slate-900 dark:text-white">
              SIGNSETU
            </span>
            {subtitle && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-rajdhani font-bold bg-sky-500/15 dark:bg-[#00E5FF]/15 text-sky-700 dark:text-[#00E5FF] border border-sky-500/30 dark:border-[#00E5FF]/40 shadow-sm">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
