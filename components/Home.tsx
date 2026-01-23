import React from 'react';

interface HomeProps {
  onNavigate: (viewId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <span className="material-symbols-outlined text-[18px]">home</span>
        <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
        <span className="text-primary dark:text-primary-light font-medium">홈</span>
      </div>

      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, Coach</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-base md:text-lg">
          팀의 이번 주 활동 요약입니다.<br />
          <span className="font-semibold text-slate-700 dark:text-slate-300">2건의 예정된 경기</span>와 검토 가능한 새로운 분석 리포트가 있습니다.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => onNavigate('analysis')}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 group"
        >
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
            <span className="material-symbols-outlined text-[24px]">videocam</span>
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">실시간 기록<br />시작</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
            <span className="material-symbols-outlined text-[24px]">upload_file</span>
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">경기 영상<br />업로드</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
            <span className="material-symbols-outlined text-[24px]">monitoring</span>
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">분석 리포트<br />보기</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
            <span className="material-symbols-outlined text-[24px]">diversity_3</span>
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">팀 관리</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Matches Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">최근 경기</h3>
            <a href="#" className="text-sm font-medium text-primary dark:text-primary-light hover:underline">전체 보기</a>
          </div>
          <div className="space-y-4">
            {/* Match Card 1 */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 md:p-5 border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <span className="text-xs font-semibold text-slate-400 uppercase">10월 12일</span>
                    <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">종료</span>
                  </div>
                  <div className="flex-1 border-l border-slate-100 dark:border-slate-700 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">Lions HC</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-lg">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-500 dark:text-slate-400">Eagles United</span>
                      </div>
                      <span className="font-medium text-slate-500 dark:text-slate-400 text-lg">1</span>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 sm:border-l border-slate-100 dark:border-slate-700 sm:pl-4 justify-end">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[16px]">play_circle</span> 다시보기
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[16px]">bar_chart</span> 통계
                  </button>
                </div>
              </div>
            </div>
            {/* Match Card 2 */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 md:p-5 border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <span className="text-xs font-semibold text-slate-400 uppercase">10월 08일</span>
                    <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">종료</span>
                  </div>
                  <div className="flex-1 border-l border-slate-100 dark:border-slate-700 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">Lions HC</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-lg">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-500 dark:text-slate-400">Panthers City</span>
                      </div>
                      <span className="font-medium text-slate-500 dark:text-slate-400 text-lg">2</span>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 sm:border-l border-slate-100 dark:border-slate-700 sm:pl-4 justify-end">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[16px]">play_circle</span> 다시보기
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[16px]">bar_chart</span> 통계
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Terminology Promo */}
          <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-6 border border-indigo-100 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-bl-full -mr-4 -mt-4 z-0"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg shadow-sm flex items-center justify-center mb-4 text-primary dark:text-primary-light">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">용어 정의</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                '유효 슈팅' 및 '서클 진입'과 같은 지표 정의를 팀 전체가 공유하도록 하세요.
              </p>
              <button
                onClick={() => onNavigate('definitions')}
                className="inline-flex items-center text-sm font-semibold text-primary dark:text-primary-light hover:text-primary-light dark:hover:text-white transition-colors group"
              >
                용어 정의 보러가기
                <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Season Summary */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">시즌 요약</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500 dark:text-slate-400">승률</span>
                  <span className="font-bold text-slate-900 dark:text-white">75%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-3/4 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500 dark:text-slate-400">경기당 득점</span>
                  <span className="font-bold text-slate-900 dark:text-white">2.4</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[60%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500 dark:text-slate-400">서클 진입</span>
                  <span className="font-bold text-slate-900 dark:text-white">평균 18</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[55%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};