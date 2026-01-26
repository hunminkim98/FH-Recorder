# Live Analysis Redesign Plan

## Summary

Redesign the LiveAnalysis component to support **ALL 11 metric categories and 28 metric items** from `METRIC_DEFINITIONS` in `constants.ts`. The current implementation hardcodes only 6 categories with limited sub-options. The new design will use a **scrollable horizontal category tabs + expandable sub-item grid** pattern optimized for one-handed mobile use during live match recording.

---

## Context

### Original Request
현재 분석섹션(LiveAnalysis.tsx)은 constants.ts의 모든 조작적 정의(METRIC_DEFINITIONS - 11개 카테고리, 28개 메트릭)를 기록할 수 없는 UX/UI입니다. 이 웹앱의 설계 의도는 모든 조작적 정의를 웹앱을 통해 쉽게 counting 하는 것이므로, LiveAnalysis 화면을 재설계하여 모든 메트릭을 기록할 수 있도록 해야 합니다.

### Current State Analysis
- **LiveAnalysis.tsx**: 240 lines, hardcoded 6 category buttons + GK Save
- **Only 슈팅 (Shot)** has sub-options expanded (유효, 블락, 빗나감)
- **No state management** for recording events
- **No integration** with `METRIC_DEFINITIONS` from constants.ts
- **No event history persistence** - `HistoryList` is static/mock data

### METRIC_DEFINITIONS Structure (11 Categories, 28 Items)
| Category | Items | Notes |
|----------|-------|-------|
| 슈팅 (Shot) | 3 | SoT, BLK, OFF |
| 패스 (Passing) | 4 | AST, SCP, 25Y, Circle |
| 슈팅 기술 (Tech) | 3 | Push/Flick, Hit, Touch |
| PC (Penalty Corner) | 2 | PCA, PCM |
| PS (Penalty Stroke) | 2 | PS, PSM |
| 드리블 (Dribble) | 3 | 1:1, Drible, Forward |
| 턴오버 (Turnover) | 1 | TO |
| 수비 | 3 | TKL, STL, BLK |
| 골키퍼 (GK) | 1 | SV |
| 반칙 (Foul) | 3 | GRC, YLC, RDC |
| 득점 (Scored) | 3 | FGS, PCS, PSS |

---

## Work Objectives

### Core Objective
Transform LiveAnalysis into a fully functional match recording interface that enables coaches to track ALL 28 metrics across 11 categories with quick, one-tap interactions optimized for mobile use during live matches.

### Deliverables
1. **Dynamic category navigation** from `METRIC_DEFINITIONS`
2. **Sub-item selection UI** for each category
3. **Event recording state management** with timestamps
4. **Live event history** with undo capability
5. **Team attribution** (home vs away) for recorded events
6. **Preserved pitch visualization and scoreboard**

### Definition of Done
- [ ] All 11 categories are navigable via horizontal scroll tabs
- [ ] All 28 metric items are recordable via sub-item buttons
- [ ] Each recorded event has: timestamp, category, item, team, optional player
- [ ] Event history displays in reverse chronological order
- [ ] Undo functionality removes the most recent event
- [ ] UI is responsive and works on mobile (320px+) and desktop
- [ ] No hardcoded category/item data - all from METRIC_DEFINITIONS

---

## Must Have / Must NOT Have

### Must Have (Guardrails)
- Dynamic rendering from `METRIC_DEFINITIONS` constant
- One-tap recording for common metrics
- Team selection (home/away) before or after recording
- Timestamp on every event
- Undo/delete last event functionality
- Horizontal scrollable category tabs (mobile-friendly)
- Maintain existing pitch visualization and scoreboard
- Dark mode support (existing pattern)

### Must NOT Have
- Player selection (future enhancement - not in scope)
- Pitch location tracking (future enhancement)
- Data persistence to backend/localStorage (out of scope for this plan)
- Complex filtering/search of history
- Edit existing events (only add/undo)

---

## Task Flow and Dependencies

```
[Task 1: Types] ──────────────────────────────────┐
                                                   │
[Task 2: Icon Mapping] ───────────────────────────┤
                                                   ▼
                                           [Task 3: State Hook]
                                           (includes creating hooks/ directory)
                                                   │
                                                   ▼
                         ┌─────────────────────────┴─────────────────────────┐
                         ▼                                                   ▼
              [Task 4: Category Tabs]                          [Task 5: Sub-Item Grid]
                         │                                                   │
                         └─────────────────────────┬─────────────────────────┘
                                                   ▼
                                         [Task 6: Event History]
                                                   │
                                                   ▼
                                       [Task 7: Integration & Test]
```

---

## Detailed TODOs

### Task 1: Define Recording Event Types
**File:** `c:\Users\BB1\Desktop\FH-Recorder\types.ts`
**Lines:** Add after line 61

