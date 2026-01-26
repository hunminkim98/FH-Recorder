# Live Recording UX Redesign Plan

## Context

### Original Request
실시간 경기 기록의 핵심은 빠른 접근성입니다. 현재 UX는 스크롤을 해야 버튼에 도달할 수 있는 치명적인 문제가 있습니다. 모바일/태블릿/PC를 아우르는 궁극의 반응형 UI/UX를 설계합니다.

### Current State Analysis

**Viewport Budget (Mobile 375x667)**
| Element | Height | Purpose |
|---------|--------|---------|
| Header | 72px | Breadcrumb + Title + Live indicator |
| Footer | 64px | Pause/Resume + Finish buttons |
| **Available** | **531px** | Recording interface |

**CRITICAL: Browser Chrome Consideration**

| Mode | Viewport Available | Status |
|------|-------------------|--------|
| PWA (Standalone) | ~531px | Full viewport available |
| Safari Browser (iOS) | ~423px | Browser chrome takes ~108px |
| Chrome Browser (iOS) | ~410px | URL bar + bottom toolbar |

**Design Target: Browser Mode (MANDATORY)**

This design MUST work in browser mode (Safari/Chrome) because:
1. Most coaches will initially use the app in browser before installing PWA
2. During live games, switching apps or installing PWA is not practical
3. Browser mode is the worst-case scenario - if it works there, PWA works automatically

**Current Problems**
1. Scoreboard takes 120px of prime mobile real estate
2. AccordionRecorder in One-Click mode renders 600-800px of content
3. Users must scroll 200-400px to reach lower category buttons
4. EventHistory adds additional scrollable content
5. Pitch visualization (optional) takes 200px when expanded

**Metric Breakdown (28 Total)**
| Category | Count | Priority |
|----------|-------|----------|
| 슈팅 (Shot) | 3 | HIGH - scoring attempts |
| 패스 (Passing) | 4 | HIGH - key plays |
| 슈팅 기술 (Tech) | 3 | MEDIUM - PC specifics |
| PC (Penalty Corner) | 2 | HIGH - set pieces |
| PS (Penalty Stroke) | 2 | LOW - rare events |
| 드리블 (Dribble) | 3 | MEDIUM |
| 턴오버 (Turnover) | 1 | MEDIUM |
| 수비 | 3 | MEDIUM |
| 골키퍼 (GK) | 1 | LOW - single team |
| 반칙 (Foul) | 3 | LOW - rare events |
| 득점 (Scored) | 3 | HIGH - critical |

---

## Requirements

### Functional Requirements
- FR1: All 28 metrics accessible without vertical scrolling on mobile (375px width)
- FR2: Team toggle (Home/Away) always visible during recording
- FR3: Timer and score visible at all times
- FR4: Undo functionality accessible within 1 tap
- FR5: Event confirmation feedback (visual/haptic)
- FR6: Support for both quick-tap and deliberate-select workflows
- **FR7: MUST work in browser mode (Safari/Chrome) - not just PWA**

### Non-Functional Requirements
- NFR1: Maximum tap-to-record time < 500ms for any metric
- NFR2: Button touch targets minimum 44x44px (Apple HIG)
- NFR3: No accidental recordings - clear hit areas
- NFR4: Works in portrait and landscape orientations
- NFR5: Dark mode support maintained
- NFR6: Offline-first - no network dependency for recording
- **NFR7: Total UI height must fit within 420px worst-case (browser mode on iPhone SE)**

---

## UI/UX Design Decision

### Chosen Approach: **Compact Header with Integrated Team Toggle + Horizontal Category Carousel**

After analyzing the browser chrome constraints, the optimal solution combines:

1. **Compact Integrated Header** - Timer/Score/Team in single 40px row
2. **Horizontal Category Tabs** - Swipeable category selector with CSS snap-scroll (36px)
3. **Compact Metric Grid** - 3x2 or 3x3 grid of current category metrics (~260px for 2 rows)
4. **Fixed Action Bar** - Undo + Pause/Finish (48px + safe area)
5. **Slide-Up Event History** - Optional overlay, hidden by default

