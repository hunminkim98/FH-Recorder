import type { Team, Match, SeasonStats, DashboardData } from '../types';

/**
 * Returns empty/default dashboard data structure.
 * Use this as initial state or when no data is available.
 */
export function getDefaultDashboardData(): DashboardData {
  return {
    recentMatches: [],
    seasonStats: {
      winRate: 0,
      goalsPerMatch: 0,
      circleEntries: 0,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
    },
    upcomingMatchCount: 0,
  };
}

/**
 * Helper for creating Team objects with defaults.
 * @param data - Partial team data
 * @returns Complete Team object
 */
export function createTeam(data: Partial<Team>): Team {
  return {
    id: data.id || crypto.randomUUID(),
    name: data.name || 'Unknown Team',
    shortName: data.shortName,
    logoUrl: data.logoUrl,
  };
}

/**
 * Helper for creating Match objects with defaults.
 * @param data - Partial match data
 * @returns Complete Match object
 */
export function createMatch(data: Partial<Match>): Match {
  const now = new Date();
  const defaultDate = now.toISOString();
  const defaultDisplayDate = now.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });

  return {
    id: data.id || crypto.randomUUID(),
    date: data.date || defaultDate,
    displayDate: data.displayDate || defaultDisplayDate,
    status: data.status || 'scheduled',
    homeTeam: data.homeTeam || createTeam({ name: 'Home Team' }),
    awayTeam: data.awayTeam || createTeam({ name: 'Away Team' }),
    homeScore: data.homeScore,
    awayScore: data.awayScore,
  };
}