**Changes:**
```typescript
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
```

**Acceptance Criteria:**
- [ ] `RecordedEvent` interface exists with all required fields
- [ ] `MatchRecordingState` interface exists
- [ ] Types are exported and usable in other files

---

### Task 2: Create Category Icon Mapping
**File:** `c:\Users\BB1\Desktop\FH-Recorder\constants.ts`
**Lines:** Add after `METRIC_DEFINITIONS` (after line 209)

**Changes:**
```typescript
// Icon mapping for each metric category (Material Symbols)
// NOTE: Must have exactly 11 entries matching the 11 categories in METRIC_DEFINITIONS
export const CATEGORY_ICONS: Record<string, string> = {
  '슈팅 (Shot)': 'sports_hockey',
  '패스 (Passing)': 'arrow_right_alt',
  '슈팅 기술 (Tech)': 'precision_manufacturing',
  'PC (Penalty Corner)': 'flag',
  'PS (Penalty Stroke)': 'sports_score',
  '드리블 (Dribble)': 'directions_run',
  '턴오버 (Turnover)': 'sync_problem',
  '수비': 'shield',
  '골키퍼 (GK)': 'sports_handball',
  '반칙 (Foul)': 'front_hand',
  '득점 (Scored)': 'emoji_events',
};

// Color classes for category badges (for visual distinction)
// NOTE: Must have exactly 11 entries matching the 11 categories in METRIC_DEFINITIONS
export const CATEGORY_COLORS: Record<string, string> = {
  '슈팅 (Shot)': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  '패스 (Passing)': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  '슈팅 기술 (Tech)': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'PC (Penalty Corner)': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'PS (Penalty Stroke)': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  '드리블 (Dribble)': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  '턴오버 (Turnover)': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  '수비': 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300',
  '골키퍼 (GK)': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  '반칙 (Foul)': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  '득점 (Scored)': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};
```

**Acceptance Criteria:**
- [ ] All 11 categories in `METRIC_DEFINITIONS` have an icon in `CATEGORY_ICONS`
- [ ] All 11 categories have a color class in `CATEGORY_COLORS`
- [ ] Icons use Material Symbols (already loaded in the app)

---

### Task 3: Create Recording State Management Hook
**File:** `c:\Users\BB1\Desktop\FH-Recorder\hooks\useMatchRecording.ts` (NEW FILE)

**IMPORTANT:** The `hooks/` directory does not exist. It MUST be created first:
```bash
mkdir c:\Users\BB1\Desktop\FH-Recorder\hooks
```

**Changes:**
```typescript
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
    undoLastEvent,
    formatTime,
    startTimer,
    pauseTimer,
    setQuarter,
    incrementTime,
  };
}
```

**Acceptance Criteria:**
- [ ] `hooks/` directory is created
- [ ] Hook manages full recording state
- [ ] `recordEvent` creates properly typed events with bounds checking
- [ ] `recordEvent` updates events and score in a single setState (no race condition)
- [ ] `extractAbbreviation` handles edge cases like 'Touch' and '25Y Entry (좌25L, 중25M, 우25R)'
- [ ] `undoLastEvent` removes most recent and reverts score if needed
- [ ] Score auto-updates on goal events
- [ ] Category selection state is managed

---

### Task 4: Create Category Tabs Component
**File:** `c:\Users\BB1\Desktop\FH-Recorder\components\CategoryTabs.tsx` (NEW FILE)

**Changes:**
```typescript
import React, { useRef, useEffect } from 'react';
import { METRIC_DEFINITIONS, CATEGORY_ICONS } from '../constants';

interface CategoryTabsProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
  eventCounts?: Record<number, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedIndex,
  onSelect,
  eventCounts = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to selected tab
  useEffect(() => {
    if (selectedRef.current && containerRef.current) {
      const container = containerRef.current;
      const selected = selectedRef.current;
      const containerRect = container.getBoundingClientRect();
      const selectedRect = selected.getBoundingClientRect();

      const scrollLeft = selected.offsetLeft - containerRect.width / 2 + selectedRect.width / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [selectedIndex]);

  return (
    <div className="relative">
      {/* Gradient fade indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-surface-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-surface-dark to-transparent z-10 pointer-events-none" />

      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2 -mx-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {METRIC_DEFINITIONS.map((category, index) => {
          const isSelected = index === selectedIndex;
          const icon = CATEGORY_ICONS[category.category] || 'category';
          const count = eventCounts[index] || 0;

          // Extract short name (Korean part before parentheses)
          const shortName = category.category.split(' (')[0];

          return (
            <button
              key={category.category}
              ref={isSelected ? selectedRef : null}
              onClick={() => onSelect(index)}
              className={`
                relative flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl
                text-sm font-medium whitespace-nowrap transition-all
                ${isSelected
                  ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
                  : 'bg-gray-100 dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }
              `}
            >
              <span className="material-symbols-outlined text-lg">{icon}</span>
              <span>{shortName}</span>
              {count > 0 && (
                <span className={`
                  absolute -top-1 -right-1 min-w-[18px] h-[18px]
                  flex items-center justify-center px-1
                  text-[10px] font-bold rounded-full
                  ${isSelected
                    ? 'bg-white text-brand-purple'
                    : 'bg-brand-purple text-white'
                  }
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] All 11 categories render as horizontal scrollable tabs
- [ ] Selected tab has visual distinction (purple bg)
- [ ] Event counts display as badges on tabs
- [ ] Auto-scroll centers selected tab on change
- [ ] Mobile-friendly touch scroll

