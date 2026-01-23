import React from 'react';
import { DefinitionTable } from './DefinitionTable';
import { ConceptCard } from './ConceptCard';
import { CONCEPT_CARDS } from '../constants';

export const OperationalDefinitions: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6 overflow-x-auto whitespace-nowrap">
        <span className="material-symbols-outlined text-[18px]">home</span>
        <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
        <span>방법론</span>
        <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
        <span className="text-primary dark:text-primary-light font-medium">운영 정의</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">운영 정의 (Operational Definitions)</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
          경기 이벤트를 분류하기 위한 표준화된 기준입니다.<br /> 이 정의들은 보고서와 대시보드에서 일관성을 보장합니다.
        </p>
      </div>

      {/* Intro Card */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 md:p-8 shadow-card mb-8 border border-border-light dark:border-border-dark">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-primary dark:text-primary-light text-3xl mt-1">palette</span>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">지표 분류 시스템</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              아래 표는 각 이벤트에 대한 구체적인 조작적 정의를 설명합니다.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                부가설명 1.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                부가설명 2.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Metrics Definition Table Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          세부 항목 및 정의
        </h3>

        <DefinitionTable />
      </div>

      {/* Additional Concepts Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          주요 분석 개념
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CONCEPT_CARDS.map((card, idx) => (
            <ConceptCard key={idx} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};