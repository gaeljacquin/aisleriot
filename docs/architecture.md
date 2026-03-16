# Architecture Overview

## Topology

- `apps/web`: Vite SPA with TanStack Router (TypeScript, React 19, Tailwind v4), default port 3000.
- `packages/ui`: Shared UI component library (`@workspace/ui`). Contains shadcn/ui components built on Base UI primitives.
- Monorepo: Turborepo workspace with apps under `apps/` and packages under `packages/`.

There is no backend. The app is fully client-side and playable offline.

## Routing

TanStack Router with file-based routing under `apps/web/src/routes/`. Each solitaire game gets its own route file (e.g., `routes/klondike.tsx`). The root layout lives in `routes/__root.tsx`.

## State Management

Each game has its own Zustand store (`apps/web/src/lib/stores/`). Stores hold all mutable game state: card positions, move history, game status, and settings. Game rules are pure functions in `lib/games/<game>/` and are called by store actions — they have no side effects.

## Drag and Drop

Drag-and-drop is handled by dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`). Each card and pile is a dnd-kit draggable/droppable. Drop validation calls the rules engine to determine whether a move is legal before committing it to the store.

## Shared Game Components

Solitaire games share most of their UI. Generic primitives live in `apps/web/src/components/game/` and are reused across all variants:

- **Card** — renders a single playing card (face-up or face-down)
- **Pile** — a stack of cards (tableau column, waste, foundation slot)
- **Stock** — the draw pile
- **Foundation** — target suit stacks

What differs per game: the rules engine, the initial deal, the Zustand store shape, and which components are assembled on the route.

## Packages

| Package | Name | Purpose |
|---|---|---|
| `packages/ui` | `@workspace/ui` | Shared shadcn/ui + Base UI components |

## Code Quality & Standards

These standards apply across the entire monorepo.

- **Avoid Negated Conditions**: When using ternary or conditional operators, avoid negating the condition if an `else` branch (or `null` branch) is present.
  - **Bad**: `!isGameOver ? <Game /> : null`
  - **Good**: `isGameOver ? null : <Game />` or `!isGameOver && <Game />`
  - **Rationale**: Negated conditions are harder to read and are flagged by SonarQube (rule S1264).
- **Conditional classNames**: Always use the `cn()` utility. Put conditionals on a separate line from the base classes.
  - **Correct**: `className={cn('base-class', isActive && 'active')}`
  - **Wrong**: `` className={`base-class ${isActive ? 'active' : ''}`} ``
