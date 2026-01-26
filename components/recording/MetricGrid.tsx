import React from 'react';
import { MetricButton } from './MetricButton';
import { MetricCategory } from '../../types';

interface MetricGridProps {
  category: MetricCategory;
  categoryIndex: number;
  onRecord: (categoryIndex: number, itemIndex: number) => void;
  eventCounts?: Record<string, number>;
}

const getAbbreviation = (symbol: string): string => {
  if (!symbol.includes(',')) {
    const firstWord = symbol.split(/[\s(]/)[0];
    return firstWord.trim() || symbol.trim();
  }
  const parts = symbol.split(',');
  if (parts.length > 1) {
    const abbrevPart = parts[1].trim();
    const abbrev = abbrevPart.split(/[\s→]/)[0];
    return abbrev.trim() || parts[0].trim();
  }
  return parts[0].trim();
};

export const MetricGrid: React.FC<MetricGridProps> = ({
  category,
  categoryIndex,
  onRecord,
  eventCounts = {},
}) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-3 px-2 py-3 content-start">
        {category.items.map((item, itemIndex) => {
          const key = `${categoryIndex}-${itemIndex}`;
          return (
            <MetricButton
              key={item.name}
              abbreviation={getAbbreviation(item.symbol)}
              name={item.name}
              count={eventCounts[key]}
              onPress={() => onRecord(categoryIndex, itemIndex)}
            />
          );
        })}
      </div>
    </div>
  );
};
