# One-Click Recording Mode Implementation Plan

## Overview

Add a recording mode toggle to AccordionRecorder that allows users to switch between:
1. **2-Step Mode (Current)**: Category click -> Expand -> Metric button click
2. **One-Click Mode (New)**: All metric buttons displayed flat for immediate recording

**Special Rule**: The "슈팅 (Shot)" category always remains in 2-step accordion mode, even in One-Click mode.

---

## 1. Requirements Summary

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Toggle between 2-Step and One-Click recording modes | MUST |
| FR-2 | Persist mode preference across sessions (localStorage) | MUST |
| FR-3 | "슈팅 (Shot)" category always uses accordion (2-step) | MUST |
| FR-4 | One-Click mode shows 25 metric buttons directly (excluding 3 Shot metrics) | MUST |
| FR-5 | Maintain visual category grouping in One-Click mode | SHOULD |
| FR-6 | Event count badges work in both modes | MUST |

### Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | Mobile responsive - works on all screen sizes |
| NFR-2 | Smooth transition animation between modes |
| NFR-3 | No performance degradation with 25+ buttons visible |
| NFR-4 | Accessible - keyboard navigable, proper ARIA labels |

---

## 2. UI Design Decision

### Toggle Location

**Decision**: Place toggle in AccordionRecorder component, above the Team Toggle.

**Rationale**:
- Keeps recording controls self-contained
- Does not clutter the LiveAnalysis header (which has navigation/status)
- Clear visual association with the recorder

### Toggle UI Design

```
+--------------------------------------------------+
|  [2-Step]  [One-Click]   <- Segmented control    |
+--------------------------------------------------+
|           [Home]  [Away]  <- Team Toggle         |
+--------------------------------------------------+
```

- Segmented control style (similar to Team Toggle)
- Icons optional: `view_agenda` for 2-Step, `grid_view` for One-Click
- Small text labels: "2-Step" / "One-Click" (or Korean: "2단계" / "원클릭")

### One-Click Mode Layout

```
+--------------------------------------------------+
|  슈팅 (Shot)  [Accordion - Click to expand]      |
|    > SoT | BLK | OFF  (when expanded)            |
+--------------------------------------------------+
|  패스 (Passing)                                   |
|  [AST] [SCP] [25Y] [C]                           |
+--------------------------------------------------+
|  슈팅 기술 (Tech)                                 |
|  [P] [H] [Touch]                                 |
+--------------------------------------------------+
|  PC (Penalty Corner)                             |
|  [PCA] [PCM]                                     |
+--------------------------------------------------+
|  ... (remaining categories)                      |
+--------------------------------------------------+
```

**Layout Rules**:
1. Category headers shown as section dividers (smaller, non-clickable labels)
2. Metric buttons in horizontal flex-wrap grid under each category
3. Shot category: Renders as mini-accordion (same as 2-Step behavior)
4. Buttons sized slightly smaller than expanded accordion buttons for density

### 2-Step Mode Layout

No changes - current behavior maintained exactly.

---

## 3. State Management

### New State

| State | Type | Location | Persistence |
|-------|------|----------|-------------|
| `recordingMode` | `'two-step' \| 'one-click'` | AccordionRecorder | localStorage |

### localStorage Key

```typescript
const RECORDING_MODE_KEY = 'hockalytics-recording-mode';
```

### State Flow

```
1. Component mount:
   - Read localStorage for saved preference
   - Default to 'two-step' if not set

2. Toggle click:
   - Update local state
   - Save to localStorage
   - If switching TO two-step: collapse expandedCategory

3. Mode-specific behavior:
   - two-step: Current accordion logic
   - one-click: Show all categories with flat buttons (except Shot)
```

---

## 4. Acceptance Criteria

### AC-1: Mode Toggle Renders Correctly
- [ ] Toggle appears above Team Toggle in AccordionRecorder
- [ ] Both modes have distinct visual states (active/inactive)
- [ ] Toggle is responsive (works on mobile)

### AC-2: Two-Step Mode Works As Before
- [ ] All 11 category buttons display in grid
- [ ] Click category -> expands with metric buttons
- [ ] Click metric button -> triggers onRecordEvent
- [ ] Event count badges display correctly
- [ ] No regression from current behavior

### AC-3: One-Click Mode Displays Flat Buttons
- [ ] Shot category displays as accordion (click to expand)
- [ ] Remaining 10 categories display with section headers
- [ ] All 25 non-Shot metric buttons visible without expansion
- [ ] Click metric button -> triggers onRecordEvent immediately
- [ ] Event count badges display on relevant buttons

### AC-4: State Persistence
- [ ] Mode preference saved to localStorage on toggle
- [ ] Mode preference loaded on component mount
- [ ] Default to two-step if no saved preference

### AC-5: Visual Category Grouping
- [ ] Category names shown as section headers in One-Click mode
- [ ] Visual separation between categories (spacing/dividers)
- [ ] Category icons displayed in section headers

