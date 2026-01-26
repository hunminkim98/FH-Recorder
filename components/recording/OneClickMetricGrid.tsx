import React from 'react';
import { METRIC_DEFINITIONS, CATEGORY_COLORS } from '../../constants';

interface OneClickMetricGridProps {
  onRecord: (categoryIndex: number, itemIndex: number) => void;
  eventCounts: Record<string, number>; // key: "categoryIndex-itemIndex"
}

export const OneClickMetricGrid: React.FC<OneClickMetricGridProps> = ({
  onRecord,
  eventCounts,
}) => {
  // Extract abbreviation from symbol (e.g., "Shot on Target, SoT" -> "SoT")
  const getAbbreviation = (symbol: string): string => {
    const parts = symbol.split(',');
    if (parts.length >= 2) {
      return parts[1].trim();
    }
    // Fallback: use first word or first 3 chars
    const firstWord = symbol.split(' ')[0];
    return firstWord.length <= 4 ? firstWord : firstWord.slice(0, 3);
  };

  // Get color classes for category
  const getCategoryColor = (categoryName: string): string => {
    return CATEGORY_COLORS[categoryName] || 'bg-gray-100 text-gray-700';
  };

  // Extract base color from category color classes for button styling
  const getButtonColorClasses = (categoryName: string): string => {
    const colorMap: Record<string, string> = {
      '슈팅 (Shot)': 'border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20',
      '패스 (Passing)': 'border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      '슈팅 기술 (Tech)': 'border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20',
      'PC (Penalty Corner)': 'border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20',
      'PS (Penalty Stroke)': 'border-yellow-300 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
      '드리블 (Dribble)': 'border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20',
      '턴오버 (Turnover)': 'border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20',
      '수비': 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50',
      '골키퍼 (GK)': 'border-teal-300 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20',
      '반칙 (Foul)': 'border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20',
      '득점 (Scored)': 'border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
    };
    return colorMap[categoryName] || 'border-gray-300 dark:border-gray-700';
  };

  const handlePress = (categoryIndex: number, itemIndex: number) => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onRecord(categoryIndex, itemIndex);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 pt-2 pb-4">
      <div className="grid grid-cols-2 gap-1.5">
        {METRIC_DEFINITIONS.map((category, categoryIndex) => (
          <React.Fragment key={categoryIndex}>
            {/* Category Header (spans 2 columns) */}
            <div className="col-span-2 mt-2 mb-0.5">
              <div className={`text-[10px] font-semibold px-2 py-0.5 rounded inline-block ${getCategoryColor(category.category)}`}>
                {category.category}
              </div>
            </div>

            {/* Metric Items */}
            {category.items.map((item, itemIndex) => {
              const eventKey = `${categoryIndex}-${itemIndex}`;
              const count = eventCounts[eventKey] || 0;
              const abbreviation = getAbbreviation(item.symbol);

              return (
                <button
                  key={`${categoryIndex}-${itemIndex}`}
                  onClick={() => handlePress(categoryIndex, itemIndex)}
                  className={`
                    relative h-[28px] px-2
                    bg-white dark:bg-slate-800
                    border-2 ${getButtonColorClasses(category.category)}
                    rounded-lg
                    flex items-center justify-between gap-1
                    transition-all duration-100
                    active:scale-95
                    shadow-sm hover:shadow
                  `}
                >
                  {/* Abbreviation */}
                  <span className="text-xs font-bold text-brand-navy dark:text-brand-light truncate">
                    {abbreviation}
                  </span>

                  {/* Count badge */}
                  {count > 0 && (
                    <span className="
                      min-w-[16px] h-[16px]
                      flex items-center justify-center px-0.5
                      text-[9px] font-bold rounded-full
                      bg-red-500 text-white
                      flex-shrink-0
                    ">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
