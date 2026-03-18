# Common Workflows

## Add a New Solitaire Game Variant

Use the `@solitaire-variant-architect` agent for this workflow. The pattern is layer-by-layer, bottom-up.

### 1. Rules Engine (`lib/games/<game>/`)

Create a directory for the game's rules. All logic must be pure functions with no side effects:

- `rules.ts` — move validation: `isValidMove(card, targetPile, state): boolean`
- `deal.ts` — initial deal: `deal(deck: Card[]): GameState`
- `win.ts` — win condition: `isWon(state: GameState): boolean`
- `index.ts` — barrel export

Decide the game configuration here: number of decks, suits, ranks, number of re-deals, cards dealt per click.

### 2. Zustand Store (`lib/stores/use-<game>-store.ts`)

Define the store shape and actions:

- State: card positions, move history, game status, settings
- Actions: `deal()`, `move(card, targetPile)`, `undo()`, `reset()`
- Actions call the rules engine for validation before mutating state

### 3. Hook (`lib/hooks/use-<game>.ts`)

A hook that bridges the store and dnd-kit with React:

- Reads from the Zustand store
- Sets up dnd-kit sensors and handlers
- Exposes derived state (e.g., `isWon`, `moveCount`) and callbacks to the route
- No JSX

### 4. Components (`components/game/<game>/`)

Assemble the game layout from shared primitives (`Card`, `Pile`, `Foundation`, `Stock`, `Waste`). Only add new components here if the game requires UI that genuinely cannot be shared. Build bottom-up: atoms → layout → full board.

### 5. Route (`routes/<game>.tsx`)

A minimal TanStack Router route that:

- Imports the hook
- Imports the game layout component
- Wires them together
- Handles the route-level layout (title, settings panel, etc.)

---

## Add a Shared Game Component

When a UI pattern (e.g., a card flip animation, a score counter, a settings overlay) is needed by more than one game:

1. Build the component in `components/game/` with fully typed props — no store imports.
2. Export it from `components/game/index.ts`.
3. Replace the game-specific version(s) with the shared import.
4. Document the component's props in a JSDoc comment.

---

## Add a New Route

1. Create a file in `apps/web/src/routes/` following TanStack Router file-based naming conventions (e.g., `routes/klondike.tsx` → accessible at `/klondike`).
2. Refer to the `vercel-react-best-practices` and `vercel-composition-patterns` skills for component structure.
3. For the root layout (navbar, footer), edit `routes/__root.tsx`.

---

## Add a shadcn/ui Component

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

The component is added to `packages/ui/src/components/`. Import it anywhere via:

```tsx
import { ComponentName } from '@workspace/ui/components/<component>';
```
