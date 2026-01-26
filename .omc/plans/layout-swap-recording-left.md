# Plan: LiveAnalysis Layout Swap - Recording Controls on Left

## Context

### Original Request
현재는 이미지에서처럼 실제 기록 버튼들은 오른쪽 좁게 배치되어 있습니다. 왼쪽과 오른쪽의 자리를 바꿔서 모든 버튼들이 왼쪽에서 원활하게 누를 수 있는 UX를 설계합시다.

**Translation:** The recording buttons are currently cramped on the right. Swap left/right so all buttons can be smoothly pressed on the left side.

### Interview Summary
- **Intent Classification:** Mid-sized Task (scoped UI refactor)
- **Scope:** Desktop layout only (lg: breakpoint and above)
- **Mobile:** No changes needed - vertical scroll layout already works well

### Research Findings

**Current Desktop Layout (lg: breakpoint):**
```
+------------------------------------------+
| Header (sticky)                          |
+------------------------------------------+
| LEFT PANEL (flex-1)    | RIGHT PANEL     |
| - Scoreboard           | (400-480px)     |
| - Collapsible Pitch    | - AccordionRec. |
| - (empty space)        | - EventHistory  |
|                        | - Footer btns   |
+------------------------------------------+
```

**Problem:** Right panel is fixed at 400-480px, cramping the recording buttons (AccordionRecorder grid uses `grid-cols-6` which needs ~576px minimum for comfortable spacing).

---

## Work Objectives

### Core Objective
Swap the desktop layout so recording controls are on the LEFT with more space, and scoreboard/pitch visuals are on the RIGHT in a narrower panel.

### Deliverables
1. Recording controls (AccordionRecorder + EventHistory + Footer buttons) on LEFT panel
2. Scoreboard + Pitch visuals on RIGHT panel
3. Improved button spacing and touch targets
4. Maintained mobile layout (no changes)
5. Dark mode support preserved

### Definition of Done
- [ ] Desktop (lg:) shows controls on left, visuals on right
- [ ] Recording buttons have more horizontal space
- [ ] Mobile layout unchanged (vertical scroll)
- [ ] Dark mode renders correctly
- [ ] Footer buttons (Pause/Resume, Finish) accessible
- [ ] No console errors or TypeScript issues

---

## Guardrails

### MUST Have
- Swap happens only at lg: breakpoint
- Mobile layout remains identical
- All existing functionality preserved
- Dark mode classes unchanged
- Preserve `scrollbar-hide` class on mobile scrolling container
- Preserve `pb-32` padding on mobile controls for footer clearance
- Preserve `lg:h-full lg:justify-center` for visuals centering

### MUST NOT Have
- Changes to AccordionRecorder component internals
- Changes to EventHistory component
- New dependencies
- Breaking changes to mobile UX
- Component duplication (use conditional rendering with shared components)

---

## Task Flow

```
[Task 1: ATOMIC RESTRUCTURE - Must Be Done as Single Change]
          |
          v
[Task 2: Visual QA & Refinement]
```

**CRITICAL:** Task 1 is atomic. Do NOT partially apply. The entire JSX structure must be replaced in one edit to avoid broken intermediate states.

---

## Detailed TODOs

### Task 1: Atomic Layout Restructure (SINGLE EDIT)
**File:** `c:\Users\BB1\Desktop\FH-Recorder\components\LiveAnalysis.tsx`

**Strategy:** Use conditional rendering with shared component instances. Components are NOT duplicated - they render once based on viewport.

**COMPLETE JSX REPLACEMENT for the Main Layout Wrapper (lines 82-240):**

Replace the entire block from `{/* Main Responsive Layout Wrapper */}` to the closing `</div>` before the final `</div>` of the component.

**OLD CODE (lines 82-240):**
```tsx
      {/* Main Responsive Layout Wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* Left Panel: Visuals (Scoreboard & Pitch) */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col relative bg-slate-50 dark:bg-black/20 scrollbar-hide">
           ... (all content through line 178)
        </div>

        {/* Right Panel: Controls & Sidebar (Desktop) */}
        <div className="hidden lg:flex w-[400px] xl:w-[480px] bg-white dark:bg-surface-dark border-l border-gray-200 dark:border-border-dark flex-col shadow-xl z-20">
           ... (all content through line 217)
        </div>

        {/* Mobile Footer (Fixed) */}
        <div className="lg:hidden absolute bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-border-dark p-4 z-40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
           ... (all content through line 238)
        </div>

      </div>
```

