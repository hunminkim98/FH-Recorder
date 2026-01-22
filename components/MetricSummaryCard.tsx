import React from 'react';
import { StatCardProps } from '../types';

export const MetricSummaryCard: React.FC<StatCardProps> = ({ category, title, subtitle }) => {
  return (
    <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">{category}</div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{title}</span>
      </div>
      <div className="text-xs text-slate-400 mt-1">{subtitle}</div>
    </div>
  );
};