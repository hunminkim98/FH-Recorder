import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MetricSummaryCard } from './components/MetricSummaryCard';
import { DefinitionTable } from './components/DefinitionTable';
import { ConceptCard } from './components/ConceptCard';
import { SUMMARY_CARDS, CONCEPT_CARDS } from './constants';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
              FH
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Hockalytics</span>
          </div>
          <button 
            className="text-slate-500 dark:text-slate-400"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
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
                경기 이벤트를 분류하기 위한 표준화된 기준입니다. 이 정의들은 모든 성과 보고서와 분석 대시보드에서 일관성을 보장합니다.
              </p>
            </div>

            {/* Intro Card */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 md:p-8 shadow-card mb-8 border border-border-light dark:border-border-dark">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary dark:text-primary-light text-3xl mt-1">palette</span>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">지표 분류 시스템</h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    저희 분석은 <strong>결과 기반 지표</strong>(Outcome-based)와 <strong>과정 기반 지표</strong>(Process-based)의 명확한 구분에 의존합니다.
                    아래 표는 각 이벤트에 대한 구체적인 조작적 정의를 설명합니다.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                      모든 슈팅 지표는 23m 영역 내부에서 발생한 것만 계산합니다.
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                      점유 체인(Possession chains)은 고의적인 턴오버나 경기 중단 시 리셋됩니다.
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {SUMMARY_CARDS.map((card, idx) => (
                  <MetricSummaryCard key={idx} {...card} />
                ))}
              </div>

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

            {/* Support CTA */}
            <div className="mt-12 mb-8 bg-primary/5 dark:bg-primary/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-primary/10">
              <div className="flex items-center gap-4">
                <div className="bg-white dark:bg-surface-dark p-2 rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-primary dark:text-primary-light">help_outline</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">설명이 더 필요하신가요?</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">지원팀에서 특정 예외 상황에 대해 설명해 드릴 수 있습니다.</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary hover:bg-primary-light text-white text-sm font-medium rounded-lg transition-colors w-full md:w-auto shadow-sm">
                고객지원 문의
              </button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;