---

### Task 5: Create Sub-Item Grid Component
**File:** `c:\Users\BB1\Desktop\FH-Recorder\components\MetricItemGrid.tsx` (NEW FILE)

**Changes:**
```typescript
import React from 'react';
import type { MetricCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface MetricItemGridProps {
  category: MetricCategory;
  categoryIndex: number;
  selectedTeam: 'home' | 'away';
  onRecordEvent: (categoryIndex: number, itemIndex: number) => void;
  onTeamChange: (team: 'home' | 'away') => void;
}

export const MetricItemGrid: React.FC<MetricItemGridProps> = ({
  category,
  categoryIndex,
  selectedTeam,
  onRecordEvent,
  onTeamChange,
}) => {
  const colorClass = CATEGORY_COLORS[category.category] || 'bg-gray-100 text-gray-700';

  /**
   * Extract abbreviation from symbol string.
   * Handles various formats:
   * - "Shot on Target, SoT" -> "SoT"
   * - "Assist, AST, → 로 표기" -> "AST"
   * - "Touch" -> "Touch" (no comma, return as-is)
   * - "25Y Entry (좌25L, 중25M, 우25R)" -> "25Y"
   */
  const getAbbreviation = (symbol: string): string => {
    // If no comma, return first word (before space or parenthesis)
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
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Team Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-text-sub dark:text-slate-400">Team:</span>
        <div className="flex rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => onTeamChange('home')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedTeam === 'home'
                ? 'bg-brand-navy text-white'
                : 'bg-white dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onTeamChange('away')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedTeam === 'away'
                ? 'bg-brand-navy text-white'
                : 'bg-white dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            Away
          </button>
        </div>
      </div>

      {/* Category Header */}
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${colorClass}`}>
          {category.category}
        </span>
        <span className="text-xs text-text-sub dark:text-slate-500">
          {category.items.length} metrics
        </span>
      </div>

      {/* Metric Items Grid */}
      <div className={`grid gap-2 ${
        category.items.length === 1
          ? 'grid-cols-1'
          : category.items.length === 2
            ? 'grid-cols-2'
            : 'grid-cols-2 sm:grid-cols-3'
      }`}>
        {category.items.map((item, itemIndex) => {
          const abbrev = getAbbreviation(item.symbol);

          return (
            <button
              key={item.name}
              onClick={() => onRecordEvent(categoryIndex, itemIndex)}
              className="
                relative bg-white dark:bg-slate-800
                border-2 border-gray-200 dark:border-slate-700
                hover:border-brand-purple dark:hover:border-brand-purple
                rounded-xl p-4
                flex flex-col items-center justify-center gap-1
                transition-all active:scale-95 active:border-brand-purple
                shadow-sm hover:shadow-md
                min-h-[80px]
                group
              "
            >
              <span className="text-lg font-bold text-brand-navy dark:text-brand-light group-hover:scale-110 transition-transform">
                {abbrev || item.name.slice(0, 3)}
              </span>
              <span className="text-xs text-center text-text-sub dark:text-slate-400 line-clamp-2">
                {item.name}
              </span>

              {/* Touch feedback ring */}
              <div className="absolute inset-0 rounded-xl ring-0 ring-brand-purple/50 group-active:ring-4 transition-all pointer-events-none" />
            </button>
          );
        })}
      </div>

      {/* Helper text showing definition on long-press (future) */}
      <p className="text-[10px] text-text-sub dark:text-slate-500 text-center mt-1">
        Tap to record event
      </p>
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] All items in selected category render as tappable cards
- [ ] Grid layout adapts to item count (1/2/3 columns)
- [ ] Team selector (home/away) is prominent
- [ ] Visual feedback on tap (scale, border)
- [ ] Abbreviation displays prominently, handles edge cases (Touch, 25Y Entry, etc.)

---

### Task 6: Update Event History Component
**File:** `c:\Users\BB1\Desktop\FH-Recorder\components\EventHistory.tsx` (NEW FILE)

