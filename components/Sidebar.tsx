import React from 'react';
import { MENU_ITEMS } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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
              placeholder="지표 검색..." 
              type="text"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          {MENU_ITEMS.map((item) => (
            <a 
              key={item.label}
              href="#" 
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg group transition-all duration-200
                ${item.active 
                  ? 'text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/10' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }
              `}
            >
              <span className={`material-symbols-outlined text-[20px] ${!item.active && 'group-hover:text-primary dark:group-hover:text-primary-light'}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
              {item.count && (
                <span className={`
                  ml-auto text-xs font-semibold px-2 py-0.5 rounded-full
                  ${item.active 
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }
                `}>
                  {item.count}
                </span>
              )}
            </a>
          ))}
        </nav>

        <div className="p-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-slate-500 text-sm">info</span>
              </div>
              <h4 className="text-sm font-semibold mb-1 dark:text-slate-200">새로운 지표 추가</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">'서클 침투'에 대한 정의가 업데이트되었습니다.</p>
              <button className="text-xs font-medium text-primary dark:text-primary-light hover:underline">
                변경 내역 보기
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};