### Revised Height Budget (Browser Mode - 420px Available)

```
+------------------------------------------+
| [<] HOME 0-0 AWAY [12:34 Q2] [H|A]      | 40px - Compact Header + Team Toggle
+------------------------------------------+
| < Shot | Pass | Tech | PC | PS | Dri >   | 36px - Horizontal Category Tabs
+------------------------------------------+
|                                          |
|  +--------+  +--------+  +--------+      |
|  |  SoT   |  |  BLK   |  |  OFF   |      |  ~260px - Metric Grid (2-3 rows)
|  | 유효슈팅|  | 블락슈팅|  | 빗나간 |      |  Button height: 80px each
|  +--------+  +--------+  +--------+      |  Row 1: 80px + Row 2: 80px
|                                          |  + gaps: ~100px padding/breathing
|         (3 items in Shot category)       |
|                                          |
+------------------------------------------+
| [Undo ↩] [⏸ Pause]           [Finish]   | 48px - Action Bar
| ~~~~~~~~ safe area ~~~~~~~~              | + env(safe-area-inset-bottom)
+------------------------------------------+

Total: 40 + 36 + 260 + 48 = 384px base
With safe area (34px): 418px < 420px available ✓
```

### Why This Approach?

| Alternative | Rejected Because |
|-------------|------------------|
| All 28 buttons visible | Too small (< 30px) for reliable touch |
| Vertical accordion | Requires scrolling - original problem |
| Floating overlay | Blocks content, confusing UX |
| Gesture-only | High learning curve, error-prone |
| Priority tiers | Still needs 15+ buttons visible |
| Separate team toggle row | Takes 40px we cannot spare in browser mode |

### Design Principles
1. **Category-First Navigation** - User thinks "I need to record a pass" not "I need button #7"
2. **Swipe > Tap for Navigation** - Swipe between categories (CSS snap-scroll), tap to record
3. **Visual Hierarchy** - Score/Timer always top, metrics center, actions bottom
4. **Muscle Memory** - Consistent positions across all screen sizes

### Category Carousel Implementation Decision

**Chosen: CSS Snap-Scroll** (vs Custom Touch Handler)

| Approach | Pros | Cons |
|----------|------|------|
| CSS Snap-Scroll | Native smooth scrolling, zero JS, browser-optimized | Less control over momentum |
| Custom Touch Handler | Full control, custom easing | More code, potential jank, re-inventing wheel |

CSS snap-scroll is the better choice because:
1. Native performance on mobile browsers
2. Respects user's reduce-motion preferences
3. Works with keyboard/mouse on desktop
4. Zero JS bundle impact

Implementation:
```css
.category-tabs {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.category-tab {
  scroll-snap-align: center;
}
```

---

## Screen-by-Screen Layouts

### Mobile Layout (375px width) - Browser Mode Optimized

```
+------------------------------------------+
| [<] HOME 0-0 AWAY [12:34 Q2] [H|A]       | 40px - Compact Header
+------------------------------------------+
| < Shot | Pass | Tech | PC | PS | Dri >   | 36px - Horizontal Category Tabs
+------------------------------------------+
|                                          |
|  +--------+  +--------+  +--------+      |
|  |  SoT   |  |  BLK   |  |  OFF   |      |
|  | 유효슈팅|  | 블락슈팅|  | 빗나간 |      |  ~260px - Metric Grid
|  |   3    |  |   1    |  |   2    |      |  (2-3 rows depending on category)
|  +--------+  +--------+  +--------+      |
|                                          |
+------------------------------------------+
| [↩ Undo: SoT] [⏸ Pause]      [Finish]   | 48px - Action Bar
|          ~~~ safe area padding ~~~       | + safe-area-inset-bottom
+------------------------------------------+

Total: 40 + 36 + 260 + 48 = 384px
With 34px safe area: 418px < 420px ✓
```

