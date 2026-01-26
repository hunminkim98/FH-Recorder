# Live Recording Quick Buttons - Implementation Plan

## Context

### Original Request
LiveAnalysis 화면에서 경기 기록 버튼들이 경기장 이미지보다 더 중요합니다. 모든 카테고리 버튼을 하나의 화면에서 볼 수 있어야 하고, 카테고리를 클릭하면 해당 카테고리의 세부 항목(메트릭 아이템)이 확장되어 선택할 수 있어야 합니다. 탭 이동 없이 한 화면에서 모든 기록이 가능해야 합니다.

### Current State Analysis
- **11 categories** with **28 total metric items** defined in `constants.ts`
- `CategoryTabs.tsx`: Horizontal scrollable tabs requiring scroll to see all categories
- `MetricItemGrid.tsx`: Shows only ONE category's items at a time
- `LiveAnalysis.tsx`: Contains large pitch visual (lines 119-147) taking significant space
- Current UX: scroll to find category -> tap category -> tap metric item (3+ actions)

### User's Desired UX
1. ALL 11 categories visible at once (no scrolling needed)
2. Click category -> category EXPANDS (accordion) to show sub-items
3. Minimize/remove pitch visual to prioritize buttons
4. Recording flow: tap category -> tap metric item (2 taps max)

---

## Work Objectives

### Core Objective
Replace the current CategoryTabs + MetricItemGrid pattern with a single AccordionRecorder component that displays all 11 categories in a compact grid, with accordion-style expansion for metric items.

### Deliverables
1. **New Component**: `AccordionRecorder.tsx` - Accordion-based category/metric selector
2. **Modified Component**: `LiveAnalysis.tsx` - Integrate AccordionRecorder, minimize pitch visual
3. **Removed Dependencies**: `CategoryTabs.tsx` no longer used in LiveAnalysis

### Definition of Done
- [ ] All 11 categories visible on screen without scrolling
- [ ] Tapping a category expands its metric items inline
- [ ] Tapping another category collapses previous and expands new (single-expand mode)
- [ ] Metric items can be tapped to record events
- [ ] Pitch visual is minimized/collapsible (not removed, but secondary)
- [ ] Works on both mobile and desktop viewports
- [ ] Team selector remains accessible
- [ ] Event counts still display on categories

---

## Guardrails

### Must Have
- All 11 categories visible without horizontal scrolling
- Accordion expansion/collapse behavior
- Touch-friendly button sizes (min 44px tap target)
- Event recording still works via `recordEvent(categoryIndex, itemIndex)`
- Team selection (Home/Away) before recording
- Dark mode support maintained

### Must NOT Have
- Breaking changes to `useMatchRecording.ts` hook API
- Removal of EventHistory component
- Changes to `constants.ts` data structure
- Removal of pitch visual entirely (keep it, but smaller/collapsible)

---

## Task Flow and Dependencies

```
Task 1: Create AccordionRecorder component
    |
    v
Task 2: Integrate AccordionRecorder into LiveAnalysis
    |
    v
Task 3: Adjust pitch visual layout (minimize/collapse)
    |
    v
Task 4: Responsive polish (mobile + desktop)
    |
    v
Task 5: Testing and verification
```

---

## Detailed TODOs

### Task 1: Create AccordionRecorder Component
**File**: `c:\Users\BB1\Desktop\FH-Recorder\components\AccordionRecorder.tsx` (NEW)
**Complexity**: Medium
**Estimated Lines**: ~180

#### Implementation Details

```typescript
interface AccordionRecorderProps {
  selectedTeam: 'home' | 'away';
  onRecordEvent: (categoryIndex: number, itemIndex: number) => void;
  onTeamChange: (team: 'home' | 'away') => void;
  eventCounts?: Record<number, number>;
}
```

**Layout Structure**:
```
+--------------------------------------------------+
| [Home] [Away]  <- Team Toggle (sticky top)        |
+--------------------------------------------------+
| Category Grid (3-4 columns on mobile, 4-5 on desktop)
|                                                   |
| [슈팅 3] [패스 2] [Tech 0] [PC 1]                   |
| [PS 0]  [드리블 0] [턴오버 1] [수비 0]               |
| [GK 0]  [반칙 0]  [득점 2]                          |
|                                                   |
+--------------------------------------------------+
| Expanded Section (when category tapped):          |
| +------+ +------+ +------+                        |
| | SoT  | | BLK  | | OFF  |  <- Metric buttons    |
| | 유효  | | 블락  | | 빗나간 |                      |
| +------+ +------+ +------+                        |
+--------------------------------------------------+
```

**Key Features**:
1. Category Grid: Use CSS Grid `grid-cols-4` on mobile, `grid-cols-5` on desktop
2. Each category button shows: icon + short name + event count badge
3. `expandedCategory` state controls which category (if any) is expanded
4. Expanded section slides in below the grid (or replaces part of grid)
5. Metric item buttons styled for quick tapping

