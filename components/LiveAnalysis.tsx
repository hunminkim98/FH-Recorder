import React from 'react';

interface LiveAnalysisProps {
  onNavigate: (viewId: string) => void;
}

export const LiveAnalysis: React.FC<LiveAnalysisProps> = ({ onNavigate }) => {
  return (
    <div className="bg-bg-page dark:bg-background-dark text-text-main dark:text-slate-200 font-body h-full flex flex-col overflow-hidden selection:bg-brand-purple selection:text-white relative">
      {/* Header - Sticky & Full Width */}
      <header className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-border-dark px-4 py-3 shrink-0 z-30 shadow-sm sticky top-0">
        <div className="flex flex-col gap-1 max-w-7xl mx-auto w-full">
          <div className="flex items-center text-xs font-medium text-text-sub dark:text-slate-400 gap-1">
            <span 
              className="hover:text-brand-purple cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              Home
            </span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-brand-purple dark:text-brand-light">Live Recording</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <button 
                className="flex items-center justify-center size-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors -ml-1"
                onClick={() => onNavigate('home')}
              >
                <span className="material-symbols-outlined text-text-main dark:text-white">arrow_back</span>
              </button>
              <h1 className="text-lg font-display font-bold text-slate-800 dark:text-white tracking-tight">KOR vs JPN</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Responsive Layout Wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Panel: Visuals (Scoreboard & Pitch) */}
        {/* Mobile: Scrolls with page. Desktop: Flex-1, potentially separate scroll or fixed */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col relative bg-slate-50 dark:bg-black/20 scrollbar-hide">
           <div className="p-4 lg:p-8 flex flex-col items-center gap-6 min-h-min lg:h-full lg:justify-center">
              
              {/* Scoreboard */}
              <div className="w-full max-w-md lg:max-w-4xl bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-4 border border-gray-100 dark:border-border-dark grid grid-cols-3 items-center gap-4 z-10">
                <div className="flex flex-col items-center border-r border-gray-100 dark:border-border-dark">
                  <span className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tighter">2 - 1</span>
                  <span className="text-[10px] text-text-sub dark:text-slate-400 font-semibold uppercase tracking-widest mt-1">Score</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <span className="text-4xl font-display font-bold text-brand-navy dark:text-brand-light tracking-widest tabular-nums">14:32</span>
                  </div>
                  <span className="text-xs font-medium text-brand-purple dark:text-brand-light bg-brand-light/50 dark:bg-brand-purple/20 px-2 py-0.5 rounded-full mt-1">Q3 Running</span>
                </div>
                <div className="flex flex-col items-center border-l border-gray-100 dark:border-border-dark">
                  <span className="text-2xl font-display font-bold text-slate-700 dark:text-slate-300">Q3</span>
                  <span className="text-[10px] text-text-sub dark:text-slate-400 font-semibold uppercase tracking-widest mt-1">Period</span>
                </div>
              </div>

              {/* Pitch Visual */}
              <div className="w-full max-w-md lg:max-w-5xl relative group perspective-1000">
                <div className="relative w-full aspect-[1.60] bg-pitch-border rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-lg">
                  <div className="absolute inset-[3px] bg-pitch-blue rounded-lg overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 180">
                      <line stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" x1="150" x2="150" y1="0" y2="180"></line>
                      <line stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" x1="68" x2="68" y1="0" y2="180"></line>
                      <line stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" x1="232" x2="232" y1="0" y2="180"></line>
                      <path d="M 0 36 L 12 36 A 54 54 0 0 1 12 144 L 0 144" fill="none" stroke="white" strokeWidth="1.5"></path>
                      <path d="M 300 36 L 288 36 A 54 54 0 0 0 288 144 L 300 144" fill="none" stroke="white" strokeWidth="1.5"></path>
                      <path d="M 0 24 L 12 24 A 66 66 0 0 1 12 156 L 0 156" fill="none" stroke="rgba(255,255,255,0.6)" strokeDasharray="4,4" strokeWidth="1.5"></path>
                      <path d="M 300 24 L 288 24 A 66 66 0 0 0 288 156 L 300 156" fill="none" stroke="rgba(255,255,255,0.6)" strokeDasharray="4,4" strokeWidth="1.5"></path>
                      <circle cx="45" cy="90" fill="white" r="1.8"></circle>
                      <circle cx="255" cy="90" fill="white" r="1.8"></circle>
                      <rect fill="none" height="12" stroke="white" strokeWidth="2" width="6" x="-4" y="84"></rect>
                      <rect fill="none" height="12" stroke="white" strokeWidth="2" width="6" x="298" y="84"></rect>
                      <circle cx="0" cy="0" fill="none" r="2" stroke="white" strokeWidth="1"></circle>
                      <circle cx="0" cy="180" fill="none" r="2" stroke="white" strokeWidth="1"></circle>
                      <circle cx="300" cy="0" fill="none" r="2" stroke="white" strokeWidth="1"></circle>
                      <circle cx="300" cy="180" fill="none" r="2" stroke="white" strokeWidth="1"></circle>
                    </svg>
                    <div className="absolute top-[40%] left-[75%] size-4 bg-brand-purple rounded-full shadow-[0_0_0_4px_rgba(99,102,241,0.3)] border-2 border-white transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-3 w-1.5 h-6 bg-white border border-gray-200 shadow-sm rounded-r transform -translate-y-1/2 z-20 hidden sm:block"></div>
                <div className="absolute top-1/2 right-3 w-1.5 h-6 bg-white border border-gray-200 shadow-sm rounded-l transform -translate-y-1/2 z-20 hidden sm:block"></div>
                <div className="text-center mt-2">
                  <span className="text-[10px] text-text-sub dark:text-slate-400 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-3 py-1 rounded-full font-medium shadow-sm">Pitch Location</span>
                </div>
              </div>

              {/* Mobile Spacer for controls below */}
              <div className="lg:hidden h-px w-full"></div>
           </div>

           {/* Mobile Controls Section (Rendered here to scroll with page on mobile) */}
           <div className="lg:hidden p-4 pb-32 flex flex-col gap-5">
              <ControlsSection />
              <HistoryList />
           </div>
        </div>

        {/* Right Panel: Controls & Sidebar (Desktop) */}
        <div className="hidden lg:flex w-[400px] xl:w-[480px] bg-white dark:bg-surface-dark border-l border-gray-200 dark:border-border-dark flex-col shadow-xl z-20">
           <div className="flex-1 overflow-y-auto p-6">
              <ControlsSection />
              <div className="mt-8">
                 <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 px-1">Recent Activity</h3>
                 <HistoryList />
              </div>
           </div>
           
           {/* Desktop Footer */}
           <div className="p-4 border-t border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark">
              <ActionFooter onNavigate={onNavigate} />
           </div>
        </div>

        {/* Mobile Footer (Fixed) */}
        <div className="lg:hidden absolute bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-border-dark p-4 z-40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
           <ActionFooter onNavigate={onNavigate} />
        </div>

      </div>
    </div>
  );
};