### Metric Button Design (Mobile - Compact)
```
+------------------+
|       SoT        |  <- Abbreviation (14px bold)
|     유효 슈팅     |  <- Korean name (10px)
|      [3]         |  <- Count badge (if > 0)
+------------------+
Size: fluid width (3 columns with 6px gaps), 80px fixed height
Touch target: entire button area (min 44x44px guaranteed)
```

### Button Size Clarification

| Dimension | Value | Notes |
|-----------|-------|-------|
| **Width** | Fluid (calc((100% - 12px) / 3)) | 3 columns with 6px gaps = ~115px on 375px screen |
| **Height** | 80px fixed | Minimum touch target, fits Korean text |
| **Touch Target** | 115px x 80px | Exceeds Apple HIG 44x44px requirement |

### Tablet Layout (768px width)

```
+----------------------------------------------------------------+
| [<] HOME vs AWAY          [12:34] Q2 LIVE         [Team] [|||] | 56px
+----------------------------------------------------------------+
|                              |                                  |
| +---------------------------+|  +------------------------------+|
| | < Shot | Pass | Tech | >  ||  | Event History                ||
| +---------------------------+|  |------------------------------|
| |                           ||  | 12:34 Q2 SoT HOME            ||
| | +------+ +------+ +------+||  | 12:30 Q2 AST HOME            ||
| | | SoT  | | BLK  | | OFF  |||  | 12:25 Q2 25Y AWAY            ||
| | +------+ +------+ +------+||  +------------------------------+|
| |                           ||                                  |
| | +------+ +------+ +------+||  +------------------------------+|
| | | AST  | | SCP  | | 25Y  |||  |                              ||
| | +------+ +------+ +------+||  |        PITCH VIEW            ||
| |                           ||  |        (optional)            ||
| +---------------------------+|  +------------------------------+|
|                              |                                  |
+----------------------------------------------------------------+
| [↩ Undo]                    [⏸ Pause]              [Finish]   | 64px
+----------------------------------------------------------------+
```

### Desktop Layout (1280px+)

```
+--------------------------------------------------------------------------------+
| [<] HOME vs AWAY                    [12:34] Q2 LIVE              [Settings]   | 64px
+--------------------------------------------------------------------------------+
|                                            |                                   |
| +----------------------------------------+ | +--------------------------------+|
| |  [HOME Team]  =========  [AWAY Team]   | | |        Scoreboard              ||
| +----------------------------------------+ | |   HOME  0 - 0  AWAY            ||
| |                                        | | +--------------------------------+|
| | Shot    Pass    Tech    PC    PS   ... | |                                  ||
| |========================================| | +--------------------------------+|
| |                                        | | |                                ||
| | +------+ +------+ +------+ +------+    | | |         PITCH VIEW             ||
| | | SoT  | | BLK  | | OFF  | | AST  |    | | |                                ||
| | +------+ +------+ +------+ +------+    | | +--------------------------------+|
| |                                        | |                                  ||
| | +------+ +------+ +------+ +------+    | | +--------------------------------+|
| | | SCP  | | 25Y  | | CE   | | P    |    | | |      Event History             ||
| | +------+ +------+ +------+ +------+    | | |  (scrollable list)             ||
| |                                        | | +--------------------------------+|
| +----------------------------------------+ |                                   |
|                                            |                                   |
+--------------------------------------------------------------------------------+
| [↩ Undo Last: SoT at 12:30]          [⏸ Pause Match]           [Finish]      | 72px
+--------------------------------------------------------------------------------+
```

---

## Component Architecture

### New Component Structure

```
components/
├── LiveAnalysis.tsx              # REFACTOR - Layout orchestrator only
├── recording/
│   ├── RecordingHeader.tsx       # NEW - Compact timer/score/team toggle integrated
│   ├── CategoryTabs.tsx          # NEW - Horizontal scrollable tabs with CSS snap
│   ├── MetricGrid.tsx            # NEW - Responsive metric button grid
│   ├── MetricButton.tsx          # NEW - Individual metric button
│   ├── ActionBar.tsx             # NEW - Undo/Pause/Finish with safe area
│   └── EventHistoryDrawer.tsx    # NEW - Slide-up drawer (optional)
├── AccordionRecorder.tsx         # DEPRECATE - Replace with new components
└── EventHistory.tsx              # KEEP - Reuse in drawer
```

