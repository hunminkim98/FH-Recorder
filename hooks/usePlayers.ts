/**
 * usePlayers Hook - React hook for player data management
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Player,
  getPlayersByTeam,
  createPlayer,
  updatePlayer,
  deletePlayer,
  CreatePlayerInput,
  UpdatePlayerInput,
} from '../services/playerService';

interface UsePlayersOptions {
  teamId: string | null;
  autoFetch?: boolean;
}

interface UsePlayersReturn {
  players: Player[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  fetchPlayers: () => Promise<void>;
  addPlayer: (input: Omit<CreatePlayerInput, 'teamId'>) => Promise<Player | null>;
  editPlayer: (id: string, input: UpdatePlayerInput) => Promise<Player | null>;
  removePlayer: (id: string) => Promise<boolean>;
  
  // Utility
  getPlayerByNumber: (jerseyNumber: number) => Player | undefined;
  jerseyMap: Map<number, string>;
}

export function usePlayers({ teamId, autoFetch = true }: UsePlayersOptions): UsePlayersReturn {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    if (!teamId) {
      setPlayers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getPlayersByTeam(teamId);
      setPlayers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch players');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  // Auto-fetch on mount and teamId change
  useEffect(() => {
    if (autoFetch && teamId) {
      fetchPlayers();
    }
  }, [autoFetch, teamId, fetchPlayers]);

  const addPlayer = useCallback(async (input: Omit<CreatePlayerInput, 'teamId'>): Promise<Player | null> => {
    if (!teamId) {
      setError('No team selected');
      return null;
    }

    try {
      const player = await createPlayer({ ...input, teamId });
      setPlayers(prev => [...prev, player].sort((a, b) => a.jersey_number - b.jersey_number));
      return player;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create player');
      return null;
    }
  }, [teamId]);

  const editPlayer = useCallback(async (id: string, input: UpdatePlayerInput): Promise<Player | null> => {
    try {
      const updated = await updatePlayer(id, input);
      setPlayers(prev => 
        prev.map(p => p.id === id ? updated : p).sort((a, b) => a.jersey_number - b.jersey_number)
      );
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update player');
      return null;
    }
  }, []);

  const removePlayer = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deletePlayer(id);
      setPlayers(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete player');
      return false;
    }
  }, []);

  const getPlayerByNumber = useCallback((jerseyNumber: number): Player | undefined => {
    return players.find(p => p.jersey_number === jerseyNumber);
  }, [players]);

  // Jersey number -> name map for quick lookup
  const jerseyMap = useMemo(() => {
    const map = new Map<number, string>();
    players.forEach(p => map.set(p.jersey_number, p.name));
    return map;
  }, [players]);

  return {
    players,
    loading,
    error,
    fetchPlayers,
    addPlayer,
    editPlayer,
    removePlayer,
    getPlayerByNumber,
    jerseyMap,
  };
}
