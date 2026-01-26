import React, { useState, useEffect, useMemo } from 'react';
import { useMatchRecording } from '../hooks/useMatchRecording';
import { METRIC_DEFINITIONS } from '../constants';
import {
  RecordingHeader,
  OneClickMetricGrid,
  ActionBar,
  SplitTeamMetricPanel,
  SplitViewHeader,
  SplitViewActionBar,
} from './recording';
import { EventHistory } from './EventHistory';

interface LiveAnalysisProps {
  onNavigate: (viewId: string) => void;
}

export const LiveAnalysis: React.FC<LiveAnalysisProps> = ({ onNavigate }) => {
  const {
    state,
    selectedTeam,
    setSelectedTeam,
    recordEvent,
    recordEventForTeam,
    undoLastEvent,
    formatTime,
    startTimer,
    pauseTimer,
    incrementTime,
  } = useMatchRecording();

  const [isPitchExpanded, setIsPitchExpanded] = useState(false);

  // Compute per-item event counts for OneClickMetricGrid badges
  const eventCountsByItem = useMemo(() => {
    const counts: Record<string, number> = {};
    state.events.forEach(event => {
      const key = `${event.categoryIndex}-${event.itemIndex}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [state.events]);

  // Timer effect
  useEffect(() => {
    if (!state.isRunning) return;
    const interval = setInterval(incrementTime, 1000);
    return () => clearInterval(interval);
  }, [state.isRunning, incrementTime]);

  // Determine quarter status text
  const quarterStatusText = state.isRunning ? 'Running' : 'Paused';

  return (
    <div className="bg-bg-page dark:bg-background-dark text-text-main dark:text-slate-200 font-body h-full flex flex-col overflow-hidden selection:bg-brand-purple selection:text-white relative">
      {/* Header - Sticky & Full Width - Hidden on mobile */}
      <header className="hidden lg:block bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-border-dark px-4 py-3 shrink-0 z-30 shadow-sm sticky top-0">
        <div className="flex flex-col gap-1 max-w-7xl mx-auto w-full">
          <div className="flex items-center text-xs font-medium text-text-sub dark:text-slate-400 gap-1">
            <span
              className="hover:text-brand-purple cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              Home
            </span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-brand-purple dark:text-brand-light">Live Recording</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <button
                className="flex items-center justify-center size-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors -ml-1"
                onClick={() => onNavigate('home')}
              >
                <span className="material-symbols-outlined text-text-main dark:text-white">arrow_back</span>
              </button>
              <h1 className="text-lg font-display font-bold text-slate-800 dark:text-white tracking-tight">
                {state.homeTeam.name} vs {state.awayTeam.name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {state.isRunning && (
                <>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Live</span>
                </>
              )}
              {!state.isRunning && (
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">Paused</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content - Split view for ALL sizes */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <SplitViewHeader
          homeTeam={state.homeTeam.name}
          awayTeam={state.awayTeam.name}
          homeScore={state.homeScore}
          awayScore={state.awayScore}
          matchTime={formatTime(state.matchTimeSeconds)}
          quarter={state.currentQuarter}
          isRunning={state.isRunning}
          onBack={() => onNavigate('home')}
        />

        {/* Split panels container */}
        <main className="flex-1 overflow-hidden flex relative">
          {/* Center divider */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-200 dark:bg-slate-700 z-10" />

          {/* Home team panel */}
          <SplitTeamMetricPanel
            team="home"
            teamName={state.homeTeam.name}
            onRecord={(catIdx, itemIdx) => recordEventForTeam(catIdx, itemIdx, 'home')}
            eventCounts={eventCountsByItem}
          />

          {/* Away team panel */}
          <SplitTeamMetricPanel
            team="away"
            teamName={state.awayTeam.name}
            onRecord={(catIdx, itemIdx) => recordEventForTeam(catIdx, itemIdx, 'away')}
            eventCounts={eventCountsByItem}
          />
        </main>

        <SplitViewActionBar
          lastEvent={state.events[0] ? {
            team: state.events[0].team,
            teamName: state.events[0].team === 'home' ? state.homeTeam.name : state.awayTeam.name,
            matchTime: state.events[0].matchTime,
            itemName: state.events[0].itemName,
          } : undefined}
          onUndo={undoLastEvent}
          isRunning={state.isRunning}
          onToggleTimer={state.isRunning ? pauseTimer : startTimer}
          onFinish={() => onNavigate('home')}
        />
      </div>
    </div>
  );
};