### State Management Updates

The `useMatchRecording` hook already exports `selectedCategoryIndex` and `setSelectedCategoryIndex` (verified in `hooks/useMatchRecording.ts` lines 23, 171-172).

```typescript
// Current hook return (already implemented):
return {
  state,
  selectedCategoryIndex,      // ← Already exists (line 171)
  setSelectedCategoryIndex,   // ← Already exists (line 172)
  selectedTeam,
  setSelectedTeam,
  currentCategory,
  eventCountsByCategory,
  recordEvent,
  undoLastEvent,
  // ...
};

// LiveAnalysis.tsx needs to destructure these (currently missing):
const {
  state,
  selectedCategoryIndex,      // ← ADD THIS
  setSelectedCategoryIndex,   // ← ADD THIS
  selectedTeam,
  setSelectedTeam,
  eventCountsByCategory,
  recordEvent,
  undoLastEvent,
  formatTime,
  startTimer,
  pauseTimer,
  incrementTime,
} = useMatchRecording();
```

---

## Component Changes

### 1. LiveAnalysis.tsx (REFACTOR)

**Current:** 324 lines, handles all layout logic
**Target:** ~150 lines, pure layout orchestration

| Line Range | Current | Target |
|------------|---------|--------|
| 11-22 | Missing selectedCategoryIndex | Add destructuring |
| 36-79 | Header with breadcrumb | Extract to RecordingHeader |
| 88-114 | Mobile Scoreboard | Remove - integrate into header |
| 116-159 | Collapsible Pitch | Move to desktop right panel only |
| 166-177 | AccordionRecorder usage | Replace with CategoryTabs + MetricGrid |
| 299-318 | Mobile Footer | Replace with ActionBar |

### 2. NEW: RecordingHeader.tsx

```tsx
interface RecordingHeaderProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  matchTime: string;
  quarter: number;
  isRunning: boolean;
  selectedTeam: 'home' | 'away';
  onTeamSelect: (team: 'home' | 'away') => void;
  onBack: () => void;
}

// Height: 40px mobile (compact), 56px tablet, 64px desktop
// Layout: [Back] [HomeScore - AwayScore] [Time Qn] [H|A toggle]
// Team toggle integrated to save vertical space
```

### 3. NEW: CategoryTabs.tsx

```tsx
interface CategoryTabsProps {
  categories: MetricCategory[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  eventCounts: Record<number, number>;
}

// CSS snap-scroll implementation for native smooth swiping
// Height: 36px mobile, 44px tablet+
// Shows category name + count badge
```

**CSS Snap-Scroll Implementation:**
```css
/* Tailwind classes */
.category-tabs-container {
  @apply overflow-x-auto;
  @apply snap-x snap-mandatory;
  @apply [-webkit-overflow-scrolling:touch];
  @apply scrollbar-hide;
}

.category-tab {
  @apply snap-center;
  @apply shrink-0;
}
```

### 4. NEW: MetricGrid.tsx

```tsx
interface MetricGridProps {
  category: MetricCategory;
  categoryIndex: number;
  onRecord: (categoryIndex: number, itemIndex: number) => void;
}

// Responsive grid: 3 cols mobile, 4 cols tablet, 5+ cols desktop
// Button height: 80px mobile (fixed), 72px desktop
// Button width: fluid (fills available space)
```

### 5. NEW: MetricButton.tsx

```tsx
interface MetricButtonProps {
  abbreviation: string;
  name: string;
  count?: number;
  onPress: () => void;
}

// Touch target: fluid width x 80px height (mobile)
// Visual feedback: scale + color on press
// Haptic feedback: navigator.vibrate(10) on success
```

### 6. NEW: ActionBar.tsx

```tsx
interface ActionBarProps {
  lastEvent?: RecordedEvent;
  onUndo: () => void;
  isRunning: boolean;
  onToggleTimer: () => void;
  onFinish: () => void;
}

// Fixed to bottom with SAFE AREA support
// Height: 48px content + safe-area-inset-bottom
```

