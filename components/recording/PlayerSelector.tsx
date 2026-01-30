/**
 * PlayerSelector Component
 * Displays a grid of jersey numbers for quick player selection
 */

import React from 'react';
import type { Player } from '../../services/playerService';

interface PlayerSelectorProps {
  players: Player[];
  selectedPlayerId: string | null;
  onSelectPlayer: (player: Player | null) => void;
  team: 'home' | 'away';
  compact?: boolean;
}

export function PlayerSelector({
  players,
  selectedPlayerId,
  onSelectPlayer,
  team,
  compact = false,
}: PlayerSelectorProps) {
  const isHome = team === 'home';
  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  // Group by position for better organization
  const sortedPlayers = [...players].sort((a, b) => a.jersey_number - b.jersey_number);

  if (players.length === 0) {
    return (
      <div className="text-center py-2 text-[10px] text-slate-400">
        선수 미등록
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Selected player display */}
      {selectedPlayer && (
        <div 
          className={`flex items-center justify-between px-2 py-1 rounded-lg text-white text-[11px] font-bold ${
            isHome ? 'bg-team-home' : 'bg-team-away'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="bg-white/20 px-1.5 py-0.5 rounded font-black">
              #{selectedPlayer.jersey_number}
            </span>
            <span className="truncate max-w-[80px]">{selectedPlayer.name}</span>
          </span>
          <button
            onClick={() => onSelectPlayer(null)}
            className="p-0.5 hover:bg-white/20 rounded transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}

      {/* Jersey number grid */}
      <div className={`grid gap-1 ${compact ? 'grid-cols-5' : 'grid-cols-6'}`}>
        {sortedPlayers.map(player => {
          const isSelected = player.id === selectedPlayerId;
          
          return (
            <button
              key={player.id}
              onClick={() => onSelectPlayer(isSelected ? null : player)}
              className={`
                aspect-square rounded-lg font-black text-sm
                flex items-center justify-center
                transition-all duration-100 active:scale-90
                ${isSelected
                  ? isHome
                    ? 'bg-team-home text-white ring-2 ring-team-home ring-offset-1'
                    : 'bg-team-away text-white ring-2 ring-team-away ring-offset-1'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }
              `}
              title={`${player.name} (${player.position || ''})`}
            >
              {player.jersey_number}
            </button>
          );
        })}
      </div>

      {/* Hint text */}
      {!selectedPlayer && (
        <p className="text-[9px] text-slate-400 text-center">
          선수 선택 후 이벤트 기록
        </p>
      )}
    </div>
  );
}

export default PlayerSelector;
