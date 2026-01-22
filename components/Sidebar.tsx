import React from 'react';
import { MENU_ITEMS } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (viewId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onNavigate }) => {
  const handleNavigation = (id: string) => {
    onNavigate(id);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        flex flex-col w-64 h-full
        bg-surface-light dark:bg-surface-dark 
        border-r border-border-light dark:border-border-dark
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
            FH
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Hockalytics</span>
        </div>

        <div className="px-4 mb-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200 placeholder-slate-400" 
              placeholder="팀, 선수 검색..." 
              type="text"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = item.id === currentView;
            return (
              <button 
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg group transition-all duration-200
                  ${isActive 
                    ? 'text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/10' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                <span className={`material-symbols-outlined text-[20px] ${!isActive && 'group-hover:text-primary dark:group-hover:text-primary-light'}`}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
                {item.count && (
                  <span className={`
                    ml-auto text-xs font-semibold px-2 py-0.5 rounded-full
                    ${isActive 
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }
                  `}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="bg-gradient-to-br from-primary to-purple-800 rounded-xl p-4 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-sm font-bold mb-1">프로 플랜</h4>
              <p className="text-xs text-white/80 mb-3">구독 갱신까지 3일 남았습니다.</p>
              <button className="text-xs bg-white/20 hover:bg-white/30 transition px-2 py-1 rounded">관리</button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </aside>
    </>
  );
};