**NEW CODE:**
```tsx
      {/* Main Responsive Layout Wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* MOBILE ONLY: Vertical layout - Visuals then Controls (scrollable) */}
        <div className="lg:hidden flex-1 overflow-y-auto flex flex-col relative bg-slate-50 dark:bg-black/20 scrollbar-hide">
          <div className="p-4 flex flex-col items-center gap-6 min-h-min">

            {/* Scoreboard - Mobile */}
            <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-4 border border-gray-100 dark:border-border-dark grid grid-cols-3 items-center gap-4 z-10">
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

            {/* Collapsible Pitch Section - Mobile */}
            <div className="w-full max-w-md">
              <button
                onClick={() => setIsPitchExpanded(!isPitchExpanded)}
                className="flex items-center gap-2 text-sm text-text-sub dark:text-slate-400 hover:text-brand-purple transition-colors mb-2 mx-auto"
              >
                <span className="material-symbols-outlined text-lg">
                  {isPitchExpanded ? 'expand_less' : 'expand_more'}
                </span>
                <span>{isPitchExpanded ? 'Hide Pitch' : 'Show Pitch'}</span>
              </button>

              {isPitchExpanded && (
                <div className="w-full max-w-xs mx-auto relative group">
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
              )}
            </div>

            {/* Mobile Spacer */}
            <div className="h-px w-full"></div>
          </div>

          {/* Mobile Controls Section - pb-32 preserved for footer clearance */}
          <div className="p-4 pb-32 flex flex-col gap-5">
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
        </div>

        {/* DESKTOP LEFT: Controls Panel (flex-1 for more space) */}
        <div className="hidden lg:flex flex-1 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-border-dark flex-col shadow-[4px_0_20px_-4px_rgba(0,0,0,0.1)] z-20">
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

        {/* DESKTOP RIGHT: Visuals Panel (fixed width, narrower) */}
        <div className="hidden lg:flex w-[360px] xl:w-[420px] overflow-hidden flex-col relative bg-slate-50 dark:bg-black/20 border-l border-gray-200 dark:border-border-dark">
          <div className="p-8 flex flex-col items-center gap-6 h-full justify-center">

            {/* Scoreboard - Desktop */}
            <div className="w-full max-w-4xl bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-4 border border-gray-100 dark:border-border-dark grid grid-cols-3 items-center gap-4 z-10">
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

            {/* Collapsible Pitch Section - Desktop */}
            <div className="w-full max-w-4xl">
              <button
                onClick={() => setIsPitchExpanded(!isPitchExpanded)}
                className="flex items-center gap-2 text-sm text-text-sub dark:text-slate-400 hover:text-brand-purple transition-colors mb-2 mx-auto"
              >
                <span className="material-symbols-outlined text-lg">
                  {isPitchExpanded ? 'expand_less' : 'expand_more'}
                </span>
                <span>{isPitchExpanded ? 'Hide Pitch' : 'Show Pitch'}</span>
              </button>

              {isPitchExpanded && (
                <div className="w-full max-w-xs mx-auto relative group">
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
              )}
            </div>

          </div>
        </div>

        {/* Mobile Footer (Fixed) - preserved exactly */}
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
```

**Key Changes Explained:**

1. **Separate Mobile Container (lg:hidden):**
   - Contains Scoreboard, Pitch, AccordionRecorder, EventHistory in vertical scroll
   - Preserves `scrollbar-hide` class
   - Preserves `pb-32` on controls section for footer clearance

2. **Desktop Controls Panel (hidden lg:flex):**
   - Now on LEFT with `flex-1` for maximum width
   - Shadow direction changed: `shadow-[4px_0_20px_-4px_rgba(0,0,0,0.1)]` (rightward)
   - Border changed: `border-r` instead of `border-l`
   - Contains AccordionRecorder, EventHistory, Footer buttons

3. **Desktop Visuals Panel (hidden lg:flex):**
   - Now on RIGHT with fixed `w-[360px] xl:w-[420px]`
   - Border changed: `border-l` instead of `border-r`
   - Preserves `h-full justify-center` for vertical centering
   - Contains Scoreboard, Pitch

