import React, { useState, useEffect } from 'react';
import { METRIC_DEFINITIONS, CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';

interface AccordionRecorderProps {
  selectedTeam: 'home' | 'away';
  onRecordEvent: (categoryIndex: number, itemIndex: number) => void;
  onTeamChange: (team: 'home' | 'away') => void;
  eventCounts?: Record<number, number>;
}

export const AccordionRecorder: React.FC<AccordionRecorderProps> = ({
  selectedTeam,
  onRecordEvent,
  onTeamChange,
  eventCounts = {},
}) => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const RECORDING_MODE_KEY = 'hockalytics-recording-mode';
  const [recordingMode, setRecordingMode] = useState<'two-step' | 'one-click'>('two-step');

  useEffect(() => {
    const saved = localStorage.getItem(RECORDING_MODE_KEY);
    if (saved === 'one-click' || saved === 'two-step') {
      setRecordingMode(saved);
    }
  }, []);

  const handleModeChange = (mode: 'two-step' | 'one-click') => {
    setRecordingMode(mode);
    localStorage.setItem(RECORDING_MODE_KEY, mode);
    if (mode === 'two-step') {
      setExpandedCategory(null);
    }
  };

  const handleCategoryClick = (index: number) => {
    setExpandedCategory(prev => prev === index ? null : index);
  };

  /**
   * Extract abbreviation from symbol string.
   * Handles various formats:
   * - "Shot on Target, SoT" -> "SoT"
   * - "Assist, AST, → 로 표기" -> "AST"
   * - "Touch" -> "Touch" (no comma, return as-is)
   * - "25Y Entry (좌25L, 중25M, 우25R)" -> "25Y"
   */
  const getAbbreviation = (symbol: string): string => {
    // If no comma, return first word (before space or parenthesis)
    if (!symbol.includes(',')) {
      const firstWord = symbol.split(/[\s(]/)[0];
      return firstWord.trim() || symbol.trim();
    }

    // Has comma: try to get the abbreviation part after first comma
    const parts = symbol.split(',');
    if (parts.length > 1) {
      // Get second part, take first word (the abbreviation)
      const abbrevPart = parts[1].trim();
      const abbrev = abbrevPart.split(/[\s→]/)[0];
      return abbrev.trim() || parts[0].trim();
    }

    return parts[0].trim();
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Recording Mode Toggle */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex rounded-lg border-2 border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <button
            onClick={() => handleModeChange('two-step')}
            className={`px-4 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 ${
              recordingMode === 'two-step'
                ? 'bg-brand-purple text-white shadow-inner'
                : 'bg-white dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-sm">view_agenda</span>
            2-Step
          </button>
          <button
            onClick={() => handleModeChange('one-click')}
            className={`px-4 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 ${
              recordingMode === 'one-click'
                ? 'bg-brand-purple text-white shadow-inner'
                : 'bg-white dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-sm">grid_view</span>
            One-Click
          </button>
        </div>
      </div>

      {/* Team Toggle */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex rounded-lg border-2 border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <button
            onClick={() => onTeamChange('home')}
            className={`px-6 py-2.5 text-sm font-bold transition-all ${
              selectedTeam === 'home'
                ? 'bg-brand-navy text-white shadow-inner'
                : 'bg-white dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onTeamChange('away')}
            className={`px-6 py-2.5 text-sm font-bold transition-all ${
              selectedTeam === 'away'
                ? 'bg-brand-navy text-white shadow-inner'
                : 'bg-white dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            Away
          </button>
        </div>
      </div>

      {recordingMode === 'two-step' ? (
        <>
          {/* Category Grid */}
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 px-2">
            {METRIC_DEFINITIONS.map((category, index) => {
              const isExpanded = expandedCategory === index;
              const icon = CATEGORY_ICONS[category.category] || 'category';
              const count = eventCounts[index] || 0;
              const shortName = category.category.split(' (')[0];
              const colorClass = CATEGORY_COLORS[category.category] || 'bg-gray-100 text-gray-700';

              return (
                <button
                  key={category.category}
                  onClick={() => handleCategoryClick(index)}
                  className={`
                    relative flex flex-col items-center justify-center gap-1.5
                    min-h-[72px] p-3 rounded-lg
                    border-2 transition-all
                    ${isExpanded
                      ? 'border-brand-purple bg-brand-purple/10 dark:bg-brand-purple/20 shadow-lg ring-2 ring-brand-purple/30'
                      : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md'
                    }
                    active:scale-95
                  `}
                >
                  <span className={`material-symbols-outlined text-xl ${
                    isExpanded ? 'text-brand-purple' : 'text-text-sub dark:text-slate-400'
                  }`}>
                    {icon}
                  </span>
                  <span className={`text-xs font-semibold text-center leading-tight ${
                    isExpanded ? 'text-brand-purple' : 'text-text-main dark:text-slate-300'
                  }`}>
                    {shortName}
                  </span>

                  {/* Event Count Badge */}
                  {count > 0 && (
                    <span className={`
                      absolute -top-1 -right-1 min-w-[20px] h-[20px]
                      flex items-center justify-center px-1.5
                      text-[11px] font-bold rounded-full
                      ${isExpanded
                        ? 'bg-brand-purple text-white ring-2 ring-white dark:ring-slate-900'
                        : 'bg-red-500 text-white shadow-md'
                      }
                    `}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Expanded Section */}
          {expandedCategory !== null && (
            <div className="px-4 pt-2 pb-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 mx-2 transition-all duration-200">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-brand-purple`}>
                    {CATEGORY_ICONS[METRIC_DEFINITIONS[expandedCategory].category]}
                  </span>
                  <h3 className="text-sm font-bold text-text-main dark:text-slate-200">
                    {METRIC_DEFINITIONS[expandedCategory].category}
                  </h3>
                </div>
                <button
                  onClick={() => setExpandedCategory(null)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg text-text-sub dark:text-slate-400">
                    close
                  </span>
                </button>
              </div>

              {/* Metric Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {METRIC_DEFINITIONS[expandedCategory].items.map((item, itemIndex) => {
                  const abbrev = getAbbreviation(item.symbol);

                  return (
                    <button
                      key={item.name}
                      onClick={() => onRecordEvent(expandedCategory, itemIndex)}
                      className="
                        relative bg-white dark:bg-slate-800
                        border-2 border-gray-300 dark:border-slate-600
                        hover:border-brand-purple dark:hover:border-brand-purple
                        rounded-xl p-4
                        flex flex-col items-center justify-center gap-1.5
                        transition-all active:scale-95 active:border-brand-purple
                        shadow-sm hover:shadow-md
                        min-h-[88px]
                        group
                      "
                    >
                      <span className="text-xl font-bold text-brand-navy dark:text-brand-light group-hover:scale-110 transition-transform">
                        {abbrev || item.name.slice(0, 3)}
                      </span>
                      <span className="text-xs text-center text-text-sub dark:text-slate-400 line-clamp-2 leading-tight">
                        {item.name}
                      </span>

                      {/* Touch feedback ring */}
                      <div className="absolute inset-0 rounded-xl ring-0 ring-brand-purple/50 group-active:ring-4 transition-all pointer-events-none" />
                    </button>
                  );
                })}
              </div>

              {/* Helper text */}
              <p className="text-[10px] text-text-sub dark:text-slate-500 text-center mt-3">
                Tap metric to record event
              </p>
            </div>
          )}

          {/* Instruction when nothing expanded */}
          {expandedCategory === null && (
            <p className="text-xs text-center text-text-sub dark:text-slate-500 px-4">
              Tap a category to view metrics
            </p>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4 px-2">
          {METRIC_DEFINITIONS.map((category, categoryIndex) => {
            const isShot = categoryIndex === 0; // Shot category ALWAYS accordion
            const icon = CATEGORY_ICONS[category.category] || 'category';
            const count = eventCounts[categoryIndex] || 0;
            const shortName = category.category.split(' (')[0];
            const isExpanded = expandedCategory === categoryIndex;

            if (isShot) {
              // SHOT: Render as mini-accordion (same as 2-step)
              return (
                <div key={category.category} className="bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                  {/* Clickable header */}
                  <button
                    onClick={() => handleCategoryClick(categoryIndex)}
                    className={`w-full flex items-center justify-between p-3 transition-all ${
                      isExpanded ? 'bg-brand-purple/10 dark:bg-brand-purple/20' : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-lg ${isExpanded ? 'text-brand-purple' : 'text-text-sub dark:text-slate-400'}`}>
                        {icon}
                      </span>
                      <span className={`text-sm font-semibold ${isExpanded ? 'text-brand-purple' : 'text-text-main dark:text-slate-300'}`}>
                        {shortName}
                      </span>
                      {count > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                          {count}
                        </span>
                      )}
                    </div>
                    <span className={`material-symbols-outlined text-lg transition-transform ${isExpanded ? 'rotate-180 text-brand-purple' : 'text-text-sub dark:text-slate-400'}`}>
                      expand_more
                    </span>
                  </button>

                  {/* Expandable content */}
                  {isExpanded && (
                    <div className="p-3 pt-0 grid grid-cols-3 gap-2">
                      {category.items.map((item, itemIndex) => {
                        const abbrev = getAbbreviation(item.symbol);
                        return (
                          <button
                            key={item.name}
                            onClick={() => onRecordEvent(categoryIndex, itemIndex)}
                            className="bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 hover:border-brand-purple rounded-lg p-3 flex flex-col items-center gap-1 transition-all active:scale-95"
                          >
                            <span className="text-lg font-bold text-brand-navy dark:text-brand-light">{abbrev}</span>
                            <span className="text-[10px] text-text-sub dark:text-slate-400 text-center">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // NON-SHOT: Flat buttons with section header
            return (
              <div key={category.category} className="space-y-2">
                {/* Section header */}
                <div className="flex items-center gap-2 px-1">
                  <span className="material-symbols-outlined text-sm text-text-sub dark:text-slate-400">{icon}</span>
                  <span className="text-xs font-semibold text-text-sub dark:text-slate-400 uppercase tracking-wider">{shortName}</span>
                  {count > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">{count}</span>
                  )}
                </div>

                {/* Flat buttons grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {category.items.map((item, itemIndex) => {
                    const abbrev = getAbbreviation(item.symbol);
                    return (
                      <button
                        key={item.name}
                        onClick={() => onRecordEvent(categoryIndex, itemIndex)}
                        className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-brand-purple rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-sm hover:shadow-md min-h-[72px] group"
                      >
                        <span className="text-lg font-bold text-brand-navy dark:text-brand-light group-hover:scale-110 transition-transform">{abbrev}</span>
                        <span className="text-[10px] text-text-sub dark:text-slate-400 text-center line-clamp-2">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