**Acceptance Criteria**:
- [ ] Component renders all 11 categories in grid layout
- [ ] Clicking category toggles expansion state
- [ ] Only one category expanded at a time
- [ ] Expanded category shows metric item buttons
- [ ] Clicking metric button calls `onRecordEvent` with correct indices
- [ ] Event count badges show on categories
- [ ] Team toggle works correctly

---

### Task 2: Integrate AccordionRecorder into LiveAnalysis
**File**: `c:\Users\BB1\Desktop\FH-Recorder\components\LiveAnalysis.tsx`
**Lines to Modify**: 2-5 (imports), 154-170 (mobile controls), 176-196 (desktop controls)

#### Changes Required

**Imports** (lines 2-5):
```typescript
// REMOVE:
import { CategoryTabs } from './CategoryTabs';
import { MetricItemGrid } from './MetricItemGrid';

// ADD:
import { AccordionRecorder } from './AccordionRecorder';
```

**Mobile Controls Section** (lines 154-170):
Replace `CategoryTabs` + `MetricItemGrid` with `AccordionRecorder`:
```typescript
<div className="lg:hidden p-4 pb-32 flex flex-col gap-5">
  <AccordionRecorder
    selectedTeam={selectedTeam}
    onRecordEvent={recordEvent}
    onTeamChange={setSelectedTeam}
    eventCounts={eventCountsByCategory}
  />
  <EventHistory
    events={state.events}
    onUndo={undoLastEvent}
  />
</div>
```

**Desktop Controls Section** (lines 176-196):
```typescript
<div className="flex-1 overflow-y-auto p-6">
  <AccordionRecorder
    selectedTeam={selectedTeam}
    onRecordEvent={recordEvent}
    onTeamChange={setSelectedTeam}
    eventCounts={eventCountsByCategory}
  />
  <div className="mt-8">
    <EventHistory
      events={state.events}
      onUndo={undoLastEvent}
    />
  </div>
</div>
```

**Hook Cleanup**:
- Remove: `selectedCategoryIndex`, `setSelectedCategoryIndex`, `currentCategory` from destructured hook values (lines 14, 15, 18)
- These are no longer needed since AccordionRecorder manages its own expansion state

**Acceptance Criteria**:
- [ ] AccordionRecorder replaces CategoryTabs + MetricItemGrid
- [ ] Event recording still works end-to-end
- [ ] No console errors or warnings
- [ ] Scoreboard and timer still functional

---

### Task 3: Minimize Pitch Visual
**File**: `c:\Users\BB1\Desktop\FH-Recorder\components\LiveAnalysis.tsx`
**Lines to Modify**: 86-151 (pitch visual section)

#### Implementation Options

**Option A (Recommended): Collapsible Pitch**
Add a collapse/expand toggle for the pitch visual:
- Default: collapsed (showing small thumbnail or just label)
- User can expand if needed
- Saves significant vertical space on mobile

**Option B: Smaller Pitch**
Reduce `max-w-md lg:max-w-5xl` to `max-w-xs lg:max-w-lg` and reduce aspect ratio

**Implementation (Option A)**:
```typescript
const [isPitchExpanded, setIsPitchExpanded] = useState(false);

// In JSX:
<div className="...">
  {/* Collapsible Pitch Header */}
  <button
    onClick={() => setIsPitchExpanded(!isPitchExpanded)}
    className="flex items-center gap-2 text-sm text-text-sub"
  >
    <span className="material-symbols-outlined">
      {isPitchExpanded ? 'expand_less' : 'expand_more'}
    </span>
    <span>Pitch View</span>
  </button>

  {/* Pitch (conditionally rendered) */}
  {isPitchExpanded && (
    <div className="w-full max-w-xs ...">
      {/* existing pitch SVG */}
    </div>
  )}
</div>
```

**Alternative: Move Pitch to Modal/Drawer**
On mobile, pitch could be in a slide-up drawer triggered by a floating button.

**Acceptance Criteria**:
- [ ] Pitch visual is not the primary element
- [ ] Recording buttons have more screen real estate
- [ ] Pitch can still be viewed when needed
- [ ] Scoreboard remains prominent

---

### Task 4: Responsive Polish
**File**: `c:\Users\BB1\Desktop\FH-Recorder\components\AccordionRecorder.tsx`

#### Mobile Considerations
- Category buttons: `grid-cols-4` with compact sizing
- Metric buttons: `grid-cols-2` or `grid-cols-3`
- Touch targets: minimum 44x44px
- Expanded section: slides in smoothly (CSS transition)

#### Desktop Considerations
- Category buttons: `grid-cols-5` or `grid-cols-6`
- More horizontal space for expanded metrics
- Consider side-by-side layout (categories left, metrics right)

