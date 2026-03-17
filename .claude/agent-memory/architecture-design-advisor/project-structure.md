---
name: Project structure and conventions
description: Monorepo layout, routing, state management, and code conventions for the Aisleriot solitaire project
type: project
---

## Monorepo topology
- `apps/web` — Vite SPA, TanStack Router file-based routing, React 19, Tailwind v4, port 3000
- `packages/ui` — `@workspace/ui`, shadcn/ui on Base UI primitives, exports: `./globals.css`, `./lib/*`, `./components/*`, `./hooks/*`
- `packages/constants` — `@workspace/constants`, exports `GameVariantId`, `GameVariant[]`, `appInfo`, `getVariant()`
- No backend. Fully client-side, offline-capable.

## Routing
- File-based under `apps/web/src/routes/`
- Routes: `/`, `/new-game`, `/how-to-play`, `/settings`, `/credits`, `/about`, `/klondike`, `/freecell`, `/pyramid`, `/tri-peaks`, `/tri-peaks-alt`
- All game routes: BackLink → h1 title → Board component → HowToPlayModal

## State management
- Zustand v5 (`zustand: ^5.0.12`)
- One store per game variant in `apps/web/src/lib/stores/`
- Reusable store slices in `apps/web/src/lib/stores/slices/`: `history.ts`, `stats.ts`
- `HistorySlice<TState>` — pushHistory, undo, redo, canUndo, canRedo
- `StatsSlice` — stats (gamesPlayed, gamesWon, cleanWins, bestScore), recordWin, recordLoss, resetStats
- `persist` middleware on all game stores; `partialize` restricts persistence to `stats` only
- `usedUndo: boolean` on game state — used by recordWin for clean-win stat

## Game lib layer
- Pure functions only in `apps/web/src/lib/games/<game>/`
- Files per game: `types.ts`, `deal.ts`, `rules.ts`, `scoring.ts`, `index.ts` (barrel)
- Tri Peaks: single `lib/games/tri-peaks/` shared by both variants via `wrap` boolean param in `canPlayCard` and `isGameLost`
- `rankValue(rank)` maps Rank → 1–13; `rankDistance(a, b)` utility also available

## Hook layer
- `apps/web/src/lib/hooks/` — one hook per variant
- Hooks bridge store → UI, return typed `UseXxxResult` interface
- `UseTriPeaksResult` type lives in `useTriPeaks.ts` and is reused by `useTriPeaksAlt.ts`
- `UsePyramidResult` type lives in `usePyramid.ts`

## Component layer
- `apps/web/src/components/game/` — shared primitives: `Card`, `CardSlot`, `Stock`, `Waste`
- Per-game dirs: `components/game/tri-peaks/`, `components/game/pyramid/`
- **Tri Peaks base board pattern**: `TriPeaksBoardBase` accepts `useGame: () => UseTriPeaksResult` prop;
  `TriPeaksBoard` and `TriPeaksAltBoard` are thin wrappers injecting the variant hook — this is the proven pattern for alt variants
- Pyramid uses a flat structure: `PyramidBoard`, `PyramidGrid`, `PyramidCell`, `PyramidWasteRefContext`
- `WasteRefContext` / `PyramidWasteRefContext` — provide ref to waste pile for animations
- Animation: `motion/react` (v12)

## Variant registration pattern
- `packages/constants/variants.ts` — add entry to `GameVariant[]` AND extend `GameVariantId` union
- Route file: `apps/web/src/routes/<id>.tsx` — `createFileRoute('/<id>')`

## Critical conventions
- `cn()` from `@workspace/ui/lib/utils` for all conditional classNames; conditionals on separate lines
- Game rules in `lib/games/<game>/` must never import React, Zustand, or dnd-kit
- Path aliases: `#/*` for `apps/web/src/*`, `@workspace/ui/*` for shared UI
- Icons: HugeIcons (`@hugeicons/react`) — NOT Lucide
- `pnpm typecheck` (NOT `pnpm type-check`)

## Game variants registered (as of 2026-03-17)
`klondike`, `freecell`, `pyramid`, `tri-peaks`, `tri-peaks-alt`
`GameVariantId = 'klondike' | 'freecell' | 'pyramid' | 'tri-peaks' | 'tri-peaks-alt'`

## Pyramid game — FULLY IMPLEMENTED (as of 2026-03-17)
- Route `/pyramid` — live, fully functional
- `lib/games/pyramid/` — rules.ts, deal.ts, scoring.ts, types.ts, index.ts all complete
- Stores: `pyramid.ts` (game store), `pyramid-settings.ts` (recycleLimit setting)
- Hook: `usePyramid.ts` → `UsePyramidResult`
- Components: `PyramidBoard`, `PyramidGrid`, `PyramidCell`, `PyramidWasteRefContext`
- PyramidBoard has its own interaction logic (click-to-select + pairing); no base board pattern used
- PyramidState: cells, stock, waste, recyclesUsed, score, moveCount, status, usedUndo
- Key rules: sumTo13, isKing, isCellAvailable, canPairCells, canPairWithWaste, canDraw, canRecycle, isGameWon, isGameLost
- PyramidSettingsStore: recycleLimit (default 2), persisted under 'pyramid-settings'

## Pyramid Alt — deferred rule
- "Direct stock-top pairing" was explicitly deferred from the standard Pyramid variant
- Stock top card is visible (face-up); can be paired with a pyramid cell or the waste top (both summing to 13)
- Can also be clicked to draw normally to waste
