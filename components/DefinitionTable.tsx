import React from 'react';
import { METRIC_DEFINITIONS } from '../constants';

export const DefinitionTable: React.FC = () => {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border-light dark:border-border-dark">
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-1/4 border-r border-border-light dark:border-border-dark">대분류</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-1/4 border-r border-border-light dark:border-border-dark">세부 항목</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-1/2">조작적 정의 (Operational Definition)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
            {METRIC_DEFINITIONS.map((category) => (
              <React.Fragment key={category.category}>
                {category.items.map((item, index) => (
                  <tr key={`${category.category}-${item.name}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    {index === 0 && (
                      <td 
                        rowSpan={category.items.length} 
                        className="p-4 font-medium text-slate-900 dark:text-white align-top bg-slate-50/30 dark:bg-slate-800/10 border-r border-border-light dark:border-border-dark"
                      >
                        {category.category}
                      </td>
                    )}
                    <td className="p-4 text-slate-700 dark:text-slate-200 border-r border-border-light dark:border-border-dark font-medium">
                      {item.name}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.definition}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};