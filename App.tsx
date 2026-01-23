import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { OperationalDefinitions } from './components/OperationalDefinitions';
import { LiveAnalysis } from './components/LiveAnalysis';

const App: React.FC = () => {
  // Initialize based on screen width (Desktop: open, Mobile: closed)
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : false);
  const [currentView, setCurrentView] = useState('home');

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} />;
      case 'definitions':
        return <OperationalDefinitions />;
      case 'analysis':
        return <LiveAnalysis onNavigate={setCurrentView} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
            <span className="material-symbols-outlined text-4xl mb-2">construction</span>
            <p>준비 중인 페이지입니다.</p>
          </div>
        );
    }
  };

  const isAnalysisMode = currentView === 'analysis';

  return (
    <div className="flex h-screen overflow-hidden">
      {!isAnalysisMode && (
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          currentView={currentView}
          onNavigate={setCurrentView}
        />
      )}

      <main className={`flex-1 flex flex-col h-full overflow-hidden relative ${isAnalysisMode ? 'bg-bg-page' : ''}`}>
        {/* Mobile Header - Show only if NOT in analysis mode */}
        {!isAnalysisMode && (
          <div className="md:hidden flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark sticky top-0 z-20">
            <span className="font-bold text-lg text-slate-900 dark:text-white">Hockalytics</span>
            <button 
              className="text-slate-500 dark:text-slate-400 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        )}

        {/* Desktop Sidebar Toggle Button */}
        {!isAnalysisMode && (
          <div className="hidden md:flex items-center p-4 pb-0 z-10">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-500 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
            >
              <span className="material-symbols-outlined">
                {sidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>
          </div>
        )}

        {/* Content Area */}
        {isAnalysisMode ? (
            <div className="flex-1 h-full w-full overflow-hidden">
                {renderContent()}
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                {renderContent()}
            </div>
        )}

        {/* Mobile Bottom Navigation - Hide in analysis mode */}
        {!isAnalysisMode && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark flex justify-around items-center p-2 z-30 pb-safe safe-area-bottom">
            <button 
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center p-2 ${currentView === 'home' ? 'text-primary dark:text-primary-light' : 'text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary-light'}`}
            >
              <span className="material-symbols-outlined text-[24px]">home</span>
              <span className="text-[10px] font-medium mt-1">홈</span>
            </button>
            <button 
               onClick={() => setCurrentView('analysis')}
              className={`flex flex-col items-center p-2 ${currentView === 'analysis' ? 'text-primary dark:text-primary-light' : 'text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary-light'}`}
            >
              <span className="material-symbols-outlined text-[24px]">analytics</span>
              <span className="text-[10px] font-medium mt-1">분석</span>
            </button>
            <button 
               onClick={() => setCurrentView('team')}
              className={`flex flex-col items-center p-2 ${currentView === 'team' ? 'text-primary dark:text-primary-light' : 'text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary-light'}`}
            >
              <span className="material-symbols-outlined text-[24px]">groups</span>
              <span className="text-[10px] font-medium mt-1">팀</span>
            </button>
            <button 
               onClick={() => setCurrentView('settings')}
              className={`flex flex-col items-center p-2 ${currentView === 'settings' ? 'text-primary dark:text-primary-light' : 'text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary-light'}`}
            >
              <span className="material-symbols-outlined text-[24px]">settings</span>
              <span className="text-[10px] font-medium mt-1">설정</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;