/**
 * FieldPlayerSelector Component
 * Displays players as jersey numbers on a field graphic
 * Supports expansion for easier selection on mobile
 */

import React, { useState, useMemo } from 'react';
import type { Player } from '../../services/playerService';

interface FieldPlayerSelectorProps {
  players: Player[];
  selectedPlayerId: string | null;
  onSelectPlayer: (player: Player | null) => void;
  team: 'home' | 'away';
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

// Default formation positions (4-3-3 style layout)
// Positions are percentages [x%, y%] from top-left
const DEFAULT_POSITIONS: Record<number, [number, number]> = {
  // GK
  0: [50, 90],
  // Defenders (4)
  1: [15, 70],
  2: [38, 72],
  3: [62, 72],
  4: [85, 70],
  // Midfielders (3)
  5: [25, 48],
  6: [50, 52],
  7: [75, 48],
  // Forwards (3)
  8: [20, 25],
  9: [50, 20],
  10: [80, 25],
  // Substitutes (additional)
  11: [30, 38],
  12: [70, 38],
  13: [40, 60],
  14: [60, 60],
  15: [50, 75],
};

export function FieldPlayerSelector({
  players,
  selectedPlayerId,
  onSelectPlayer,
  team,
  isExpanded = false,
  onToggleExpand,
}: FieldPlayerSelectorProps) {
  const isHome = team === 'home';
  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  // Sort players by jersey number and assign positions
  const playersWithPositions = useMemo(() => {
    const sorted = [...players].sort((a, b) => a.jersey_number - b.jersey_number);
    return sorted.map((player, index) => ({
      ...player,
      position: DEFAULT_POSITIONS[index] || [50, 50 + (index * 5) % 40],
    }));
  }, [players]);

  const fieldHeight = isExpanded ? 'h-64' : 'h-32';
  const jerseySize = isExpanded ? 'w-9 h-9 text-sm' : 'w-6 h-6 text-[10px]';

  return (
    <div className="relative">
      {/* Field Container */}
      <div
        className={`relative ${fieldHeight} rounded-lg overflow-hidden transition-all duration-300 cursor-pointer`}
        style={{
          background: isHome
            ? 'linear-gradient(180deg, #1e40af 0%, #3b82f6 100%)'
            : 'linear-gradient(180deg, #dc2626 0%, #f87171 100%)',
        }}
        onClick={onToggleExpand}
      >
        {/* Field markings */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Center line */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" />
          {/* Center circle */}
          <circle cx="50" cy="50" r="12" fill="none" stroke="white" strokeWidth="0.5" />
          {/* Goal area (top) */}
          <rect x="30" y="0" width="40" height="12" fill="none" stroke="white" strokeWidth="0.5" />
          {/* Penalty arc (top) */}
          <path d="M 35 12 Q 50 20 65 12" fill="none" stroke="white" strokeWidth="0.5" />
          {/* Goal area (bottom) */}
          <rect x="30" y="88" width="40" height="12" fill="none" stroke="white" strokeWidth="0.5" />
          {/* Penalty arc (bottom) */}
          <path d="M 35 88 Q 50 80 65 88" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>

        {/* Expand hint */}
        {!isExpanded && (
          <div className="absolute top-1 right-1 bg-black/30 rounded px-1.5 py-0.5 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-white text-[10px]">open_in_full</span>
            <span className="text-white text-[8px]">확대</span>
          </div>
        )}

        {/* Collapse hint */}
        {isExpanded && (
          <div className="absolute top-2 right-2 bg-black/30 rounded px-2 py-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-white text-xs">close_fullscreen</span>
            <span className="text-white text-[10px]">축소</span>
          </div>
        )}

        {/* Players on field */}
        {playersWithPositions.map((player) => {
          const isSelected = player.id === selectedPlayerId;
          const [x, y] = player.position;

          return (
            <button
              key={player.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlayer(isSelected ? null : player);
              }}
              className={`
                absolute transform -translate-x-1/2 -translate-y-1/2
                ${jerseySize} rounded-full font-black
                flex items-center justify-center
                transition-all duration-150 active:scale-90
                shadow-lg border-2
                ${isSelected
                  ? 'bg-yellow-400 text-black border-yellow-300 ring-2 ring-yellow-300 ring-offset-1 scale-110 z-10'
                  : 'bg-white text-slate-800 border-white/80 hover:scale-105'
                }
              `}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              title={`#${player.jersey_number} ${player.name}`}
            >
              {player.jersey_number}
            </button>
          );
        })}

        {/* Empty state */}
        {players.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/60 text-xs">선수 미등록</span>
          </div>
        )}
      </div>

      {/* Selected player indicator */}
      {selectedPlayer && (
        <div
          className={`mt-2 flex items-center justify-between px-3 py-1.5 rounded-lg text-white text-xs font-bold ${
            isHome ? 'bg-blue-600' : 'bg-red-600'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded font-black">
              #{selectedPlayer.jersey_number}
            </span>
            <span className="truncate">{selectedPlayer.name}</span>
          </span>
          <button
            onClick={() => onSelectPlayer(null)}
            className="p-0.5 hover:bg-white/20 rounded transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default FieldPlayerSelector;