// Sub-components to avoid duplication and clean up render

const ControlsSection: React.FC = () => (
  <div className="flex flex-col gap-5 animate-fade-in-down">
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <div className="p-1 bg-brand-light dark:bg-brand-purple/20 rounded text-brand-purple dark:text-brand-light">
            <span className="material-symbols-outlined text-sm">sports_hockey</span>
          </div>
          슈팅 (Shooting) Options
        </h3>
        <button className="text-xs text-text-sub dark:text-slate-400 hover:text-red-500 font-medium transition-colors">Cancel</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button className="h-10 bg-white dark:bg-slate-800 border border-brand-purple/30 dark:border-brand-purple/50 rounded-lg flex items-center justify-center text-brand-purple dark:text-brand-light font-semibold hover:bg-brand-light dark:hover:bg-brand-purple/20 transition-all shadow-sm active:scale-95">
          유효 (Valid)
        </button>
        <button className="h-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-text-sub dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 transition-all active:scale-95 shadow-sm">
          블락 (Block)
        </button>
        <button className="h-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-text-sub dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 transition-all active:scale-95 shadow-sm">
          빗나감 (Miss)
        </button>
      </div>
    </div>
    
    <div className="h-px bg-gray-200 dark:bg-border-dark w-full"></div>
    
    <div className="grid grid-cols-3 gap-3">
      <button className="relative group bg-slate-800 dark:bg-slate-700 text-white rounded-xl flex flex-col items-center justify-center p-3 shadow-lg shadow-slate-200 dark:shadow-none scale-[1.02] ring-2 ring-brand-purple ring-offset-2 dark:ring-offset-surface-dark">
        <span className="material-symbols-outlined mb-1 text-2xl text-brand-purple dark:text-brand-light">sports_hockey</span>
        <span className="text-xs font-bold mt-1">슈팅</span>
        <div className="absolute top-2 right-2 size-2 bg-brand-purple dark:bg-brand-light rounded-full"></div>
      </button>
      <button className="bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-border-dark hover:border-brand-purple/30 rounded-xl flex flex-col items-center justify-center p-3 transition-all active:scale-95 shadow-card group">
        <span className="material-symbols-outlined mb-1 text-2xl text-text-sub dark:text-slate-400 group-hover:text-brand-purple dark:group-hover:text-brand-light transition-colors">arrow_right_alt</span>
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">패스</span>
      </button>
      <button className="bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-border-dark hover:border-brand-purple/30 rounded-xl flex flex-col items-center justify-center p-3 transition-all active:scale-95 shadow-card group">
        <span className="material-symbols-outlined mb-1 text-2xl text-text-sub dark:text-slate-400 group-hover:text-brand-purple dark:group-hover:text-brand-light transition-colors">radio_button_checked</span>
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">서클 진입</span>
      </button>
      <button className="bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-border-dark hover:border-brand-purple/30 rounded-xl flex flex-col items-center justify-center p-3 transition-all active:scale-95 shadow-card group">
        <span className="material-symbols-outlined mb-1 text-2xl text-text-sub dark:text-slate-400 group-hover:text-brand-purple dark:group-hover:text-brand-light transition-colors">directions_run</span>
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">드리블</span>
      </button>
      <button className="bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-border-dark hover:border-brand-purple/30 rounded-xl flex flex-col items-center justify-center p-3 transition-all active:scale-95 shadow-card group">
        <span className="material-symbols-outlined mb-1 text-2xl text-text-sub dark:text-slate-400 group-hover:text-brand-purple dark:group-hover:text-brand-light transition-colors">sync_problem</span>
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">턴오버</span>
      </button>
      <button className="bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-border-dark hover:border-brand-purple/30 rounded-xl flex flex-col items-center justify-center p-3 transition-all active:scale-95 shadow-card group">
        <span className="material-symbols-outlined mb-1 text-2xl text-text-sub dark:text-slate-400 group-hover:text-brand-purple dark:group-hover:text-brand-light transition-colors">shield</span>
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">수비</span>
      </button>
      <button className="col-span-3 bg-brand-light/30 dark:bg-brand-purple/10 hover:bg-brand-light/50 dark:hover:bg-brand-purple/20 border border-brand-purple/20 rounded-xl flex items-center justify-center p-3 gap-2 transition-all active:scale-95 mt-1 group">
        <span className="material-symbols-outlined text-brand-purple dark:text-brand-light">sports_handball</span>
        <span className="text-sm font-bold text-brand-navy dark:text-brand-light">GK Save / Action</span>
      </button>
    </div>
  </div>
);

