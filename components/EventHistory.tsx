import React from 'react';
import type { RecordedEvent } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';

interface EventHistoryProps {
  events: RecordedEvent[];
  onUndo: () => void;
  maxDisplay?: number;
}

export const EventHistory: React.FC<EventHistoryProps> = ({
  events,
  onUndo,
  maxDisplay = 10,
}) => {
  const displayedEvents = events.slice(0, maxDisplay);
  const hasMore = events.length > maxDisplay;

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-600 mb-2">
          history
        </span>
        <p className="text-sm text-text-sub dark:text-slate-500">
          No events recorded yet
        </p>
        <p className="text-xs text-text-sub dark:text-slate-600 mt-1">
          Tap a metric to start recording
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Header with undo button */}
      <div className="flex items-center justify-between px-1 mb-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-brand-purple">history</span>
          Recent ({events.length})
        </h3>
        {events.length > 0 && (
          <button
            onClick={onUndo}
            className="flex items-center gap-1 text-xs text-text-sub dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-sm">undo</span>
            Undo Last
          </button>
        )}
      </div>

      {/* Event List */}
      <div className="flex flex-col gap-2">
        {displayedEvents.map((event, index) => {
          const icon = CATEGORY_ICONS[event.categoryName] || 'sports';
          const colorClass = CATEGORY_COLORS[event.categoryName] || 'bg-gray-100 text-gray-700';
          const isLatest = index === 0;

          return (
            <div
              key={event.id}
              className={`
                relative bg-white dark:bg-slate-800
                border border-gray-200 dark:border-slate-700
                rounded-lg p-3
                flex items-center gap-3
                shadow-sm
                transition-all
                ${isLatest
                  ? 'ring-2 ring-brand-purple/30 border-brand-purple/30'
                  : 'opacity-80 hover:opacity-100'
                }
              `}
            >
              {/* Time Badge */}
              <div className={`
                flex flex-col items-center justify-center
                min-w-[48px] h-10 rounded-lg
                text-xs font-bold
                ${isLatest
                  ? 'bg-brand-light dark:bg-brand-purple/20 text-brand-navy dark:text-brand-light'
                  : 'bg-gray-100 dark:bg-slate-700 text-text-sub dark:text-slate-400'
                }
              `}>
                <span>{event.matchTime}</span>
                <span className="text-[9px] font-normal">Q{event.quarter}</span>
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`
                    inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold
                    ${colorClass}
                  `}>
                    <span className="material-symbols-outlined text-xs">{icon}</span>
                    {event.itemSymbol}
                  </span>
                  <span className={`
                    text-[10px] font-bold px-1.5 py-0.5 rounded
                    ${event.team === 'home'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    }
                  `}>
                    {event.team === 'home' ? 'HOME' : 'AWAY'}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate mt-0.5">
                  {event.itemName}
                </p>
              </div>

              {/* Latest indicator */}
              {isLatest && (
                <span className="absolute -top-1 -right-1 size-3 bg-brand-purple rounded-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Show more indicator */}
      {hasMore && (
        <p className="text-xs text-center text-text-sub dark:text-slate-500 py-2">
          +{events.length - maxDisplay} more events
        </p>
      )}
    </div>
  );
};