**Changes:**
```typescript
import React from 'react';
import type { RecordedEvent } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';

interface EventHistoryProps {
  events: RecordedEvent[];
  onUndo: () => void;
  maxDisplay?: number;
}

export const EventHistory: React.FC<EventHistoryProps> = ({
  events,
  onUndo,
  maxDisplay = 10,
}) => {
  const displayedEvents = events.slice(0, maxDisplay);
  const hasMore = events.length > maxDisplay;

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-600 mb-2">
          history
        </span>
        <p className="text-sm text-text-sub dark:text-slate-500">
          No events recorded yet
        </p>
        <p className="text-xs text-text-sub dark:text-slate-600 mt-1">
          Tap a metric to start recording
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Header with undo button */}
      <div className="flex items-center justify-between px-1 mb-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-brand-purple">history</span>
          Recent ({events.length})
        </h3>
        {events.length > 0 && (
          <button
            onClick={onUndo}
            className="flex items-center gap-1 text-xs text-text-sub dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-sm">undo</span>
            Undo Last
          </button>
        )}
      </div>

      {/* Event List */}
      <div className="flex flex-col gap-2">
        {displayedEvents.map((event, index) => {
          const icon = CATEGORY_ICONS[event.categoryName] || 'sports';
          const colorClass = CATEGORY_COLORS[event.categoryName] || 'bg-gray-100 text-gray-700';
          const isLatest = index === 0;

          return (
            <div
              key={event.id}
              className={`
                relative bg-white dark:bg-slate-800
                border border-gray-200 dark:border-slate-700
                rounded-lg p-3
                flex items-center gap-3
                shadow-sm
                transition-all
                ${isLatest
                  ? 'ring-2 ring-brand-purple/30 border-brand-purple/30'
                  : 'opacity-80 hover:opacity-100'
                }
              `}
            >
              {/* Time Badge */}
              <div className={`
                flex flex-col items-center justify-center
                min-w-[48px] h-10 rounded-lg
                text-xs font-bold
                ${isLatest
                  ? 'bg-brand-light dark:bg-brand-purple/20 text-brand-navy dark:text-brand-light'
                  : 'bg-gray-100 dark:bg-slate-700 text-text-sub dark:text-slate-400'
                }
              `}>
                <span>{event.matchTime}</span>
                <span className="text-[9px] font-normal">Q{event.quarter}</span>
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`
                    inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold
                    ${colorClass}
                  `}>
                    <span className="material-symbols-outlined text-xs">{icon}</span>
                    {event.itemSymbol}
                  </span>
                  <span className={`
                    text-[10px] font-bold px-1.5 py-0.5 rounded
                    ${event.team === 'home'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    }
                  `}>
                    {event.team === 'home' ? 'HOME' : 'AWAY'}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate mt-0.5">
                  {event.itemName}
                </p>
              </div>

              {/* Latest indicator */}
              {isLatest && (
                <span className="absolute -top-1 -right-1 size-3 bg-brand-purple rounded-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Show more indicator */}
      {hasMore && (
        <p className="text-xs text-center text-text-sub dark:text-slate-500 py-2">
          +{events.length - maxDisplay} more events
        </p>
      )}
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] Events display in reverse chronological order
- [ ] Each event shows: time, quarter, category, item, team
- [ ] Latest event has visual distinction (ring, pulse indicator)
- [ ] Undo button is accessible and functional
- [ ] Empty state shows helpful message
- [ ] Limited display with "more" indicator

---

### Task 7: Refactor LiveAnalysis.tsx
**File:** `c:\Users\BB1\Desktop\FH-Recorder\components\LiveAnalysis.tsx`

**Changes:** Complete rewrite of the component to use new sub-components and hook.

**Key Changes:**
1. Import and use `useMatchRecording` hook
2. Replace hardcoded `ControlsSection` with `CategoryTabs` + `MetricItemGrid`
3. Replace static `HistoryList` with `EventHistory`
4. Update scoreboard to use state from hook (`state.homeScore`, `state.awayScore`)
5. Add timer effect for match time (when running)
6. Keep existing pitch visualization and layout structure
7. Remove old `ControlsSection`, `HistoryList`, and `ActionFooter` sub-components

**Complete Refactored Component:**
```typescript
import React, { useEffect } from 'react';
import { useMatchRecording } from '../hooks/useMatchRecording';
import { CategoryTabs } from './CategoryTabs';
import { MetricItemGrid } from './MetricItemGrid';
import { EventHistory } from './EventHistory';

interface LiveAnalysisProps {
  onNavigate: (viewId: string) => void;
}