**Safe Area Implementation (CRITICAL):**
```tsx
// ActionBar.tsx
<div
  className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t z-40"
  style={{
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))'
  }}
>
  <div className="h-12 px-4 flex items-center gap-3">
    {/* Undo, Pause, Finish buttons */}
  </div>
</div>
```

**Alternative Tailwind Approach (if using Tailwind 3.3+):**
```tsx
<div className="fixed bottom-0 inset-x-0 bg-white dark:bg-surface-dark border-t z-40 pb-[max(16px,env(safe-area-inset-bottom))]">
```

### 7. AccordionRecorder.tsx (DEPRECATE)

- Mark as deprecated with comment
- Keep for reference during migration
- Remove after MetricGrid is stable

---

## Detailed Implementation Tasks

### Phase 1: Foundation (Est. 2-3 hours)

#### Task 1.1: Create Component Directory Structure
```bash
mkdir -p components/recording
```
- **Files:** N/A (directory creation)
- **Acceptance:** Directory exists at `components/recording/`

#### Task 1.2: Create RecordingHeader Component
- **File:** `components/recording/RecordingHeader.tsx`
- **Lines:** New file, ~100 lines
- **Dependencies:** None
- **Acceptance:**
  - [ ] Renders timer in MM:SS format
  - [ ] Shows score as "HOME 0-0 AWAY" format inline
  - [ ] Shows quarter badge with running/paused state
  - [ ] Team toggle (H|A pill) integrated in header row
  - [ ] Back button triggers onBack
  - [ ] Live indicator pulses when running
  - [ ] **Height exactly 40px on mobile (browser mode compatible)**

#### Task 1.3: Create CategoryTabs Component
- **File:** `components/recording/CategoryTabs.tsx`
- **Lines:** New file, ~80 lines
- **Dependencies:** `constants.ts` (METRIC_DEFINITIONS)
- **Acceptance:**
  - [ ] Horizontal scroll with CSS snap-scroll (`scroll-snap-type: x mandatory`)
  - [ ] `-webkit-overflow-scrolling: touch` for iOS momentum
  - [ ] Shows all 11 categories
  - [ ] Active tab highlighted with visual indicator
  - [ ] Event count badges on tabs (if count > 0)
  - [ ] Swipe/drag navigation works natively via CSS
  - [ ] **Height exactly 36px on mobile**

### Phase 2: Core Recording (Est. 3-4 hours)

#### Task 2.1: Create MetricButton Component
- **File:** `components/recording/MetricButton.tsx`
- **Lines:** New file, ~60 lines
- **Dependencies:** None
- **Acceptance:**
  - [ ] Displays abbreviation prominently (14px bold)
  - [ ] Korean name below (10px)
  - [ ] Count badge (top-right) when count > 0
  - [ ] Press animation (scale 0.95)
  - [ ] Active state ring
  - [ ] **Height: 80px fixed on mobile**
  - [ ] **Width: fluid (grid-based)**
  - [ ] Haptic feedback on press (if supported)

#### Task 2.2: Create MetricGrid Component
- **File:** `components/recording/MetricGrid.tsx`
- **Lines:** New file, ~80 lines
- **Dependencies:** MetricButton, constants.ts
- **Acceptance:**
  - [ ] 3-column grid on mobile (< 640px)
  - [ ] 4-column grid on tablet (640-1024px)
  - [ ] 5-column grid on desktop (> 1024px)
  - [ ] Renders current category's items only
  - [ ] Gap: 6px mobile, 12px tablet+
  - [ ] **Button width: fluid (calc-based for 3 columns)**
  - [ ] **Button height: 80px fixed minimum**
  - [ ] Centers grid when items < columns

