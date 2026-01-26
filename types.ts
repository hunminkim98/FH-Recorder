export interface MenuItem {
  id: string;
  icon: string;
  label: string;
  count?: number;
}

export interface MetricItem {
  name: string;
  symbol: string;
  definition: string;
  definitionRowSpan?: number;
}

export interface MetricCategory {
  category: string;
  items: MetricItem[];
}

export interface ConceptCardProps {
  icon: string;
  iconColorClass: string;
  title: string;
  description: string;
  noteLabel: string;
  note: string;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logoUrl?: string;
}

export interface Match {
  id: string;
  date: string; // ISO date
  displayDate: string; // Formatted for UI, e.g., "10월 12일"
  status: 'scheduled' | 'live' | 'completed';
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
}

export interface SeasonStats {
  winRate: number; // 0-100
  goalsPerMatch: number;
  circleEntries: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface DashboardData {
  recentMatches: Match[];
  seasonStats: SeasonStats;
  upcomingMatchCount: number;
}

// Add new types for live recording

export interface RecordedEvent {
  id: string;
  timestamp: Date;
  matchTime: string; // e.g., "14:32"
  quarter: number; // 1-4
  categoryIndex: number; // Index into METRIC_DEFINITIONS
  categoryName: string; // e.g., "슈팅 (Shot)"
  itemIndex: number; // Index into category.items
  itemName: string; // e.g., "유효 슈팅"
  itemSymbol: string; // e.g., "SoT"
  team: 'home' | 'away';
  playerId?: string; // Future use
}

export interface MatchRecordingState {
  matchId: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  currentQuarter: number;
  matchTimeSeconds: number; // Running time in seconds
  isRunning: boolean;
  events: RecordedEvent[];
}