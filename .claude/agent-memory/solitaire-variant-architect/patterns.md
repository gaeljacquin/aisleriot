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
        <BackLink label="Game Menu" destination="/new-game" />
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

## FreeCell Store Pattern

FreeCell deviates from pure snapshot restore — undo uses `penalize` mode (subtracts `undoPenaltyScore` from current score, does NOT restore previous score). Set via `setHistoryConfig` call after store creation (cannot pass historyConfig to `createHistorySlice` directly).

```ts
useFreeCellStore.getState().setHistoryConfig({
  maxDepth: 'unlimited',
  undoScoreMode: 'penalize',
  undoPenaltyScore: 5,
})
```

FreeCell `moveCard` does NOT accept moves from foundation (cards not draggable from foundation).

## Route Pattern (Updated — with HowToPlay)

```tsx
function GameComponent() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)
  return (
    <main className="flex h-full flex-col px-6 py-10">
      <div className="relative mb-6 flex items-center">
        <BackLink label="Game Menu" destination="/new-game" />
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-foreground">
          Game Name
        </h1>
      </div>
      <div className="flex flex-1 flex-col">
        <GameBoard onHowToPlay={() => setHowToPlayOpen(true)} />
      </div>
      <HowToPlayModal
        variant={getVariant('game-id')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}
```

## HugeIcons Usage Pattern

Icon SVG data lives in `@hugeicons/core-free-icons` (exported as `IconSvgObject`).
The React wrapper component is `HugeiconsIcon` from `@hugeicons/react`.

```tsx
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'

<HugeiconsIcon icon={Cancel01Icon} size={32} className="text-red-500" />
```

Do NOT import icon names directly from `@hugeicons/react` — they are NOT exported there.

## while (moved) pattern for cascade loops

To avoid `@typescript-eslint/no-unnecessary-condition` on `while (true)`, use:
```ts
let moved = true
while (moved) {
  moved = false
  // ... set moved = true to continue
}
```

## Store Helper Function Extraction (Klondike pattern)

When both draw-1 and draw-3 stores share identical logic, extract helper functions
at module level (not inside the store callback) to keep stores DRY:
- `applyAutoFlips(tableau)` — flip exposed face-down tops, return [newTableau, scoreGain]
- `applyCascade(state)` — auto-move safe cards to foundation
- `extractSource(move, state)` — pull movedCards + updated source piles
- `applyDestination(move, movedCards, tableau, foundation)` — place cards at target
- `scoreForMove(move)` — return score delta for a validated move

## Two-variant Board pattern (Klondike)

When two variants share identical board UI, use a `BoardBase` + injected hook:
```tsx
// KlondikeBoardBase.tsx — takes useGame prop
interface KlondikeBoardBaseProps {
  useGame: () => UseKlondikeResult
  onHowToPlay: () => void
}

// KlondikeBoard.tsx — injects draw-1 hook
export default function KlondikeBoard({ onHowToPlay }) {
  return <KlondikeBoardBase useGame={useKlondikeDrawOne} onHowToPlay={onHowToPlay} />
}
```

## Tri Peaks Layout

Absolute-positioned pyramid. Container: 42.25rem × 18rem. Step: 4.25rem (card + gap).
- Row y values: 0, 4, 8, 12rem (rows 0–3 top to bottom)
- Row 3 (10 bottom): x[j] = j × 4.25rem
- Row 2 (9 cards): x[j] = (j+0.5) × 4.25rem
- Row 1 (6 cards, pairs per peak): peaks at cols 1,2 | 4,5 | 7,8
- Row 0 (3 tops): x = 6.375, 19.125, 31.875rem