#### Task 2.3: Create ActionBar Component
- **File:** `components/recording/ActionBar.tsx`
- **Lines:** New file, ~90 lines
- **Dependencies:** None
- **Acceptance:**
  - [ ] Fixed position bottom
  - [ ] Undo button shows last event info (abbreviated)
  - [ ] Pause/Resume toggle with icon change
  - [ ] Finish button (secondary action)
  - [ ] **Safe area padding: `padding-bottom: max(16px, env(safe-area-inset-bottom))`**
  - [ ] **Content height: 48px**
  - [ ] Works on iPhone X+ devices (notch/home indicator)

### Phase 3: Integration (Est. 2-3 hours)

#### Task 3.1: Refactor LiveAnalysis Mobile Layout
- **File:** `components/LiveAnalysis.tsx`
- **Lines:** 11-22, 82-178 (mobile section)
- **Dependencies:** All new components
- **Changes:**
  ```diff
  // Line 11-22: Add missing state destructuring
  const {
    state,
  + selectedCategoryIndex,
  + setSelectedCategoryIndex,
    selectedTeam,
    setSelectedTeam,
    eventCountsByCategory,
    recordEvent,
    undoLastEvent,
    formatTime,
    startTimer,
    pauseTimer,
    incrementTime,
  } = useMatchRecording();

  // Line 82-178: Replace mobile layout
  - {/* MOBILE ONLY: Vertical layout */}
  - <div className="lg:hidden flex-1 overflow-y-auto ...">
  + {/* MOBILE: Fixed layout, no scroll - browser mode compatible */}
  + <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
  +   <RecordingHeader
  +     homeTeam={state.homeTeam.name}
  +     awayTeam={state.awayTeam.name}
  +     homeScore={state.homeScore}
  +     awayScore={state.awayScore}
  +     matchTime={formatTime(state.matchTimeSeconds)}
  +     quarter={state.currentQuarter}
  +     isRunning={state.isRunning}
  +     selectedTeam={selectedTeam}
  +     onTeamSelect={setSelectedTeam}
  +     onBack={() => onNavigate('home')}
  +   />
  +   <CategoryTabs
  +     categories={METRIC_DEFINITIONS}
  +     selectedIndex={selectedCategoryIndex}
  +     onSelect={setSelectedCategoryIndex}
  +     eventCounts={eventCountsByCategory}
  +   />
  +   <MetricGrid
  +     category={METRIC_DEFINITIONS[selectedCategoryIndex]}
  +     categoryIndex={selectedCategoryIndex}
  +     onRecord={recordEvent}
  +   />
  +   <ActionBar
  +     lastEvent={state.events[0]}
  +     onUndo={undoLastEvent}
  +     isRunning={state.isRunning}
  +     onToggleTimer={state.isRunning ? pauseTimer : startTimer}
  +     onFinish={() => onNavigate('home')}
  +   />
  ```
- **Acceptance:**
  - [ ] No vertical scroll needed for recording
  - [ ] All 28 metrics accessible via category tabs
  - [ ] Team toggle visible at all times (in header)
  - [ ] Timer/score visible at all times
  - [ ] Undo accessible with one tap
  - [ ] **Total height fits within 420px (browser mode on iPhone SE)**
  - [ ] **selectedCategoryIndex properly wired from hook to components**

#### Task 3.2: Refactor LiveAnalysis Tablet/Desktop Layout
- **File:** `components/LiveAnalysis.tsx`
- **Lines:** 180-297 (desktop section)
- **Dependencies:** All new components
- **Acceptance:**
  - [ ] Left panel: Recording controls (flex-1)
  - [ ] Right panel: Scoreboard + Pitch + History
  - [ ] EventHistory visible inline on desktop
  - [ ] All functionality preserved

#### Task 3.3: Create Index Export
- **File:** `components/recording/index.ts`
- **Lines:** New file, ~10 lines
- **Acceptance:**
  - [ ] Exports all recording components
  - [ ] Single import point for LiveAnalysis

### Phase 4: Polish (Est. 1-2 hours)

#### Task 4.1: Add EventHistoryDrawer
- **File:** `components/recording/EventHistoryDrawer.tsx`
- **Lines:** New file, ~80 lines
- **Dependencies:** EventHistory.tsx
- **Acceptance:**
  - [ ] Slide-up from bottom
  - [ ] Backdrop overlay
  - [ ] Swipe down to close
  - [ ] Uses existing EventHistory component

