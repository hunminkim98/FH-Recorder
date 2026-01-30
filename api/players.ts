/**
 * Players API - Vercel Serverless Function
 * 
 * GET    /api/players?teamId=xxx     - List players for a team
 * POST   /api/players                - Create a player
 * PUT    /api/players?id=xxx         - Update a player
 * DELETE /api/players?id=xxx         - Delete a player
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query, queryOne } from '../lib/db';

interface Player {
  id: string;
  team_id: string;
  jersey_number: number;
  name: string;
  position?: string;
  is_active: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getPlayers(req, res);
      case 'POST':
        return await createPlayer(req, res);
      case 'PUT':
        return await updatePlayer(req, res);
      case 'DELETE':
        return await deletePlayer(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getPlayers(req: VercelRequest, res: VercelResponse) {
  const { teamId } = req.query;

  if (!teamId || typeof teamId !== 'string') {
    return res.status(400).json({ error: 'teamId is required' });
  }

  const players = await query<Player>(
    `SELECT id, team_id, jersey_number, name, position, is_active
     FROM players 
     WHERE team_id = $1 AND is_active = true
     ORDER BY jersey_number ASC`,
    [teamId]
  );

  return res.status(200).json(players);
}

async function createPlayer(req: VercelRequest, res: VercelResponse) {
  const { teamId, jerseyNumber, name, position } = req.body;

  if (!teamId || jerseyNumber === undefined || !name) {
    return res.status(400).json({ error: 'teamId, jerseyNumber, and name are required' });
  }

  // Check for duplicate jersey number
  const existing = await queryOne(
    'SELECT id FROM players WHERE team_id = $1 AND jersey_number = $2',
    [teamId, jerseyNumber]
  );

  if (existing) {
    return res.status(409).json({ error: `Jersey number ${jerseyNumber} already exists in this team` });
  }

  const [player] = await query<Player>(
    `INSERT INTO players (team_id, jersey_number, name, position)
     VALUES ($1, $2, $3, $4)
     RETURNING id, team_id, jersey_number, name, position, is_active`,
    [teamId, jerseyNumber, name, position || null]
  );

  return res.status(201).json(player);
}

async function updatePlayer(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const { jerseyNumber, name, position, isActive } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Player id is required' });
  }

  // Build dynamic update query
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (jerseyNumber !== undefined) {
    updates.push(`jersey_number = $${paramCount++}`);
    values.push(jerseyNumber);
  }
  if (name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    values.push(name);
  }
  if (position !== undefined) {
    updates.push(`position = $${paramCount++}`);
    values.push(position);
  }
  if (isActive !== undefined) {
    updates.push(`is_active = $${paramCount++}`);
    values.push(isActive);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(id);

  const [player] = await query<Player>(
    `UPDATE players SET ${updates.join(', ')}
     WHERE id = $${paramCount}
     RETURNING id, team_id, jersey_number, name, position, is_active`,
    values
  );

  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }

  return res.status(200).json(player);
}

async function deletePlayer(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Player id is required' });
  }

  // Soft delete - set is_active to false
  const [player] = await query<Player>(
    `UPDATE players SET is_active = false
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }

  return res.status(200).json({ success: true });
}
