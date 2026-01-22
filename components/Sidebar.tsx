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
        h-full
        bg-surface-light dark:bg-surface-dark 
        border-r border-border-light dark:border-border-dark
        transition-all duration-300 ease-in-out
        flex flex-col whitespace-nowrap overflow-hidden
        ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64 md:w-0 md:translate-x-0 md:border-r-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
              FH
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Hockalytics</span>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
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

        <div className="p-4 border-t border-border-light dark:border-border-dark mt-auto">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
               <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-sm">person</span>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Coach Kim</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Open Source Edition</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};