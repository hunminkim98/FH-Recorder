# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hockalytics (FH-Recorder) is a field hockey analytics application for coaches. It provides:
- Operational definitions for standardized metric terminology (Korean/English)
- Live match recording interface with real-time event tracking
- Dashboard with match history and season statistics

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build to dist/
npm run preview      # Preview production build
```

## Architecture

### Tech Stack
- React 19 with TypeScript
- Vite 6 for build tooling
- Tailwind CSS 3 with plugins: forms, typography, container-queries
- Google Fonts: Inter, Lexend, Noto Sans KR, Material Symbols

### Entry Points
- `index.html` - HTML shell with font preloads
- `index.tsx` - React root mount
- `App.tsx` - Main app component with view routing

### View Routing
The app uses simple state-based routing in `App.tsx`:
- `currentView` state controls which view renders
- Views: `home`, `definitions`, `analysis`, `team`, `settings`
- `onNavigate` callback passed to components for navigation

### Component Organization
```
components/
├── Sidebar.tsx              # Collapsible navigation (desktop/mobile)
├── Home.tsx                 # Dashboard with quick actions, recent matches
├── OperationalDefinitions.tsx  # Terminology reference page
├── LiveAnalysis.tsx         # Real-time match recording interface
├── DefinitionTable.tsx      # Renders METRIC_DEFINITIONS as table
├── MetricSummaryCard.tsx    # Metric category cards
└── ConceptCard.tsx          # Analysis concept cards
```

### Data Flow
- All metric definitions are in `constants.ts` (METRIC_DEFINITIONS, MENU_ITEMS, etc.)
- Type definitions in `types.ts` (MenuItem, MetricCategory, etc.)
- Components consume constants directly via imports

### Responsive Design
- Mobile-first with `md:` breakpoints
- Sidebar: drawer on mobile, collapsible panel on desktop
- LiveAnalysis: full-screen mode hides sidebar/mobile nav
- Bottom navigation bar on mobile (hidden in analysis mode)

### Styling Patterns
Custom Tailwind tokens in `tailwind.config.js`:
- Colors: `primary`, `primary-light`, `surface-light/dark`, `border-light/dark`
- Live analysis: `pitch-blue`, `pitch-border`, `brand-navy`, `brand-purple`
- Dark mode: class-based (`dark:`)

### Korean Language
UI text is primarily in Korean. Metric definitions include both Korean names and English abbreviations (e.g., "유효 슈팅" / "Shot on Target, SoT").

## Environment Variables

Set `GEMINI_API_KEY` in `.env.local` for Gemini API integration (see vite.config.ts).