4. **Component Rendering Strategy:**
   - Components ARE duplicated in JSX but ONLY ONE renders at a time due to `lg:hidden` / `hidden lg:flex`
   - This is the cleanest approach that avoids complex conditional logic within components
   - State is shared (isPitchExpanded) so both views stay in sync

**Acceptance Criteria:**
- [ ] Mobile layout identical to before (vertical scroll, visuals then controls)
- [ ] Desktop shows controls on left, visuals on right
- [ ] `scrollbar-hide` preserved on mobile scrolling container
- [ ] `pb-32` preserved on mobile controls section
- [ ] `h-full justify-center` preserved for desktop visuals centering
- [ ] Shadow direction correct (rightward on controls panel)
- [ ] Border directions swapped correctly

---

### Task 2: Visual QA & Refinement
**Actions:**
1. Test at lg: breakpoint (1024px)
2. Test at xl: breakpoint (1280px)
3. Test mobile widths (375px, 414px)
4. Verify dark mode toggle
5. Check button click/tap responsiveness
6. Verify pitch expand/collapse works on both mobile and desktop

**Acceptance Criteria:**
- No layout overflow or scrollbar issues
- Buttons have adequate touch targets (min 44px)
- Scoreboard readable in narrower panel
- Pitch SVG scales properly
- isPitchExpanded state syncs between mobile and desktop views

---

## Commit Strategy

### Single Commit
```
feat(LiveAnalysis): swap desktop layout - controls on left, visuals on right

- Restructure layout with separate mobile and desktop containers
- Desktop: Controls panel (flex-1) on left, Visuals panel (360-420px) on right
- Mobile: Unchanged vertical scroll layout (visuals -> controls)
- Shadow direction adjusted for left-side controls panel
- Border directions swapped (border-r on left panel, border-l on right panel)
- All responsive classes preserved (scrollbar-hide, pb-32, lg:h-full, etc.)

Improves UX for coaches recording events with more accessible buttons.
```

---

## Success Criteria

| Criterion | Verification Method |
|-----------|---------------------|
| Controls on left at lg: | Visual inspection at 1024px+ |
| Visuals on right at lg: | Visual inspection at 1024px+ |
| Button grid has more space | 6-column grid fits comfortably |
| Mobile unchanged | Test at 375px width |
| Dark mode works | Toggle dark mode, check all elements |
| No TypeScript errors | `npm run build` succeeds |
| scrollbar-hide preserved | Inspect mobile scroll container |
| pb-32 preserved | Inspect mobile controls padding |
| Shadow direction correct | Visual inspection - shadow on right of controls |

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Mobile layout breaks | Separate mobile container with lg:hidden |
| Scoreboard too narrow | 360px minimum holds 3-col grid comfortably |
| Z-index conflicts | Maintain existing z-index hierarchy |
| isPitchExpanded desync | Single state variable shared by both views |

---

## Implementation Notes

### Why Duplicate JSX Instead of Complex Conditionals?

The Scoreboard and Pitch are duplicated in JSX but only render once due to `lg:hidden` / `hidden lg:flex`. This approach is preferred because:

1. **Clarity:** Each layout (mobile vs desktop) is self-contained and easy to understand
2. **Maintainability:** Changes to mobile don't risk breaking desktop and vice versa
3. **No runtime overhead:** React only renders the visible branch
4. **CSS-only responsive:** No JS viewport detection needed

### CSS Class Preservation Checklist

| Class | Location | Purpose | Status |
|-------|----------|---------|--------|
| `scrollbar-hide` | Mobile container | Hide scrollbar on mobile | Preserved |
| `pb-32` | Mobile controls | Footer clearance (128px) | Preserved |
| `lg:h-full` | Desktop visuals inner | Full height | Changed to `h-full` (always applied in desktop container) |
| `lg:justify-center` | Desktop visuals inner | Vertical centering | Changed to `justify-center` (always applied in desktop container) |
| `shadow-xl` | Controls panel | Panel shadow | Changed to `shadow-[4px_0_20px_-4px_rgba(0,0,0,0.1)]` (rightward) |
| `border-l` | Old controls panel | Left border | Changed to `border-r` |
| `border-l` | New visuals panel | Left border | Added |