### AC-6: Mobile Responsive
- [ ] Toggle buttons touch-friendly (min 44px tap target)
- [ ] One-Click mode scrollable on small screens
- [ ] Buttons wrap appropriately on narrow screens

---

## 5. Implementation Tasks

### Task 1: Add Recording Mode State and Persistence

**File**: `c:\Users\BB1\Desktop\FH-Recorder\components\AccordionRecorder.tsx`

**Changes**:
- Add state: `const [recordingMode, setRecordingMode] = useState<'two-step' | 'one-click'>('two-step')`
- Add useEffect for localStorage read on mount
- Add handler to toggle mode and persist to localStorage

**Lines affected**: After line 17 (after expandedCategory state)

```typescript
// Add after line 17
const RECORDING_MODE_KEY = 'hockalytics-recording-mode';
const [recordingMode, setRecordingMode] = useState<'two-step' | 'one-click'>('two-step');

useEffect(() => {
  const saved = localStorage.getItem(RECORDING_MODE_KEY);
  if (saved === 'one-click' || saved === 'two-step') {
    setRecordingMode(saved);
  }
}, []);

const handleModeChange = (mode: 'two-step' | 'one-click') => {
  setRecordingMode(mode);
  localStorage.setItem(RECORDING_MODE_KEY, mode);
  if (mode === 'two-step') {
    setExpandedCategory(null);
  }
};
```

**Acceptance**: AC-4

---

### Task 2: Add Mode Toggle UI

**File**: `c:\Users\BB1\Desktop\FH-Recorder\components\AccordionRecorder.tsx`

**Changes**:
- Add segmented control above Team Toggle (after line 51, inside the first flex container)

**Lines affected**: Insert between line 51 (`<div className="flex flex-col gap-4 pb-4">`) and line 52 (Team Toggle)

```typescript
{/* Recording Mode Toggle */}
<div className="flex items-center justify-center gap-2">
  <div className="flex rounded-lg border-2 border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
    <button
      onClick={() => handleModeChange('two-step')}
      className={`px-4 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 ${
        recordingMode === 'two-step'
          ? 'bg-brand-purple text-white shadow-inner'
          : 'bg-white dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
      }`}
    >
      <span className="material-symbols-outlined text-sm">view_agenda</span>
      2-Step
    </button>
    <button
      onClick={() => handleModeChange('one-click')}
      className={`px-4 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 ${
        recordingMode === 'one-click'
          ? 'bg-brand-purple text-white shadow-inner'
          : 'bg-white dark:bg-slate-800 text-text-sub dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
      }`}
    >
      <span className="material-symbols-outlined text-sm">grid_view</span>
      One-Click
    </button>
  </div>
</div>
```

**Acceptance**: AC-1

---

### Task 3: Implement One-Click Mode Rendering

**File**: `c:\Users\BB1\Desktop\FH-Recorder\components\AccordionRecorder.tsx`

**Changes**:
- Wrap existing category grid in conditional (only show if `recordingMode === 'two-step'`)
- Add new One-Click mode rendering block
- Shot category (index 0) renders as mini-accordion
- Other categories render with flat buttons

**Lines affected**: Replace lines 78-202 with conditional rendering

**Structure**:
```typescript
{recordingMode === 'two-step' ? (
  // Existing 2-step accordion code (lines 78-202)
) : (
  // New One-Click mode code
  <div className="flex flex-col gap-4 px-2">
    {METRIC_DEFINITIONS.map((category, categoryIndex) => {
      const isShot = categoryIndex === 0; // Shot category
      const icon = CATEGORY_ICONS[category.category] || 'category';

      if (isShot) {
        // Render as mini-accordion
        return (
          <div key={category.category} className="...">
            {/* Clickable header */}
            {/* Expandable content with Shot metric buttons */}
          </div>
        );
      }

      // Render flat buttons for all other categories
      return (
        <div key={category.category} className="...">
          {/* Section header (non-clickable) */}
          {/* Grid of metric buttons */}
        </div>
      );
    })}
  </div>
)}
```

**Acceptance**: AC-2, AC-3, AC-5

---

### Task 4: Create Reusable MetricButton Component (Optional Refactor)

**File**: `c:\Users\BB1\Desktop\FH-Recorder\components\AccordionRecorder.tsx`

**Changes**:
- Extract metric button rendering into a reusable internal component
- Used by both 2-step expanded view and One-Click flat view

**Rationale**: Reduces code duplication, ensures consistent button styling

```typescript
const MetricButton: React.FC<{
  item: { name: string; symbol: string };
  onClick: () => void;
  size?: 'normal' | 'compact';
}> = ({ item, onClick, size = 'normal' }) => {
  const abbrev = getAbbreviation(item.symbol);
  // ... button JSX
};
```

**Acceptance**: Maintainability improvement

