import React from 'react';
import { METRIC_DEFINITIONS } from '../constants';

export const DefinitionTable: React.FC = () => {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border-light dark:border-border-dark">
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[15%] border-r border-border-light dark:border-border-dark">대분류</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[20%] border-r border-border-light dark:border-border-dark">세부 항목</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[25%] border-r border-border-light dark:border-border-dark">기록지 용어/기호</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[40%]">조작적 정의 (Operational Definition)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
            {METRIC_DEFINITIONS.map((category) => (
              <React.Fragment key={category.category}>
                {category.items.map((item, index) => {
                  const showDefinition = item.definitionRowSpan === undefined || item.definitionRowSpan > 0;
                  const rowSpan = item.definitionRowSpan || 1;
                  
                  return (
                    <tr key={`${category.category}-${item.name}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      {index === 0 && (
                        <td 
                          rowSpan={category.items.length} 
                          className="p-4 font-bold text-slate-900 dark:text-white align-top bg-slate-50/30 dark:bg-slate-800/10 border-r border-border-light dark:border-border-dark text-center md:text-left"
                        >
                          {category.category}
                        </td>
                      )}
                      <td className="p-4 text-slate-700 dark:text-slate-200 border-r border-border-light dark:border-border-dark font-semibold">
                        {item.name}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 border-r border-border-light dark:border-border-dark font-mono text-xs bg-slate-50/30 dark:bg-slate-800/20">
                        {item.symbol}
                      </td>
                      {showDefinition && (
                        <td 
                          className="p-4 text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
                          rowSpan={rowSpan}
                        >
                          {item.definition}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};