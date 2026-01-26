import React from 'react';
import type { MetricCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface MetricItemGridProps {
  category: MetricCategory;
  categoryIndex: number;
  selectedTeam: 'home' | 'away';
  onRecordEvent: (categoryIndex: number, itemIndex: number) => void;
  onTeamChange: (team: 'home' | 'away') => void;
}

export const MetricItemGrid: React.FC<MetricItemGridProps> = ({
  category,
  categoryIndex,
  selectedTeam,
  onRecordEvent,
  onTeamChange,
}) => {
  const colorClass = CATEGORY_COLORS[category.category] || 'bg-gray-100 text-gray-700';

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
    <div className="flex flex-col gap-4">
      {/* Team Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-text-sub dark:text-slate-400">Team:</span>
        <div className="flex rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => onTeamChange('home')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedTeam === 'home'
                ? 'bg-brand-navy text-white'
                : 'bg-white dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onTeamChange('away')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedTeam === 'away'
                ? 'bg-brand-navy text-white'
                : 'bg-white dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            Away
          </button>
        </div>
      </div>

      {/* Category Header */}
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${colorClass}`}>
          {category.category}
        </span>
        <span className="text-xs text-text-sub dark:text-slate-500">
          {category.items.length} metrics
        </span>
      </div>

      {/* Metric Items Grid */}
      <div className={`grid gap-2 ${
        category.items.length === 1
          ? 'grid-cols-1'
          : category.items.length === 2
            ? 'grid-cols-2'
            : 'grid-cols-2 sm:grid-cols-3'
      }`}>
        {category.items.map((item, itemIndex) => {
          const abbrev = getAbbreviation(item.symbol);

          return (
            <button
              key={item.name}
              onClick={() => onRecordEvent(categoryIndex, itemIndex)}
              className="
                relative bg-white dark:bg-slate-800
                border-2 border-gray-200 dark:border-slate-700
                hover:border-brand-purple dark:hover:border-brand-purple
                rounded-xl p-4
                flex flex-col items-center justify-center gap-1
                transition-all active:scale-95 active:border-brand-purple
                shadow-sm hover:shadow-md
                min-h-[80px]
                group
              "
            >
              <span className="text-lg font-bold text-brand-navy dark:text-brand-light group-hover:scale-110 transition-transform">
                {abbrev || item.name.slice(0, 3)}
              </span>
              <span className="text-xs text-center text-text-sub dark:text-slate-400 line-clamp-2">
                {item.name}
              </span>

              {/* Touch feedback ring */}
              <div className="absolute inset-0 rounded-xl ring-0 ring-brand-purple/50 group-active:ring-4 transition-all pointer-events-none" />
            </button>
          );
        })}
      </div>

      {/* Helper text showing definition on long-press (future) */}
      <p className="text-[10px] text-text-sub dark:text-slate-500 text-center mt-1">
        Tap to record event
      </p>
    </div>
  );
};
