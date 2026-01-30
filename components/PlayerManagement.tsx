/**
 * PlayerManagement Component
 * UI for managing team roster (jersey number - name mapping)
 */

import React, { useState } from 'react';
import { usePlayers } from '../hooks/usePlayers';
import type { Player } from '../services/playerService';

interface PlayerManagementProps {
  teamId: string;
  teamName: string;
}

export const PlayerManagement: React.FC<PlayerManagementProps> = ({ teamId, teamName }) => {
  const { players, loading, error, addPlayer, editPlayer, removePlayer } = usePlayers({ teamId });
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({ jerseyNumber: '', name: '', position: '' });

  const resetForm = () => {
    setFormData({ jerseyNumber: '', name: '', position: '' });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const jerseyNumber = parseInt(formData.jerseyNumber, 10);
    if (isNaN(jerseyNumber) || !formData.name.trim()) return;

    if (editingId) {
      await editPlayer(editingId, {
        jerseyNumber,
        name: formData.name.trim(),
        position: formData.position || undefined,
      });
    } else {
      await addPlayer({
        jerseyNumber,
        name: formData.name.trim(),
        position: formData.position || undefined,
      });
    }
    
    resetForm();
  };

  const startEdit = (player: Player) => {
    setEditingId(player.id);
    setFormData({
      jerseyNumber: player.jersey_number.toString(),
      name: player.name,
      position: player.position || '',
    });
    setIsAddingNew(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 이 선수를 삭제하시겠습니까?')) {
      await removePlayer(id);
    }
  };

  const positionOptions = [
    { value: '', label: '포지션 선택' },
    { value: 'GK', label: '골키퍼 (GK)' },
    { value: 'DF', label: '수비수 (DF)' },
    { value: 'MF', label: '미드필더 (MF)' },
    { value: 'FW', label: '공격수 (FW)' },
  ];

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{teamName}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">선수 명단 관리</p>
        </div>
        {!isAddingNew && !editingId && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            선수 추가
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAddingNew || editingId) && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                등번호 *
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={formData.jerseyNumber}
                onChange={e => setFormData(prev => ({ ...prev, jerseyNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="00"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                이름 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="선수 이름"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                포지션
              </label>
              <select
                value={formData.position}
                onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {positionOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {editingId ? '수정' : '추가'}
            </button>
          </div>
        </form>
      )}

      {/* Players List */}
      {loading ? (
        <div className="text-center py-8 text-slate-500">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          <p className="mt-2">로딩 중...</p>
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-2">group_off</span>
          <p>등록된 선수가 없습니다</p>
          <p className="text-sm mt-1">선수를 추가해 주세요</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-20">
                  등번호
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-24">
                  포지션
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-24">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {players.map(player => (
                <tr key={player.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 text-primary font-bold rounded-full">
                      {player.jersey_number}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {player.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {player.position || '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(player)}
                      className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors mr-1"
                      title="수정"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {players.length > 0 && (
        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          총 {players.length}명의 선수
        </div>
      )}
    </div>
  );
};
