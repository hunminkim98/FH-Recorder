import React from 'react';
import { METRIC_DEFINITIONS } from '../../constants';
import { PlayerSelector } from './PlayerSelector';
import type { Player } from '../../services/playerService';

interface SplitTeamMetricPanelProps {
  team: 'home' | 'away';
  teamName: string;
  players: Player[];
  selectedPlayerId: string | null;
  onSelectPlayer: (player: Player | null) => void;
  onRecord: (categoryIndex: number, itemIndex: number) => void;
  eventCounts: Record<string, number>;
}

// Category configuration: defines which categories to show and in what order
const CATEGORY_CONFIG = [
  {
    categoryIndex: 10, // 득점 (Scored)
    icon: 'sports_soccer',
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    gridCols: 'grid-cols-3',
    itemsToShow: [0, 1, 2], // FG, PCG, PSG
  },
  {
    categoryIndex: 0, // 슈팅 (Shot)
    icon: 'sports_hockey',
    colorClass: 'text-rose-700',
    bgClass: 'bg-rose-50',
    gridCols: 'grid-cols-3',
    itemsToShow: [0, 2, 1], // 유효(SOT), 빗나감, 블락
  },
  {
    categoryIndex: 1, // 패스 (Passing)
    icon: 'arrow_forward',
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
    gridCols: 'grid-cols-2',
    itemsToShow: null, // Show all items
    customLabels: [
      { label: '패스', sublabel: '성공' },
      { label: '패스', sublabel: '실패' },
      { label: '어시스트', sublabel: null },
      { label: '스쿱', sublabel: null },
    ],
  },
  {
    categoryIndex: 5, // 드리블 (Dribble)
    icon: 'directions_run',
    colorClass: 'text-sky-700',
    bgClass: 'bg-sky-50',
    gridCols: 'grid-cols-2',
    itemsToShow: null,
    customLabels: [
      { label: '25y-L', sublabel: null },
      { label: '25y-C', sublabel: null },
      { label: '25y-R', sublabel: null },
      { label: '전진', sublabel: null },
      { label: '서클진입', sublabel: null },
      { label: 'DRIB', sublabel: null },
    ],
  },
  {
    categoryIndex: 7, // 수비
    icon: 'shield',
    colorClass: 'text-indigo-700',
    bgClass: 'bg-indigo-50',
    gridCols: 'grid-cols-3',
    itemsToShow: [0, 1, 2], // 태클, 스틸, 차단
  },
  {
    categoryIndex: 3, // PC (Penalty Corner) + PS (Penalty Stroke)
    icon: 'flag',
    colorClass: 'text-orange-700',
    bgClass: 'bg-orange-50',
    gridCols: 'grid-cols-2',
    isComposite: true,
    compositeItems: [
      { categoryIndex: 3, itemIndex: 1, label: 'PC획득', sublabel: null },
      { categoryIndex: 4, itemIndex: 0, label: 'PS획득', sublabel: null },
    ],
  },
  {
    categoryIndex: 8, // 골키퍼 (GK) + 반칙 (Foul)
    icon: 'sports_handball',
    colorClass: 'text-yellow-700',
    bgClass: 'bg-yellow-50',
    gridCols: 'grid-cols-3',
    isComposite: true,
    compositeItems: [
      { categoryIndex: 8, itemIndex: 0, label: '선방', sublabel: null },
      { categoryIndex: 9, itemIndex: 0, label: 'G', sublabel: null },
      { categoryIndex: 9, itemIndex: 2, label: 'R', sublabel: null },
    ],
  },
];