#### Task 4.2: Add Keyboard Shortcuts (Desktop)
- **File:** `components/LiveAnalysis.tsx`
- **Lines:** Add useEffect hook
- **Acceptance:**
  - [ ] 1-9 keys select category
  - [ ] A-Z keys record metrics in current category
  - [ ] Space toggles timer
  - [ ] Ctrl+Z undoes last event

### Phase 5: Cleanup (Est. 1 hour)

#### Task 5.1: Deprecate AccordionRecorder
- **File:** `components/AccordionRecorder.tsx`
- **Lines:** 1-10 (add deprecation notice)
- **Changes:**
  ```tsx
  /**
   * @deprecated Use recording/CategoryTabs + recording/MetricGrid instead.
   * This component will be removed in v2.0.
   */
  ```
- **Acceptance:**
  - [ ] Deprecation notice added
  - [ ] No references from LiveAnalysis

#### Task 5.2: Update Exports
- **File:** Update any barrel exports
- **Acceptance:**
  - [ ] New components exported
  - [ ] No breaking changes to existing exports

---

## Commit Strategy

| Commit | Scope | Message |
|--------|-------|---------|
| 1 | Foundation | `feat(recording): add RecordingHeader with integrated team toggle (40px)` |
| 2 | Foundation | `feat(recording): add CategoryTabs with CSS snap-scroll (36px)` |
| 3 | Core | `feat(recording): add MetricButton (80px height) and MetricGrid` |
| 4 | Core | `feat(recording): add ActionBar with safe-area-inset support` |
| 5 | Integration | `refactor(LiveAnalysis): integrate new recording components, wire state` |
| 6 | Polish | `feat(recording): add EventHistoryDrawer and keyboard shortcuts` |
| 7 | Cleanup | `chore: deprecate AccordionRecorder, update exports` |

---

## Success Criteria

### Must Pass (Blocking)
- [ ] **Mobile Zero-Scroll**: All 28 metrics recordable without scrolling on iPhone SE (375x667) **IN BROWSER MODE**
- [ ] **Browser Mode Compatible**: UI fits within 420px available height (Safari/Chrome on iOS)
- [ ] **Touch Target Size**: All buttons >= 44x44px touch area
- [ ] **Timer Visibility**: Timer visible 100% of recording time
- [ ] **Team Toggle Visible**: Team selection visible 100% of recording time
- [ ] **Undo Accessible**: Undo within 1 tap at any time
- [ ] **Recording Speed**: Tap-to-record < 500ms latency
- [ ] **Safe Area Support**: ActionBar respects safe-area-inset-bottom on iPhone X+

### Should Pass (Quality)
- [ ] **Tablet Layout**: Efficient use of space on 768px+ screens
- [ ] **Desktop Layout**: Event history visible inline
- [ ] **Dark Mode**: Full dark mode support
- [ ] **Haptic Feedback**: Vibration on iOS/Android when recording
- [ ] **Keyboard Shortcuts**: 1-9 for categories, letters for metrics

### Nice to Have (Enhancement)
- [ ] **Gesture Navigation**: CSS snap-scroll for smooth category swiping
- [ ] **Sound Feedback**: Optional click sound on record
- [ ] **Landscape Mode**: Optimized horizontal layout

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Buttons too small on mobile | Medium | High | Use 3-column max, 80px min height, fluid width |
| Category tabs not discoverable | Medium | Medium | Add visual indicator for scroll, animate on first use |
| Undo accidentally triggered | Low | High | Require confirmation for destructive undo |
| Performance on low-end devices | Low | Medium | Use React.memo, avoid re-renders |
| Gesture conflicts with browser | Low | Low | CSS snap-scroll is native, no custom handlers |
| Safe area not working | Medium | High | Test on iPhone X+ devices, use `max()` fallback |
| Browser chrome varies by OS | Medium | Medium | Test on multiple browsers, target 420px worst-case |

---

## Testing Plan

### Manual Testing Checklist