export const LiveAnalysis: React.FC<LiveAnalysisProps> = ({ onNavigate }) => {
  const {
    state,
    selectedCategoryIndex,
    setSelectedCategoryIndex,
    selectedTeam,
    setSelectedTeam,
    currentCategory,
    eventCountsByCategory,
    recordEvent,
    undoLastEvent,
    formatTime,
    startTimer,
    pauseTimer,
    incrementTime,
  } = useMatchRecording();

  // Timer effect
  useEffect(() => {
    if (!state.isRunning) return;
    const interval = setInterval(incrementTime, 1000);
    return () => clearInterval(interval);
  }, [state.isRunning, incrementTime]);

  // Determine quarter status text
  const quarterStatusText = state.isRunning ? 'Running' : 'Paused';

  return (
    <div className="bg-bg-page dark:bg-background-dark text-text-main dark:text-slate-200 font-body h-full flex flex-col overflow-hidden selection:bg-brand-purple selection:text-white relative">
      {/* Header - Sticky & Full Width */}
      <header className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-border-dark px-4 py-3 shrink-0 z-30 shadow-sm sticky top-0">
        <div className="flex flex-col gap-1 max-w-7xl mx-auto w-full">
          <div className="flex items-center text-xs font-medium text-text-sub dark:text-slate-400 gap-1">
            <span
              className="hover:text-brand-purple cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              Home
            </span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-brand-purple dark:text-brand-light">Live Recording</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <button
                className="flex items-center justify-center size-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors -ml-1"
                onClick={() => onNavigate('home')}
              >
                <span className="material-symbols-outlined text-text-main dark:text-white">arrow_back</span>
              </button>
              <h1 className="text-lg font-display font-bold text-slate-800 dark:text-white tracking-tight">
                {state.homeTeam.name} vs {state.awayTeam.name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {state.isRunning && (
                <>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Live</span>
                </>
              )}
              {!state.isRunning && (
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">Paused</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Responsive Layout Wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* Left Panel: Visuals (Scoreboard & Pitch) */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col relative bg-slate-50 dark:bg-black/20 scrollbar-hide">
           <div className="p-4 lg:p-8 flex flex-col items-center gap-6 min-h-min lg:h-full lg:justify-center">

              {/* Scoreboard - Connected to state */}
              <div className="w-full max-w-md lg:max-w-4xl bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-4 border border-gray-100 dark:border-border-dark grid grid-cols-3 items-center gap-4 z-10">
                <div className="flex flex-col items-center border-r border-gray-100 dark:border-border-dark">
                  <span className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tighter">
                    {state.homeScore} - {state.awayScore}
                  </span>
                  <span className="text-[10px] text-text-sub dark:text-slate-400 font-semibold uppercase tracking-widest mt-1">Score</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <span className="text-4xl font-display font-bold text-brand-navy dark:text-brand-light tracking-widest tabular-nums">
                      {formatTime(state.matchTimeSeconds)}
                    </span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                    state.isRunning
                      ? 'text-brand-purple dark:text-brand-light bg-brand-light/50 dark:bg-brand-purple/20'
                      : 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20'
                  }`}>
                    Q{state.currentQuarter} {quarterStatusText}
                  </span>
                </div>
                <div className="flex flex-col items-center border-l border-gray-100 dark:border-border-dark">
                  <span className="text-2xl font-display font-bold text-slate-700 dark:text-slate-300">Q{state.currentQuarter}</span>
                  <span className="text-[10px] text-text-sub dark:text-slate-400 font-semibold uppercase tracking-widest mt-1">Period</span>
                </div>
              </div>

              {/* Pitch Visual - Unchanged */}
              <div className="w-full max-w-md lg:max-w-5xl relative group perspective-1000">
                <div className="relative w-full aspect-[1.60] bg-pitch-border rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-lg">
                  <div className="absolute inset-[3px] bg-pitch-blue rounded-lg overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 180">
                      <line stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" x1="150" x2="150" y1="0" y2="180"></line>
                      <line stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" x1="68" x2="68" y1="0" y2="180"></line>
                      <line stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" x1="232" x2="232" y1="0" y2="180"></line>
                      <path d="M 0 36 L 12 36 A 54 54 0 0 1 12 144 L 0 144" fill="none" stroke="white" strokeWidth="1.5"></path>
                      <path d="M 300 36 L 288 36 A 54 54 0 0 0 288 144 L 300 144" fill="none" stroke="white" strokeWidth="1.5"></path>
                      <path d="M 0 24 L 12 24 A 66 66 0 0 1 12 156 L 0 156" fill="none" stroke="rgba(255,255,255,0.6)" strokeDasharray="4,4" strokeWidth="1.5"></path>
                      <path d="M 300 24 L 288 24 A 66 66 0 0 0 288 156 L 300 156" fill="none" stroke="rgba(255,255,255,0.6)" strokeDasharray="4,4" strokeWidth="1.5"></path>
                      <circle cx="45" cy="90" fill="white" r="1.8"></circle>
                      <circle cx="255" cy="90" fill="white" r="1.8"></circle>
                      <rect fill="none" height="12" stroke="white" strokeWidth="2" width="6" x="-4" y="84"></rect>
                      <rect fill="none" height="12" stroke="white" strokeWidth="2" width="6" x="298" y="84"></rect>
                      <circle cx="0" cy="0" fill="none" r="2" stroke="white" strokeWidth="1"></circle>
                      <circle cx="0" cy="180" fill="none" r="2" stroke="white" strokeWidth="1"></circle>
                      <circle cx="300" cy="0" fill="none" r="2" stroke="white" strokeWidth="1"></circle>
                      <circle cx="300" cy="180" fill="none" r="2" stroke="white" strokeWidth="1"></circle>
                    </svg>
                    <div className="absolute top-[40%] left-[75%] size-4 bg-brand-purple rounded-full shadow-[0_0_0_4px_rgba(99,102,241,0.3)] border-2 border-white transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-3 w-1.5 h-6 bg-white border border-gray-200 shadow-sm rounded-r transform -translate-y-1/2 z-20 hidden sm:block"></div>
                <div className="absolute top-1/2 right-3 w-1.5 h-6 bg-white border border-gray-200 shadow-sm rounded-l transform -translate-y-1/2 z-20 hidden sm:block"></div>
                <div className="text-center mt-2">
                  <span className="text-[10px] text-text-sub dark:text-slate-400 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-3 py-1 rounded-full font-medium shadow-sm">Pitch Location</span>
                </div>
              </div>

              {/* Mobile Spacer for controls below */}
              <div className="lg:hidden h-px w-full"></div>
           </div>

           {/* Mobile Controls Section (Rendered here to scroll with page on mobile) */}
           <div className="lg:hidden p-4 pb-32 flex flex-col gap-5">
              <CategoryTabs
                selectedIndex={selectedCategoryIndex}
                onSelect={setSelectedCategoryIndex}
                eventCounts={eventCountsByCategory}
              />
              <MetricItemGrid
                category={currentCategory}
                categoryIndex={selectedCategoryIndex}
                selectedTeam={selectedTeam}
                onRecordEvent={recordEvent}
                onTeamChange={setSelectedTeam}
              />
              <EventHistory
                events={state.events}
                onUndo={undoLastEvent}
              />
           </div>
        </div>

        {/* Right Panel: Controls & Sidebar (Desktop) */}
        <div className="hidden lg:flex w-[400px] xl:w-[480px] bg-white dark:bg-surface-dark border-l border-gray-200 dark:border-border-dark flex-col shadow-xl z-20">
           <div className="flex-1 overflow-y-auto p-6">
              <CategoryTabs
                selectedIndex={selectedCategoryIndex}
                onSelect={setSelectedCategoryIndex}
                eventCounts={eventCountsByCategory}
              />
              <div className="mt-6">
                <MetricItemGrid
                  category={currentCategory}
                  categoryIndex={selectedCategoryIndex}
                  selectedTeam={selectedTeam}
                  onRecordEvent={recordEvent}
                  onTeamChange={setSelectedTeam}
                />
              </div>
              <div className="mt-8">
                 <EventHistory
                   events={state.events}
                   onUndo={undoLastEvent}
                 />
              </div>
           </div>

           {/* Desktop Footer */}
           <div className="p-4 border-t border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark">
              <div className="max-w-md lg:max-w-none mx-auto grid grid-cols-[1fr_auto] gap-3">
                <button
                  onClick={state.isRunning ? pauseTimer : startTimer}
                  className="flex-1 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 rounded-xl h-12 flex items-center justify-center gap-2 font-bold text-base active:scale-95 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-2xl">
                    {state.isRunning ? 'pause' : 'play_arrow'}
                  </span>
                  {state.isRunning ? 'Pause Match' : 'Resume Match'}
                </button>
                <button
                  className="px-6 bg-slate-800 dark:bg-brand-purple hover:bg-slate-900 dark:hover:bg-brand-purple/90 text-white rounded-xl h-12 flex items-center justify-center font-bold text-base active:scale-95 transition-all shadow-md"
                  onClick={() => onNavigate('home')}
                >
                  Finish
                </button>
              </div>
           </div>
        </div>

        {/* Mobile Footer (Fixed) */}
        <div className="lg:hidden absolute bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-border-dark p-4 z-40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
           <div className="max-w-md lg:max-w-none mx-auto grid grid-cols-[1fr_auto] gap-3">
             <button
               onClick={state.isRunning ? pauseTimer : startTimer}
               className="flex-1 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 rounded-xl h-12 flex items-center justify-center gap-2 font-bold text-base active:scale-95 transition-all shadow-sm"
             >
               <span className="material-symbols-outlined text-2xl">
                 {state.isRunning ? 'pause' : 'play_arrow'}
               </span>
               {state.isRunning ? 'Pause Match' : 'Resume Match'}
             </button>
             <button
               className="px-6 bg-slate-800 dark:bg-brand-purple hover:bg-slate-900 dark:hover:bg-brand-purple/90 text-white rounded-xl h-12 flex items-center justify-center font-bold text-base active:scale-95 transition-all shadow-md"
               onClick={() => onNavigate('home')}
             >
               Finish
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] All static mock data removed (old ControlsSection, HistoryList, ActionFooter)
- [ ] State managed via `useMatchRecording` hook
- [ ] Category tabs render all 11 categories
- [ ] Sub-item grid shows items for selected category
- [ ] Event recording works end-to-end
- [ ] Scoreboard reflects `state.homeScore` and `state.awayScore` (recorded goals)
- [ ] Timer runs when match is active, updates via `formatTime(state.matchTimeSeconds)`
- [ ] Timer can be paused/resumed via footer buttons
- [ ] Existing pitch visualization preserved unchanged
- [ ] Header shows team names from state
- [ ] Live/Paused indicator in header reflects `state.isRunning`

---

## Component Architecture

```
LiveAnalysis.tsx
├── Header (breadcrumb, back button, live/paused indicator)
├── Layout Container (responsive flex)
│   ├── Left Panel (pitch + scoreboard)
│   │   ├── Scoreboard (dynamic from state.homeScore, state.awayScore)
│   │   └── Pitch Visual (existing SVG - unchanged)
│   │
│   └── Right Panel / Mobile Section (controls)
│       ├── CategoryTabs (horizontal scroll - 11 categories)
│       ├── MetricItemGrid (selected category items + team selector)
│       └── EventHistory (recent events + undo)
│
└── Footer (pause/resume + finish buttons - connected to state)
```

**New Files:**
- `hooks/useMatchRecording.ts` - State management hook (directory must be created)
- `components/CategoryTabs.tsx` - Horizontal category navigation
- `components/MetricItemGrid.tsx` - Metric item buttons
- `components/EventHistory.tsx` - Event list with undo

**Modified Files:**
- `types.ts` - Add `RecordedEvent`, `MatchRecordingState` interfaces
- `constants.ts` - Add `CATEGORY_ICONS`, `CATEGORY_COLORS` mappings (11 entries each)
- `components/LiveAnalysis.tsx` - Complete rewrite to use new components/hook

---

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                    MatchRecordingState                   │
├─────────────────────────────────────────────────────────┤
│  matchId: string                                        │
│  homeTeam: Team                                         │
│  awayTeam: Team                                         │
│  homeScore: number (auto-updated on goals)              │
│  awayScore: number (auto-updated on goals)              │
│  currentQuarter: 1-4                                    │
│  matchTimeSeconds: number (running timer)               │
│  isRunning: boolean                                     │
│  events: RecordedEvent[] (newest first)                 │
├─────────────────────────────────────────────────────────┤
│  UI State (in hook):                                    │
│  - selectedCategoryIndex: number                        │
│  - selectedTeam: 'home' | 'away'                        │
└─────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. User taps category tab -> `setSelectedCategoryIndex(index)`
2. User taps team selector -> `setSelectedTeam(team)`
3. User taps metric item -> `recordEvent(categoryIndex, itemIndex)`
4. Event created with timestamp, category, item, team
5. If goal event -> score auto-increments (in same setState call to avoid race condition)
6. Event prepended to `state.events`
7. `EventHistory` re-renders with new event at top
8. User taps "Undo Last" -> `undoLastEvent()` removes event (reverts score if goal)

---

## UI/UX Design Details

### Mobile-First Considerations
- **Category Tabs**: Horizontal scroll with momentum, auto-centers selected tab
- **Touch Targets**: Minimum 44x44px for all buttons (WCAG)
- **One-Handed Use**: Key actions reachable with thumb (bottom 60% of screen)
- **Visual Feedback**: Active states, pulse animations for latest event
- **No Hover States Relied Upon**: All interactions work on touch

### Layout Breakpoints
| Breakpoint | Layout |
|------------|--------|
| < 1024px (mobile/tablet) | Single column, controls below pitch |
| >= 1024px (lg, desktop) | Two columns, controls in sidebar |

### Interaction Patterns
1. **Quick Record**: Category Tab -> Item Button (2 taps)
2. **Team Switch**: Toggle before recording (persists until changed)
3. **Undo**: Single tap removes last event
4. **Pause**: Footer button toggles timer

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Too many categories to navigate quickly | HIGH - Slows recording | Horizontal scroll with momentum + favorites (future) |
| Accidental taps record wrong events | MEDIUM | Undo button always visible, visual confirmation |
| Performance with many events | LOW | Limit displayed events, use virtual list (future) |
| Loss of data on navigation | HIGH | Warn user before leaving, add persistence (future) |
| Dark mode styling inconsistencies | LOW | Test all components in both modes |
| Touch target too small on mobile | HIGH | Enforce min 44px height, test on real devices |

---

## Verification Steps

### Manual Testing Checklist
- [ ] All 11 category tabs are visible and scrollable
- [ ] Selecting each category shows correct sub-items
- [ ] Tapping any metric item creates an event
- [ ] Events appear in history immediately
- [ ] "Undo Last" removes the most recent event
- [ ] Scoring events (득점 category) update the scoreboard
- [ ] Undo of scoring event decrements the score
- [ ] Team selector works (home/away toggle)
- [ ] Timer runs when match is "running"
- [ ] Timer pauses when "Pause Match" is tapped
- [ ] Layout works on mobile (320px-768px)
- [ ] Layout works on desktop (1024px+)
- [ ] Dark mode styling is correct
- [ ] Back button navigates to home
- [ ] Edge case symbols (Touch, 25Y Entry) display correctly

### Automated Verification (Future)
- TypeScript compilation passes
- No console errors during recording
- All imported components exist

---

## Commit Strategy

### Commit 1: Types and Constants
```
feat(types): add RecordedEvent and MatchRecordingState interfaces

- Add event tracking types to types.ts
- Add CATEGORY_ICONS and CATEGORY_COLORS to constants.ts (11 entries each)
```

### Commit 2: Recording Hook
```
feat(hooks): add useMatchRecording state management hook

- Create hooks/ directory
- Create hooks/useMatchRecording.ts
- Implement event recording with bounds checking
- Implement undo with score reversion
- Use single setState for events+score to avoid race condition
- Handle edge cases in abbreviation extraction (Touch, 25Y Entry, etc.)
```

### Commit 3: Category Tabs
```
feat(components): add CategoryTabs for metric navigation

- Create CategoryTabs.tsx with horizontal scroll
- Display event count badges
- Auto-scroll to selected tab
```

### Commit 4: Metric Item Grid
```
feat(components): add MetricItemGrid for event recording

- Create MetricItemGrid.tsx
- Team selector (home/away)
- Adaptive grid layout
- Touch-optimized buttons
- Handle edge case symbols gracefully
```

### Commit 5: Event History
```
feat(components): add EventHistory with undo support

- Create EventHistory.tsx
- Reverse chronological display
- Undo last event functionality
- Empty state handling
```

### Commit 6: LiveAnalysis Integration
```
refactor(LiveAnalysis): integrate dynamic metric recording

- Use useMatchRecording hook for state
- Replace hardcoded controls with CategoryTabs + MetricItemGrid
- Replace static history with EventHistory
- Connect scoreboard to state.homeScore/state.awayScore
- Connect timer to state.matchTimeSeconds/state.isRunning
- Remove old ControlsSection, HistoryList, ActionFooter sub-components
```

---

## Success Criteria

1. **Functional Completeness**
   - [ ] All 28 metrics across 11 categories are recordable
   - [ ] Events are tracked with timestamp, team, category, item
   - [ ] Undo removes last event and reverts any side effects

2. **User Experience**
   - [ ] Max 2 taps to record any event (category + item)
   - [ ] Responsive on mobile 320px+
   - [ ] No jank/lag during recording

3. **Code Quality**
   - [ ] No hardcoded category/item data in components
   - [ ] State managed in single hook
   - [ ] TypeScript types for all data structures
   - [ ] Bounds checking on indices
   - [ ] Single setState for related updates (no race conditions)

4. **Maintainability**
   - [ ] Adding new metrics to METRIC_DEFINITIONS auto-updates UI
   - [ ] Icon/color mappings are centralized
   - [ ] Edge cases in symbol parsing handled gracefully

---

## File Summary

| File | Action | Lines Changed (Est.) |
|------|--------|---------------------|
| `types.ts` | MODIFY | +25 |
| `constants.ts` | MODIFY | +30 |
| `hooks/` | CREATE DIRECTORY | - |
| `hooks/useMatchRecording.ts` | CREATE | ~180 |
| `components/CategoryTabs.tsx` | CREATE | ~80 |
| `components/MetricItemGrid.tsx` | CREATE | ~110 |
| `components/EventHistory.tsx` | CREATE | ~120 |
| `components/LiveAnalysis.tsx` | REWRITE | ~280 (was 240) |

**Total Estimated Changes:** ~825 lines (7 files, 1 new directory)
