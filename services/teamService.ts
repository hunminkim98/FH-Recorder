/**
 * Team Service - Frontend API Client
 * Handles team CRUD operations
 */

import type { Player } from './playerService';

const API_BASE = '/api';

export interface Team {
  id: string;
  name: string;
  short_name?: string;
  logo_url?: string;
}

export interface TeamWithPlayers extends Team {
  players: Player[];
}

export interface CreateTeamInput {
  name: string;
  shortName?: string;
  logoUrl?: string;
}

export interface UpdateTeamInput {
  name?: string;
  shortName?: string;
  logoUrl?: string;
}

/**
 * Get all teams
 */
export async function getTeams(): Promise<Team[]> {
  const res = await fetch(`${API_BASE}/teams`);
  if (!res.ok) {
    throw new Error('Failed to fetch teams');
  }
  return res.json();
}

/**
 * Get a team by ID with its players
 */
export async function getTeamWithPlayers(id: string): Promise<TeamWithPlayers> {
  const res = await fetch(`${API_BASE}/teams?id=${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch team');
  }
  return res.json();
}

/**
 * Create a new team
 */
export async function createTeam(input: CreateTeamInput): Promise<Team> {
  const res = await fetch(`${API_BASE}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create team');
  }
  
  return res.json();
}

/**
 * Update a team
 */
export async function updateTeam(id: string, input: UpdateTeamInput): Promise<Team> {
  const res = await fetch(`${API_BASE}/teams?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update team');
  }
  
  return res.json();
}

/**
 * Delete a team
 */
export async function deleteTeam(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/teams?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error('Failed to delete team');
  }
}
