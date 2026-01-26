import { useState } from 'react';

interface SplitViewHeaderProps {
  homeTeam: string; // e.g., "KOR"
  awayTeam: string; // e.g., "JPN"
  homeScore: number;
  awayScore: number;
  matchTime: string; // Already formatted as "MM:SS"
  quarter: number;
  isRunning: boolean;
  onBack: () => void;
}

export default function SplitViewHeader({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  matchTime,
  quarter,
  isRunning,
  onBack,
}: SplitViewHeaderProps) {
  const [showPitch, setShowPitch] = useState(true);

  return (
    <header className="bg-surface-white border-b border-gray-200 px-3 py-2 shrink-0 z-30 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Quarter & Time + Score */}
        <div className="flex flex-col shrink-0 min-w-[65px]">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-500">Q{quarter}</span>
            <span className="text-xs font-black tabular-nums tracking-tighter flex items-center gap-1">
              {matchTime}
              {isRunning && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
              )}
            </span>
          </div>
          <div className="bg-slate-900 text-white px-2 py-0.5 rounded text-sm font-bold tabular-nums text-center">
            {homeScore} - {awayScore}
          </div>
        </div>

        {/* Center: Mini Pitch (toggleable) */}
        <div
          className={`flex-1 transition-all duration-300 ${
            showPitch ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'
          }`}
        >
          {showPitch && (
            <div className="relative w-full aspect-[2/1] bg-pitch-blue rounded-md border-2 border-pitch-border overflow-hidden shadow-inner">
              <svg
                className="absolute inset-0 w-full h-full opacity-40"
                preserveAspectRatio="none"
                viewBox="0 0 100 50"
              >
                {/* Center line */}
                <line stroke="white" strokeWidth="1" x1="50" x2="50" y1="0" y2="50" />
                {/* Center circle */}
                <circle cx="50" cy="25" fill="none" r="8" stroke="white" strokeWidth="1" />
                {/* Left goal area */}
                <rect fill="none" height="30" stroke="white" strokeWidth="1" width="10" x="0" y="10" />
                {/* Right goal area */}
                <rect fill="none" height="30" stroke="white" strokeWidth="1" width="10" x="90" y="10" />
                {/* Ball indicator */}
                <circle cx="68" cy="18" fill="#facc15" r="2.5" />
              </svg>
            </div>
          )}
        </div>

        {/* Right: Toggle button + Team names */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <button
            onClick={() => setShowPitch(!showPitch)}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-full border border-slate-200 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] leading-none text-brand-navy">
              map
            </span>
            <span className="text-[10px] font-bold text-slate-700">보기</span>
          </button>
          <div className="flex items-center gap-1 font-display font-black text-[11px]">
            <span className="text-team-home">{homeTeam}</span>
            <span className="text-slate-300">VS</span>
            <span className="text-team-away">{awayTeam}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
