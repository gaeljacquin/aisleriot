---
name: Aisleriot Architectural Patterns
description: Store shape, lint rules, path aliases, component conventions, and Zustand patterns discovered during Tri Peaks implementation
type: project
---

## Path Aliases

- `#/*` or `@/*` → `apps/web/src/*`
- `@workspace/ui/*` → `packages/ui/src/*`
- `cn()` utility: import from `@workspace/ui/lib/utils`

## TypeScript Strict Lint Rules (Critical)

The project uses `@typescript-eslint/no-unnecessary-condition` strictly. Key implications:

1. **Record<string, V> indexing** — returns `V` (not `V | undefined`). Never add `=== undefined` guards on Record lookups. `noUncheckedIndexedAccess` is NOT enabled.
2. **Array indexing** — same: returns `T` not `T | undefined`. Never add `=== undefined` guards on array element access.
3. **Type param naming** — must match `/^(T|T[A-Z][A-Za-z]+)$/`. Use `TState`, `TGameState`, not `S` or `GS`.
4. **Non-null assertions** (`!`) — flagged as "unnecessary" on Record/array access for the same reason.

Fix pattern: when accessing array at computed index, either trust the type or check `.length > 0` first (length check is NOT flagged as unnecessary).

## Zustand v5 Pattern

- Create store with `create<StoreType>()((set, get) => ({...}))`
- For persist middleware: `create<T>()(persist((set, get) => ({...}), { name: 'key', partialize: state => ({ field: state.field }) }))`
- No Immer installed — use spread updates: `set({ ...partial })` not `set(draft => { draft.x = y })`
- Store functions (actions) from Zustand are stable references — safe to use directly as callbacks in hooks without `useCallback`

## History Slice Pattern

The `createHistorySlice<TState>` function takes `(get, set)` and returns `HistorySlice<TState>`.
- `TState` must extend `{ score: number; usedUndo?: boolean }`
- Spread the returned slice into the store: `...createHistorySlice<TriPeaksState>(get, set)`
- History keys excluded from game snapshots: `past`, `future`, `historyConfig`, `canUndo`, `canRedo`, `pushHistory`, `undo`, `redo`, `setHistoryConfig`

## Route Pattern

```tsx
import { createFileRoute } from '@tanstack/react-router'
import BackLink from '@/components/BackLink'
import { GameBoard } from '@/components/game/game-name'

export const Route = createFileRoute('/game-name')({ component: GameComponent })

function GameComponent() {
  return (
    <main className="flex h-full flex-col px-6 py-10">
      <div className="mb-6">
        <BackLink label="New Game" destination="/new-game" />
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Game Name</h1>
      </div>
      <div className="flex flex-1 flex-col">
        <GameBoard />  {/* zero props, consumes hook internally */}
      </div>
    </main>
  )
}
```

## Component Conventions

- `cn()` for ALL conditional classNames — never template literals with `${}`
- Board component: no props, consumes hook internally
- Hook: no JSX, returns plain data + callback functions
- Components are purely presentational — no direct store imports (only board component imports hook)
- `PileRole` type: `'tableau' | 'foundation' | 'stock' | 'waste' | 'freecell' | 'peak' | 'discard'`

## Installed Dependencies

- `zustand` v5 (persist middleware built-in)
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- `@hugeicons/react`, `@hugeicons/core-free-icons` — use these for icons (NOT Lucide)
- `motion` (Framer Motion v12)
- `tailwindcss` v4
- **No `immer`** — do NOT use immer middleware

## Tri Peaks Layout

Absolute-positioned pyramid. Container: 42.25rem × 18rem. Step: 4.25rem (card + gap).
- Row y values: 0, 4, 8, 12rem (rows 0–3 top to bottom)
- Row 3 (10 bottom): x[j] = j × 4.25rem
- Row 2 (9 cards): x[j] = (j+0.5) × 4.25rem
- Row 1 (6 cards, pairs per peak): peaks at cols 1,2 | 4,5 | 7,8
- Row 0 (3 tops): x = 6.375, 19.125, 31.875rem
