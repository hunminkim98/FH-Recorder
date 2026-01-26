import React from 'react';
import { RecordedEvent } from '../../types';

interface SplitViewActionBarProps {
  lastEvent?: {
    team: 'home' | 'away';
    teamName: string;
    matchTime: string;
    itemName: string;
  };
  onUndo: () => void;
  isRunning: boolean;
  onToggleTimer: () => void;
  onFinish: () => void;
}

export function SplitViewActionBar({
  lastEvent,
  onUndo,
  isRunning,
  onToggleTimer,
  onFinish,
}: SplitViewActionBarProps) {
  const handleHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleUndo = () => {
    handleHaptic();
    onUndo();
  };

  const handleToggleTimer = () => {
    handleHaptic();
    onToggleTimer();
  };

  const handleFinish = () => {
    handleHaptic();
    onFinish();
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-40">
      {/* Floating Last Event + Undo */}
      {lastEvent && (
        <div className="px-3 mb-2">
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex items-center gap-2 overflow-hidden pl-1">
              <div
                className={`text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm ${
                  lastEvent.team === 'home' ? 'bg-team-home' : 'bg-team-away'
                }`}
              >
                {lastEvent.teamName}
              </div>
              <span className="text-[10px] text-slate-400 tabular-nums">
                {lastEvent.matchTime}
              </span>
              <span className="text-xs font-bold text-white truncate">
                {lastEvent.itemName}
              </span>
            </div>
            <button
              onClick={handleUndo}
              className="text-white bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 active:bg-slate-700 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">undo</span>
              <span className="text-[10px] font-black">UNDO</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div
        className="bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex gap-3"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleToggleTimer}
          className="flex-1 bg-slate-100 text-slate-800 rounded-xl h-12 flex items-center justify-center gap-2 font-bold text-sm active:scale-95 transition-all border border-slate-200"
        >
          <span className="material-symbols-outlined text-lg">
            {isRunning ? 'pause' : 'play_arrow'}
          </span>
          {isRunning ? '일시정지' : '재개'}
        </button>
        <button
          onClick={handleFinish}
          className="flex-1 bg-brand-navy text-white rounded-xl h-12 flex items-center justify-center gap-2 font-bold text-sm active:scale-95 transition-all shadow-lg shadow-blue-900/20"
        >
          경기 종료
        </button>
      </div>
    </div>
  );
}