**Mobile (iOS Safari/Chrome - BROWSER MODE REQUIRED)**
- [ ] iPhone SE (375px) - smallest target, **must test in Safari browser (not PWA)**
- [ ] iPhone 14 Pro (390px)
- [ ] iPhone 14 Pro Max (428px)

**Mobile (PWA Mode - Secondary)**
- [ ] iPhone SE PWA mode
- [ ] iPhone 14 Pro PWA mode

**Tablet (Safari, Chrome)**
- [ ] iPad Mini (768px)
- [ ] iPad Pro 11" (834px)
- [ ] iPad Pro 12.9" (1024px)

**Desktop (Chrome, Safari, Firefox)**
- [ ] 1280px (minimum)
- [ ] 1920px (common)
- [ ] 2560px+ (large)

### Functional Test Cases

| Test | Steps | Expected |
|------|-------|----------|
| Record event | Tap category > Tap metric | Event added to history |
| Switch team | Tap H/A toggle in header | Events recorded as selected team |
| Undo event | Tap Undo button | Last event removed, score reverted if goal |
| Pause timer | Tap Pause | Timer stops, Live indicator changes |
| Category navigation | Swipe left on tabs | Next category shown (snap scroll) |
| Safe area | Test on iPhone X+ | ActionBar has proper bottom padding |
| Browser mode fit | iPhone SE in Safari | All UI visible without scrolling |

---

## Appendix: Metric Button Mapping

For keyboard shortcuts and quick reference:

| Key | Category | Metrics |
|-----|----------|---------|
| 1 | 슈팅 | S=SoT, B=BLK, O=OFF |
| 2 | 패스 | A=AST, C=SCP, 2=25Y, E=CE |
| 3 | 슈팅기술 | P=Push, H=Hit, T=Touch |
| 4 | PC | C=PCA, M=PCM |
| 5 | PS | S=PS, M=PSM |
| 6 | 드리블 | 1=1:1, D=Dribble, F=Forward |
| 7 | 턴오버 | T=TO |
| 8 | 수비 | T=TKL, S=STL, B=BLK |
| 9 | 골키퍼 | S=SV |
| 0 | 반칙 | G=GRC, Y=YLC, R=RDC |
| - | 득점 | F=FGS, C=PCS, S=PSS |

---

## Timeline Estimate

| Phase | Effort | Calendar Time |
|-------|--------|---------------|
| Phase 1: Foundation | 2-3 hours | Day 1 |
| Phase 2: Core Recording | 3-4 hours | Day 1-2 |
| Phase 3: Integration | 2-3 hours | Day 2 |
| Phase 4: Polish | 1-2 hours | Day 2 |
| Phase 5: Cleanup | 1 hour | Day 2 |
| **Total** | **9-13 hours** | **2 days** |

---

## Revision History

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-26 | Initial plan | Created by Prometheus |
| 2026-01-26 | **Revision 1** | Addressed Critic feedback (4 critical issues) |

### Revision 1 Changes (Critic Feedback)

1. **Issue #1 - Browser Chrome**: Redesigned layout to target 420px (browser mode) instead of 531px (PWA). Combined team toggle into header row, reduced all component heights.

2. **Issue #2 - Safe Area Implementation**: Added explicit CSS for ActionBar: `padding-bottom: max(16px, env(safe-area-inset-bottom))` with code examples.

3. **Issue #3 - State Wiring**: Added explicit code showing `selectedCategoryIndex` and `setSelectedCategoryIndex` destructuring in Task 3.1 with diff format.

4. **Issue #4 - Button Size**: Clarified that button WIDTH is fluid (grid-based) while HEIGHT is 80px fixed. Added explicit calculation notes.

### Architect Decision: CSS Snap-Scroll for Carousel

Chose CSS snap-scroll over custom touch handler because:
- Native performance, zero JS
- Browser-optimized momentum scrolling
- Works with keyboard/mouse on desktop
- Respects reduce-motion preferences

---

*Plan generated by Prometheus on 2026-01-26*
*Revised after Critic review on 2026-01-26*
