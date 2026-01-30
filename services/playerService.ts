/**
 * Player Service - Frontend API Client
 * Handles player CRUD operations
 */

const API_BASE = '/api';

export interface Player {
  id: string;
  team_id: string;
  jersey_number: number;
  name: string;
  position?: 'GK' | 'DF' | 'MF' | 'FW';
  is_active: boolean;
}

export interface CreatePlayerInput {
  teamId: string;
  jerseyNumber: number;
  name: string;
  position?: string;
}

export interface UpdatePlayerInput {
  jerseyNumber?: number;
  name?: string;
  position?: string;
  isActive?: boolean;
}

/**
 * Get all players for a team
 */
export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  const res = await fetch(`${API_BASE}/players?teamId=${teamId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch players');
  }
  return res.json();
}

/**
 * Create a new player
 */
export async function createPlayer(input: CreatePlayerInput): Promise<Player> {
  const res = await fetch(`${API_BASE}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create player');
  }
  
  return res.json();
}

/**
 * Update a player
 */
export async function updatePlayer(id: string, input: UpdatePlayerInput): Promise<Player> {
  const res = await fetch(`${API_BASE}/players?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update player');
  }
  
  return res.json();
}

/**
 * Delete a player (soft delete)
 */
export async function deletePlayer(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/players?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error('Failed to delete player');
  }
}

/**
 * Build a jersey number to player name map for quick lookup
 */
export function buildJerseyMap(players: Player[]): Map<number, string> {
  const map = new Map<number, string>();
  players.forEach(p => map.set(p.jersey_number, p.name));
  return map;
}

/**
 * Get player name by jersey number
 */
export function getPlayerName(players: Player[], jerseyNumber: number): string | undefined {
  return players.find(p => p.jersey_number === jerseyNumber)?.name;
}
