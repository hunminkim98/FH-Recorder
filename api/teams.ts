/**
 * Teams API - Vercel Serverless Function
 * 
 * GET    /api/teams           - List all teams
 * GET    /api/teams?id=xxx    - Get single team with players
 * POST   /api/teams           - Create a team
 * PUT    /api/teams?id=xxx    - Update a team
 * DELETE /api/teams?id=xxx    - Delete a team
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query, queryOne } from '../lib/db';

interface Team {
  id: string;
  name: string;
  short_name?: string;
  logo_url?: string;
}

interface TeamWithPlayers extends Team {
  players: {
    id: string;
    jersey_number: number;
    name: string;
    position?: string;
  }[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getTeams(req, res);
      case 'POST':
        return await createTeam(req, res);
      case 'PUT':
        return await updateTeam(req, res);
      case 'DELETE':
        return await deleteTeam(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getTeams(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  // Get single team with players
  if (id && typeof id === 'string') {
    const team = await queryOne<Team>(
      'SELECT id, name, short_name, logo_url FROM teams WHERE id = $1',
      [id]
    );

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const players = await query(
      `SELECT id, jersey_number, name, position
       FROM players
       WHERE team_id = $1 AND is_active = true
       ORDER BY jersey_number ASC`,
      [id]
    );

    const teamWithPlayers: TeamWithPlayers = {
      ...team,
      players,
    };

    return res.status(200).json(teamWithPlayers);
  }

  // Get all teams
  const teams = await query<Team>(
    'SELECT id, name, short_name, logo_url FROM teams ORDER BY name ASC'
  );

  return res.status(200).json(teams);
}

async function createTeam(req: VercelRequest, res: VercelResponse) {
  const { name, shortName, logoUrl } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Team name is required' });
  }

  const [team] = await query<Team>(
    `INSERT INTO teams (name, short_name, logo_url)
     VALUES ($1, $2, $3)
     RETURNING id, name, short_name, logo_url`,
    [name, shortName || null, logoUrl || null]
  );

  return res.status(201).json(team);
}

async function updateTeam(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const { name, shortName, logoUrl } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Team id is required' });
  }

  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    values.push(name);
  }
  if (shortName !== undefined) {
    updates.push(`short_name = $${paramCount++}`);
    values.push(shortName);
  }
  if (logoUrl !== undefined) {
    updates.push(`logo_url = $${paramCount++}`);
    values.push(logoUrl);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(id);

  const [team] = await query<Team>(
    `UPDATE teams SET ${updates.join(', ')}
     WHERE id = $${paramCount}
     RETURNING id, name, short_name, logo_url`,
    values
  );

  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  return res.status(200).json(team);
}

async function deleteTeam(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Team id is required' });
  }

  const [team] = await query<Team>(
    'DELETE FROM teams WHERE id = $1 RETURNING id',
    [id]
  );

  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  return res.status(200).json({ success: true });
}