export default function SplitTeamMetricPanel({
  team,
  teamName,
  players,
  selectedPlayerId,
  onSelectPlayer,
  onRecord,
  eventCounts,
}: SplitTeamMetricPanelProps) {
  const isHome = team === 'home';
  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  const getEventCount = (categoryIndex: number, itemIndex: number): number => {
    return eventCounts[`${categoryIndex}-${itemIndex}`] || 0;
  };

  const renderButton = (
    categoryIndex: number,
    itemIndex: number,
    label: string,
    sublabel: string | null,
    bgClass: string
  ) => {
    const count = getEventCount(categoryIndex, itemIndex);

    return (
      <button
        key={`${categoryIndex}-${itemIndex}`}
        onClick={() => onRecord(categoryIndex, itemIndex)}
        className={`flex flex-col items-center justify-center rounded-lg border shadow-sm active:scale-95 transition-all duration-75 select-none bg-white border-gray-200 py-2 ${bgClass}`}
      >
        <span className="font-bold text-[10px] leading-tight text-center truncate w-full px-0.5">
          {label}
        </span>
        {sublabel && (
          <span className="text-[8px] font-medium opacity-70 leading-none tracking-tighter">
            {sublabel}
          </span>
        )}
        {count > 0 && (
          <span className="text-[10px] font-bold text-gray-600 mt-0.5">
            {count}
          </span>
        )}
      </button>
    );
  };

  const renderCategoryCard = (config: typeof CATEGORY_CONFIG[0]) => {
    const { categoryIndex, icon, colorClass, bgClass, gridCols, itemsToShow, customLabels, isComposite, compositeItems } = config;

    // Composite categories (PC/PS, GK/카드)
    if (isComposite && compositeItems) {
      const categoryName = compositeItems.length > 1 && compositeItems[0].categoryIndex === 3
        ? 'PC/PS'
        : 'GK/카드';

      return (
        <div
          key={`composite-${categoryIndex}`}
          className={`bg-white rounded-xl p-1.5 shadow-sm ${
            isHome ? 'side-home border-l-4 border-l-team-home' : 'side-away border-r-4 border-r-team-away'
          }`}
        >
          <div className={`text-[9px] font-bold uppercase tracking-tight mb-1.5 px-1 ${colorClass} flex items-center gap-1`}>
            <span className="material-symbols-outlined text-[12px]">{icon}</span>
            {categoryName}
          </div>
          <div className={`grid ${gridCols} gap-1`}>
            {compositeItems.map(({ categoryIndex: cIdx, itemIndex, label, sublabel }) =>
              renderButton(cIdx, itemIndex, label, sublabel, bgClass)
            )}
          </div>
        </div>
      );
    }

    // Regular categories
    const category = METRIC_DEFINITIONS[categoryIndex];
    const categoryTitle = category.category.split(' ')[0]; // e.g., "슈팅" from "슈팅 (Shot)"

    const itemsToRender = itemsToShow
      ? itemsToShow.map(idx => category.items[idx])
      : category.items;

    return (
      <div
        key={categoryIndex}
        className={`bg-white rounded-xl p-1.5 shadow-sm ${
          isHome ? 'side-home border-l-4 border-l-team-home' : 'side-away border-r-4 border-r-team-away'
        }`}
      >
        <div className={`text-[9px] font-bold uppercase tracking-tight mb-1.5 px-1 ${colorClass} flex items-center gap-1`}>
          <span className="material-symbols-outlined text-[12px]">{icon}</span>
          {categoryTitle}
        </div>
        <div className={`grid ${gridCols} gap-1`}>
          {itemsToRender.map((item, idx) => {
            const actualItemIndex = itemsToShow ? itemsToShow[idx] : idx;
            const customLabel = customLabels?.[idx];

            const label = customLabel?.label || item.name;
            const sublabel = customLabel?.sublabel !== undefined ? customLabel.sublabel : null;

            return renderButton(categoryIndex, actualItemIndex, label, sublabel, bgClass);
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex-1 overflow-y-auto scrollbar-hide ${
      isHome ? 'bg-blue-50/20' : 'bg-red-50/20'
    } px-1.5 py-3 pb-32 flex flex-col gap-3`}>
      {/* Team header */}
      <div className={`text-[11px] font-black text-center uppercase tracking-widest flex items-center justify-center gap-1 ${
        isHome ? 'text-team-home' : 'text-team-away'
      }`}>
        <span className="material-symbols-outlined text-[14px]">
          {isHome ? 'home' : 'flight_takeoff'}
        </span>
        {teamName}
      </div>

      {/* Player Selector */}
      {players.length > 0 && (
        <div className={`bg-white rounded-xl p-2 shadow-sm ${
          isHome ? 'border-l-4 border-l-team-home' : 'border-r-4 border-r-team-away'
        }`}>
          <div className="text-[9px] font-bold uppercase tracking-tight mb-1.5 px-1 text-slate-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">person</span>
            선수 선택
          </div>
          <PlayerSelector
            players={players}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={onSelectPlayer}
            team={team}
            compact
          />
        </div>
      )}

      {/* Category cards */}
      {CATEGORY_CONFIG.map(config => renderCategoryCard(config))}
    </div>
  );
}
