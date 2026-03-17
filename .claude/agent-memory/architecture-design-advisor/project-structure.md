---
name: Project structure and conventions
description: Monorepo layout, routing, state management, and code conventions for the Aisleriot solitaire project
type: project
---

## Monorepo topology
- `apps/web` — Vite SPA, TanStack Router file-based routing, React 19, Tailwind v4, port 3000
- `packages/ui` — `@workspace/ui`, shadcn/ui on Base UI primitives, exports: `./globals.css`, `./lib/*`, `./components/*`, `./hooks/*`
- `packages/constants` — `@workspace/constants`, exports `GameVariantId`, `GameVariant[]`, `appInfo`
- No backend. Fully client-side, offline-capable.

## Routing
- File-based under `apps/web/src/routes/`
- Routes exist for: `/`, `/new-game`, `/how-to-play`, `/settings`, `/credits`, `/about`, `/klondike`, `/freecell`, `/pyramid`, `/tri-peaks`
- `/tri-peaks` currently renders a "Coming Soon" placeholder

## State management
- Zustand v5 (`zustand: ^5.0.12`)
- One store per game variant in `apps/web/src/lib/stores/`
- Theme store already exists at `apps/web/src/stores/theme.ts`
- **Why:** stores hold all mutable game state; rules are pure functions called by store actions

## Planned directory structure (from docs)
```
apps/web/src/
  lib/
    games/          # per-game rules engines — pure functions only
      klondike/
      freecell/
      pyramid/
      tri-peaks/
    hooks/          # stateful hooks bridging store + dnd-kit + UI
    stores/         # Zustand stores (one per game)
    utils/          # pure utilities
    types/          # Card, Suit, Rank, Pile — shared across games
  components/
    game/           # shared solitaire primitives: Card, Pile, Foundation, Stock, Waste
```

## Tech stack
- dnd-kit: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- Icons: HugeIcons (`@hugeicons/react`, `@hugeicons/core-free-icons`) — NOT Lucide
- Animation: `motion` (v12)
- Validation: Zod
- Game page bg: `bg-primary` (green felt). Non-game pages use `bg-background`.

## Critical conventions
- `cn()` from `@workspace/ui/lib/utils` for all conditional classNames; conditionals on separate lines
- No negated conditions when an else/null branch is present
- Game rules in `lib/games/<game>/` must never import React, Zustand, or dnd-kit
- Props must be typed explicitly — no leaking store types into presentational components
- Path aliases: `#/*` for `apps/web/src/*`, `@workspace/ui/*` for shared UI
- `pnpm typecheck` (NOT `pnpm type-check`)

## Game variants
- `klondike`, `freecell`, `pyramid`, `tri-peaks` — all defined in `packages/constants/variants.ts`
- Tri Peaks: chain cards one rank apart (up or down, suit-irrelevant), 3 overlapping pyramids + 24-card stock
