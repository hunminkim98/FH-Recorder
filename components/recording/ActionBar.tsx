import React from 'react';
import { RecordedEvent } from '../../types';

interface ActionBarProps {
  lastEvent?: RecordedEvent;
  onUndo: () => void;
  isRunning: boolean;
  onToggleTimer: () => void;
  onFinish: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  lastEvent,
  onUndo,
  isRunning,
  onToggleTimer,
  onFinish,
}) => {
  return (
    <div
      className="bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-border-dark shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] z-40"
      style={{
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))'
      }}
    >
      <div className="h-12 px-3 flex items-center gap-2">
        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!lastEvent}
          className={`
            flex items-center gap-1.5 px-3 h-9 rounded-lg
            text-xs font-medium
            transition-all active:scale-95
            ${lastEvent
              ? 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200'
              : 'bg-gray-50 dark:bg-slate-900 text-gray-400 dark:text-slate-600 cursor-not-allowed'
            }
          `}
        >
          <span className="material-symbols-outlined text-lg">undo</span>
          <span className="hidden sm:inline">
            {lastEvent ? `Undo: ${lastEvent.itemSymbol}` : 'Undo'}
          </span>
          <span className="sm:hidden">
            {lastEvent ? lastEvent.itemSymbol : 'Undo'}
          </span>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Pause/Resume Button */}
        <button
          onClick={onToggleTimer}
          className="
            flex-1 max-w-[160px] h-9
            bg-white dark:bg-slate-800
            hover:bg-gray-50 dark:hover:bg-slate-700
            text-slate-700 dark:text-slate-200
            border border-gray-200 dark:border-slate-600
            rounded-lg
            flex items-center justify-center gap-1.5
            font-semibold text-sm
            active:scale-95 transition-all
          "
        >
          <span className="material-symbols-outlined text-xl">
            {isRunning ? 'pause' : 'play_arrow'}
          </span>
          <span className="hidden sm:inline">
            {isRunning ? 'Pause' : 'Resume'}
          </span>
        </button>

        {/* Finish Button */}
        <button
          onClick={onFinish}
          className="
            px-4 h-9
            bg-slate-800 dark:bg-brand-purple
            hover:bg-slate-900 dark:hover:bg-brand-purple/90
            text-white
            rounded-lg
            font-semibold text-sm
            active:scale-95 transition-all shadow-sm
          "
        >
          Finish
        </button>
      </div>
    </div>
  );
};
