import React from 'react';
import { MetricCategory } from '../../types';

interface CategoryTabsProps {
  categories: MetricCategory[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  eventCounts: Record<number, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedIndex,
  onSelect,
  eventCounts,
}) => {
  return (
    <div
      className="h-9 md:h-11 overflow-x-auto flex items-center gap-1 px-2 snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {categories.map((category, index) => {
        const shortName = category.category.split(' (')[0];
        const count = eventCounts[index] || 0;
        const isActive = selectedIndex === index;

        return (
          <button
            key={category.category}
            onClick={() => onSelect(index)}
            className={`
              snap-center shrink-0 px-3 py-1.5 rounded-full
              flex items-center gap-1.5 text-xs font-semibold
              transition-all
              ${isActive
                ? 'bg-brand-purple text-white shadow-sm'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
              }
            `}
          >
            <span className="text-sm">{shortName}</span>
            {count > 0 && (
              <span className={`
                min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold
                flex items-center justify-center
                ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}
              `}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
