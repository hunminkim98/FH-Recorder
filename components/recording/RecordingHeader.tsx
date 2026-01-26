import React from 'react';

interface RecordingHeaderProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  matchTime: string; // Already formatted as "MM:SS"
  quarter: number;
  isRunning: boolean;
  selectedTeam: 'home' | 'away';
  onTeamSelect: (team: 'home' | 'away') => void;
  onBack: () => void;
}

export default function RecordingHeader({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  matchTime,
  quarter,
  isRunning,
  selectedTeam,
  onTeamSelect,
  onBack
}: RecordingHeaderProps) {
  return (
    <header className="h-10 md:h-14 lg:h-16 flex items-center justify-between px-2 md:px-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
        aria-label="뒤로 가기"
      >
        <span className="material-symbols-outlined text-xl">arrow_back</span>
      </button>

      {/* Score Display */}
      <div className="flex-1 flex items-center justify-center gap-1 md:gap-2 min-w-0">
        <div className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate max-w-[60px] md:max-w-none">
          {homeTeam}
        </div>
        <div className="text-sm md:text-base font-bold text-gray-900 dark:text-white tabular-nums flex-shrink-0">
          {homeScore}-{awayScore}
        </div>
        <div className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate max-w-[60px] md:max-w-none">
          {awayTeam}
        </div>
      </div>

      {/* Time and Quarter */}
      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 mx-2 md:mx-4">
        <div className="flex items-center gap-0.5">
          <span className="text-sm md:text-lg font-mono font-bold tabular-nums text-gray-900 dark:text-white">
            {matchTime}
          </span>
          {isRunning && (
            <span className="flex h-2 w-2 relative ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>
        <span className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-400">
          Q{quarter}
        </span>
      </div>

      {/* Team Toggle */}
      <div className="flex rounded-full overflow-hidden border border-gray-200 dark:border-slate-700 flex-shrink-0">
        <button
          onClick={() => onTeamSelect('home')}
          className={`px-2 py-0.5 text-xs font-bold transition-colors ${
            selectedTeam === 'home'
              ? 'bg-brand-navy text-white'
              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
          aria-label="홈 팀 선택"
        >
          H
        </button>
        <div className="w-px bg-gray-200 dark:bg-slate-700"></div>
        <button
          onClick={() => onTeamSelect('away')}
          className={`px-2 py-0.5 text-xs font-bold transition-colors ${
            selectedTeam === 'away'
              ? 'bg-brand-navy text-white'
              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
          aria-label="어웨이 팀 선택"
        >
          A
        </button>
      </div>
    </header>
  );
}
