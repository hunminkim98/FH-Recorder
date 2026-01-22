import React from 'react';
import { ConceptCardProps } from '../types';

export const ConceptCard: React.FC<ConceptCardProps> = ({ 
  icon, 
  iconColorClass, 
  title, 
  description, 
  noteLabel, 
  note 
}) => {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-border-light dark:border-border-dark shadow-soft hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColorClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className="text-xs font-medium text-slate-400 group-hover:text-primary transition-colors">더 보기</span>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
        {description}
      </p>
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
        <strong>{noteLabel}:</strong> {note}
      </div>
    </div>
  );
};