#### Tailwind Classes to Use
```css
/* Category Grid */
grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2

/* Category Button */
flex flex-col items-center justify-center p-2 min-h-[56px]
rounded-lg transition-all

/* Expanded Metric Grid */
grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3
animate-[slideDown_200ms_ease-out]
```

**Acceptance Criteria**:
- [ ] Looks good on 375px mobile width
- [ ] Looks good on 768px tablet width
- [ ] Looks good on 1280px desktop width
- [ ] No horizontal overflow
- [ ] All interactive elements easily tappable

---

### Task 5: Testing and Verification
**Manual Testing Checklist**:

1. **Category Display**
   - [ ] All 11 categories visible without scrolling
   - [ ] Icons and names display correctly
   - [ ] Event count badges update in real-time

2. **Accordion Behavior**
   - [ ] Tapping category expands it
   - [ ] Tapping again collapses it
   - [ ] Tapping different category switches expansion
   - [ ] Smooth animation on expand/collapse

3. **Event Recording**
   - [ ] Select Home team -> tap category -> tap metric -> event recorded for Home
   - [ ] Select Away team -> tap category -> tap metric -> event recorded for Away
   - [ ] Score updates when recording goals
   - [ ] Undo removes last event

4. **Layout**
   - [ ] Pitch visual minimized/collapsible
   - [ ] Scoreboard visible at all times
   - [ ] Footer buttons (Play/Pause, Finish) accessible
   - [ ] EventHistory scrollable

5. **Responsive**
   - [ ] Mobile (portrait): all categories fit in 4 columns
   - [ ] Tablet (landscape): comfortable spacing
   - [ ] Desktop: sidebar layout works

---

## Commit Strategy

### Commit 1: Add AccordionRecorder component
```
feat(live-analysis): Add AccordionRecorder component for quick event recording

- Create accordion-style category selector showing all 11 categories
- Support single-expand mode for metric item selection
- Include team toggle and event count badges
```

### Commit 2: Integrate AccordionRecorder and minimize pitch
```
refactor(live-analysis): Replace tab navigation with accordion UI

- Replace CategoryTabs + MetricItemGrid with AccordionRecorder
- Make pitch visual collapsible to prioritize recording buttons
- Remove unused selectedCategoryIndex state from hook destructuring
```

### Commit 3: Polish and responsive adjustments
```
style(live-analysis): Polish accordion UI for all screen sizes

- Optimize grid columns for mobile/tablet/desktop
- Ensure minimum touch target sizes
- Add expand/collapse animations
```

---

## Success Criteria

### Functional Requirements
| Requirement | Verification Method |
|-------------|---------------------|
| All 11 categories visible | Visual inspection on mobile |
| Accordion expand/collapse | Tap each category, verify behavior |
| Event recording works | Record events, check EventHistory |
| Team selection works | Toggle teams, record, verify in history |
| Score updates on goals | Record goal event, check scoreboard |

### UX Requirements
| Requirement | Verification Method |
|-------------|---------------------|
| Max 2 taps to record | Count: tap category -> tap metric |
| No horizontal scrolling | Test on 375px width viewport |
| Pitch not dominant | Visual inspection, recording area > pitch |
| Dark mode works | Toggle dark mode, verify styling |

### Performance Requirements
| Requirement | Verification Method |
|-------------|---------------------|
| No lag on expand/collapse | Subjective testing |
| Smooth animations | 60fps visual check |
| No re-render issues | React DevTools |

---

## File Summary

| File | Action | Lines Changed |
|------|--------|---------------|
| `components/AccordionRecorder.tsx` | CREATE | ~180 new |
| `components/LiveAnalysis.tsx` | MODIFY | ~50 modified |
| `components/CategoryTabs.tsx` | UNCHANGED | (may be used elsewhere) |
| `components/MetricItemGrid.tsx` | UNCHANGED | (may be used elsewhere) |
| `hooks/useMatchRecording.ts` | UNCHANGED | No API changes |
| `constants.ts` | UNCHANGED | Data unchanged |

---

## Risk Assessment

### Low Risk
- Styling changes (reversible)
- Component structure changes (isolated to LiveAnalysis)

### Medium Risk
- Accordion UX might feel different to users accustomed to tabs
- Mitigation: Smooth animations, clear visual feedback

### No Risk
- Hook API unchanged
- Constants unchanged
- Other views unaffected

---

## Notes for Executor

1. **CATEGORY_ICONS** and **CATEGORY_COLORS** from `constants.ts` should be reused for visual consistency
2. Extract short category names using: `category.category.split(' (')[0]`
3. Abbreviation extraction logic exists in both `MetricItemGrid.tsx` and `useMatchRecording.ts` - reuse `getAbbreviation()` pattern
4. Consider adding haptic feedback on mobile (future enhancement)
5. EventHistory component remains unchanged - just moved in the layout

---

*Plan generated by Prometheus (Planner Agent)*
*Ready for execution via `/start-work live-recording-quick-buttons`*
