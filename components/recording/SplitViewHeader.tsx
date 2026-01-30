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
  return (
    <header className="bg-surface-white border-b border-gray-200 px-3 py-2 shrink-0 z-30 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Quarter & Time */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              Q{quarter}
            </span>
            <span className="text-base font-black tabular-nums tracking-tight flex items-center gap-1.5">
              {matchTime}
              {isRunning && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Center: Score */}
        <div className="bg-slate-900 text-white px-4 py-1 rounded-lg text-lg font-black tabular-nums text-center shadow-sm">
          {homeScore} - {awayScore}
        </div>

        {/* Right: Team names */}
        <div className="flex items-center gap-2 font-display font-black text-sm">
          <span className="text-team-home">{homeTeam}</span>
          <span className="text-slate-300 text-xs">VS</span>
          <span className="text-team-away">{awayTeam}</span>
        </div>
      </div>
    </header>
  );
}
