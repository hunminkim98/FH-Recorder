import { useState, useCallback, useMemo } from 'react';
import type { RecordedEvent, MatchRecordingState, Team } from '../types';
import { METRIC_DEFINITIONS } from '../constants';

interface UseMatchRecordingOptions {
  homeTeam?: Team;
  awayTeam?: Team;
}

export function useMatchRecording(options: UseMatchRecordingOptions = {}) {
  const [state, setState] = useState<MatchRecordingState>({
    matchId: crypto.randomUUID(),
    homeTeam: options.homeTeam || { id: 'home', name: 'Home' },
    awayTeam: options.awayTeam || { id: 'away', name: 'Away' },
    homeScore: 0,
    awayScore: 0,
    currentQuarter: 1,
    matchTimeSeconds: 0,
    isRunning: false,
    events: [],
  });

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');

  // Format seconds to MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  /**
   * Extract abbreviation from symbol string.
   * Handles various formats:
   * - "Shot on Target, SoT" -> "SoT"
   * - "Assist, AST, → 로 표기" -> "AST"
   * - "Touch" -> "Touch" (no comma, return as-is)
   * - "25Y Entry (좌25L, 중25M, 우25R)" -> "25Y" (extract first word before space or paren)
   */
  const extractAbbreviation = useCallback((symbol: string): string => {
    // If no comma, return the symbol trimmed (or first word if contains space/paren)
    if (!symbol.includes(',')) {
      const firstWord = symbol.split(/[\s(]/)[0];
      return firstWord.trim() || symbol.trim();
    }

    // Has comma: try to get the abbreviation part after first comma
    const parts = symbol.split(',');
    if (parts.length > 1) {
      // Get second part, take first word (the abbreviation)
      const abbrevPart = parts[1].trim();
      const abbrev = abbrevPart.split(/[\s→]/)[0];
      return abbrev.trim() || parts[0].trim();
    }

    return parts[0].trim();
  }, []);

  // Record a metric event
  const recordEvent = useCallback((categoryIndex: number, itemIndex: number) => {
    // Bounds checking
    if (categoryIndex < 0 || categoryIndex >= METRIC_DEFINITIONS.length) {
      console.error(`Invalid categoryIndex: ${categoryIndex}`);
      return null;
    }

    const category = METRIC_DEFINITIONS[categoryIndex];

    if (itemIndex < 0 || itemIndex >= category.items.length) {
      console.error(`Invalid itemIndex: ${itemIndex} for category ${category.category}`);
      return null;
    }

    const item = category.items[itemIndex];

    const newEvent: RecordedEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      matchTime: formatTime(state.matchTimeSeconds),
      quarter: state.currentQuarter,
      categoryIndex,
      categoryName: category.category,
      itemIndex,
      itemName: item.name,
      itemSymbol: extractAbbreviation(item.symbol),
      team: selectedTeam,
    };

    // Combined setState to avoid race condition - update events and score in single call
    setState(prev => {
      const isGoalEvent = category.category === '득점 (Scored)';

      return {
        ...prev,
        events: [newEvent, ...prev.events], // Prepend for reverse chrono
        homeScore: isGoalEvent && selectedTeam === 'home' ? prev.homeScore + 1 : prev.homeScore,
        awayScore: isGoalEvent && selectedTeam === 'away' ? prev.awayScore + 1 : prev.awayScore,
      };
    });

    return newEvent;
  }, [state.matchTimeSeconds, state.currentQuarter, selectedTeam, formatTime, extractAbbreviation]);

  // Player info for event recording
  interface PlayerInfo {
    playerId: string;
    playerNumber: number;
    playerName: string;
  }

  // Record a metric event for a specific team (overrides selectedTeam)
  const recordEventForTeam = useCallback((
    categoryIndex: number, 
    itemIndex: number, 
    team: 'home' | 'away',
    playerInfo?: PlayerInfo
  ) => {
    // Bounds checking
    if (categoryIndex < 0 || categoryIndex >= METRIC_DEFINITIONS.length) {
      console.error(`Invalid categoryIndex: ${categoryIndex}`);
      return null;
    }

    const category = METRIC_DEFINITIONS[categoryIndex];

    if (itemIndex < 0 || itemIndex >= category.items.length) {
      console.error(`Invalid itemIndex: ${itemIndex} for category ${category.category}`);
      return null;
    }

    const item = category.items[itemIndex];

    const newEvent: RecordedEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      matchTime: formatTime(state.matchTimeSeconds),
      quarter: state.currentQuarter,
      categoryIndex,
      categoryName: category.category,
      itemIndex,
      itemName: item.name,
      itemSymbol: extractAbbreviation(item.symbol),
      team,
      // Include player info if provided
      playerId: playerInfo?.playerId,
      playerNumber: playerInfo?.playerNumber,
      playerName: playerInfo?.playerName,
    };

    // Combined setState to avoid race condition - update events and score in single call
    setState(prev => {
      const isGoalEvent = category.category === '득점 (Scored)';

      return {
        ...prev,
        events: [newEvent, ...prev.events], // Prepend for reverse chrono
        homeScore: isGoalEvent && team === 'home' ? prev.homeScore + 1 : prev.homeScore,
        awayScore: isGoalEvent && team === 'away' ? prev.awayScore + 1 : prev.awayScore,
      };
    });

    return newEvent;
  }, [state.matchTimeSeconds, state.currentQuarter, formatTime, extractAbbreviation]);

  // Undo last event
  const undoLastEvent = useCallback(() => {
    setState(prev => {
      if (prev.events.length === 0) return prev;

      const removedEvent = prev.events[0];
      const newEvents = prev.events.slice(1);

      // Revert score if it was a goal
      let newHomeScore = prev.homeScore;
      let newAwayScore = prev.awayScore;

      const category = METRIC_DEFINITIONS[removedEvent.categoryIndex];
      if (category?.category === '득점 (Scored)') {
        if (removedEvent.team === 'home') newHomeScore--;
        else newAwayScore--;
      }

      return {
        ...prev,
        events: newEvents,
        homeScore: Math.max(0, newHomeScore),
        awayScore: Math.max(0, newAwayScore),
      };
    });
  }, []);

  // Get current category
  const currentCategory = useMemo(() => {
    if (selectedCategoryIndex < 0 || selectedCategoryIndex >= METRIC_DEFINITIONS.length) {
      return METRIC_DEFINITIONS[0];
    }
    return METRIC_DEFINITIONS[selectedCategoryIndex];
  }, [selectedCategoryIndex]);

  // Get event counts by category
  const eventCountsByCategory = useMemo(() => {
    const counts: Record<number, number> = {};
    state.events.forEach(event => {
      counts[event.categoryIndex] = (counts[event.categoryIndex] || 0) + 1;
    });
    return counts;
  }, [state.events]);

  // Timer controls
  const startTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const setQuarter = useCallback((quarter: number) => {
    setState(prev => ({ ...prev, currentQuarter: quarter }));
  }, []);

  const incrementTime = useCallback(() => {
    setState(prev => ({
      ...prev,
      matchTimeSeconds: prev.matchTimeSeconds + 1,
    }));
  }, []);

  return {
    state,
    selectedCategoryIndex,
    setSelectedCategoryIndex,
    selectedTeam,
    setSelectedTeam,
    currentCategory,
    eventCountsByCategory,
    recordEvent,
    recordEventForTeam,
    undoLastEvent,
    formatTime,
    startTimer,
    pauseTimer,
    setQuarter,
    incrementTime,
  };
}