---

### Task 5: Handle Event Count Badges in One-Click Mode

**File**: `c:\Users\BB1\Desktop\FH-Recorder\components\AccordionRecorder.tsx`

**Changes**:
- In One-Click mode, show per-metric event counts on individual buttons
- Requires expanding `eventCounts` prop or computing from parent

**Note**: Current `eventCounts` is Record<number, number> keyed by category index. For One-Click mode with individual buttons, either:
1. Keep category-level counts and show on section header
2. OR extend eventCounts to track per-metric (requires parent changes)

**Recommendation**: Keep category-level counts, show badge on section header in One-Click mode.

**Acceptance**: AC-3 (partial)

---

### Task 6: Add Mobile Responsive Adjustments

**File**: `c:\Users\BB1\Desktop\FH-Recorder\components\AccordionRecorder.tsx`

**Changes**:
- One-Click mode button grid uses responsive columns: `grid-cols-3 sm:grid-cols-4`
- Ensure toggle buttons have minimum 44px height for touch
- Add appropriate padding/spacing for mobile

**Acceptance**: AC-6

---

### Task 7: Add Transition Animations

**File**: `c:\Users\BB1\Desktop\FH-Recorder\components\AccordionRecorder.tsx`

**Changes**:
- Add `transition-all duration-200` to mode-switching containers
- Consider `animate-in fade-in` for smoother mode transitions

**Acceptance**: NFR-2

---

## 6. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| One-Click mode too crowded on mobile | Medium | High | Use compact button size, test on 375px width |
| Users confused by Shot exception | Low | Medium | Add subtle tooltip or first-time hint |
| localStorage not available | Low | Low | Wrap in try-catch, graceful fallback to two-step |
| Performance with 25+ buttons | Low | Low | React handles this fine; test on low-end device |
| Mode toggle accidentally hit during recording | Medium | Medium | Keep toggle small, consider debounce |

### Mobile-Specific Considerations

1. **Screen width < 375px**: Test grid layout doesn't break
2. **Thumb zone**: Toggle should be reachable one-handed
3. **Scroll behavior**: One-Click mode may need scroll; ensure smooth

---

## 7. Verification Steps

### Manual Testing Checklist

- [ ] Load page fresh - default is two-step mode
- [ ] Toggle to one-click - mode saves to localStorage
- [ ] Refresh page - one-click mode persists
- [ ] In one-click: Shot category is accordion, click to expand
- [ ] In one-click: Other categories show flat buttons
- [ ] Click any flat button - event records immediately
- [ ] Toggle back to two-step - accordion behavior restored
- [ ] Test on mobile viewport (Chrome DevTools)
- [ ] Test dark mode styling

### Automated Testing (if tests exist)

```bash
npm run test -- --grep "AccordionRecorder"
```

---

## 8. Commit Strategy

### Commit 1: Add state and persistence
```
feat(recorder): add recording mode state with localStorage persistence
```

### Commit 2: Add toggle UI
```
feat(recorder): add 2-step/one-click mode toggle UI
```

### Commit 3: Implement one-click rendering
```
feat(recorder): implement one-click mode flat button layout
```

### Commit 4: Polish and responsive
```
style(recorder): add transitions and mobile responsive adjustments
```

---

## 9. Success Criteria

The feature is complete when:

1. **Functional**: Users can toggle between modes and preference persists
2. **Shot Exception**: Shot category always uses accordion behavior
3. **Visual**: Clear visual distinction between modes, proper grouping in one-click
4. **Responsive**: Works seamlessly on mobile and desktop
5. **No Regression**: 2-step mode behaves exactly as before

---

## 10. File Reference Summary

| File | Purpose | Lines Affected |
|------|---------|----------------|
| `components/AccordionRecorder.tsx` | Main implementation | 17-202 (significant) |
| `constants.ts` | Reference only (METRIC_DEFINITIONS) | None |
| `components/LiveAnalysis.tsx` | Parent component | None (no changes needed) |

---

## Appendix: Metric Count Reference

| Category | Index | Items | In One-Click |
|----------|-------|-------|--------------|
| 슈팅 (Shot) | 0 | 3 | Accordion |
| 패스 (Passing) | 1 | 4 | Flat |
| 슈팅 기술 (Tech) | 2 | 3 | Flat |
| PC (Penalty Corner) | 3 | 2 | Flat |
| PS (Penalty Stroke) | 4 | 2 | Flat |
| 드리블 (Dribble) | 5 | 3 | Flat |
| 턴오버 (Turnover) | 6 | 1 | Flat |
| 수비 | 7 | 3 | Flat |
| 골키퍼 (GK) | 8 | 1 | Flat |
| 반칙 (Foul) | 9 | 3 | Flat |
| 득점 (Scored) | 10 | 3 | Flat |

**Total flat buttons in One-Click mode**: 25 (28 total - 3 Shot)