const HistoryList: React.FC = () => (
  <div className="flex flex-col gap-2">
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 flex items-center justify-between shadow-sm transform transition-all hover:scale-[1.01] hover:border-brand-purple/30 group">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center justify-center bg-brand-light dark:bg-brand-purple/20 size-8 rounded text-brand-navy dark:text-brand-light text-xs font-bold">
          14:30
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800 dark:text-white">서클 진입 (Circle Entry)</span>
          <span className="text-xs text-text-sub dark:text-slate-400">Player #7 • Right Flank</span>
        </div>
      </div>
      <button className="text-gray-400 dark:text-slate-500 hover:text-brand-purple dark:hover:text-brand-light p-2 transition-colors">
        <span className="material-symbols-outlined text-lg">undo</span>
      </button>
    </div>
    <div className="bg-white/60 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-lg p-2.5 flex items-center justify-between shadow-sm opacity-70">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-700 size-8 rounded text-text-sub dark:text-slate-400 text-xs font-bold">
          14:28
        </div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">패스 (Pass) - Successful</span>
      </div>
    </div>
  </div>
);

const ActionFooter: React.FC<{onNavigate: (id: string) => void}> = ({onNavigate}) => (
  <div className="max-w-md lg:max-w-none mx-auto grid grid-cols-[1fr_auto] gap-3">
    <button className="flex-1 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 rounded-xl h-12 flex items-center justify-center gap-2 font-bold text-base active:scale-95 transition-all shadow-sm">
      <span className="material-symbols-outlined text-2xl">pause</span>
      Pause Match
    </button>
    <button 
      className="px-6 bg-slate-800 dark:bg-brand-purple hover:bg-slate-900 dark:hover:bg-brand-purple/90 text-white rounded-xl h-12 flex items-center justify-center font-bold text-base active:scale-95 transition-all shadow-md"
      onClick={() => onNavigate('home')}
    >
      Finish
    </button>
  </div>
);