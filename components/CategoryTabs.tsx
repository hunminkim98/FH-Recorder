import React, { useRef, useEffect } from 'react';
import { METRIC_DEFINITIONS, CATEGORY_ICONS } from '../constants';

interface CategoryTabsProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
  eventCounts?: Record<number, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedIndex,
  onSelect,
  eventCounts = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to selected tab
  useEffect(() => {
    if (selectedRef.current && containerRef.current) {
      const container = containerRef.current;
      const selected = selectedRef.current;
      const containerRect = container.getBoundingClientRect();
      const selectedRect = selected.getBoundingClientRect();

      const scrollLeft = selected.offsetLeft - containerRect.width / 2 + selectedRect.width / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [selectedIndex]);

  return (
    <div className="relative">
      {/* Gradient fade indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-surface-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-surface-dark to-transparent z-10 pointer-events-none" />

      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2 -mx-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {METRIC_DEFINITIONS.map((category, index) => {
          const isSelected = index === selectedIndex;
          const icon = CATEGORY_ICONS[category.category] || 'category';
          const count = eventCounts[index] || 0;

          // Extract short name (Korean part before parentheses)
          const shortName = category.category.split(' (')[0];

          return (
            <button
              key={category.category}
              ref={isSelected ? selectedRef : null}
              onClick={() => onSelect(index)}
              className={`
                relative flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl
                text-sm font-medium whitespace-nowrap transition-all
                ${isSelected
                  ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
                  : 'bg-gray-100 dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }
              `}
            >
              <span className="material-symbols-outlined text-lg">{icon}</span>
              <span>{shortName}</span>
              {count > 0 && (
                <span className={`
                  absolute -top-1 -right-1 min-w-[18px] h-[18px]
                  flex items-center justify-center px-1
                  text-[10px] font-bold rounded-full
                  ${isSelected
                    ? 'bg-white text-brand-purple'
                    : 'bg-brand-purple text-white'
                  }
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
