# Frontend Conventions (apps/web)

## Tech Stack

- **Framework**: Vite + TanStack Router (file-based routing).
- **Styling**: Tailwind CSS v4.
- **UI Components**: Base UI + `@workspace/ui` (shadcn/ui).
- **Icons**: HugeIcons (`@hugeicons/react`) — use for all icons. Lucide has been removed from the project.
- **State Management**: Zustand (game stores).
- **Drag-and-drop**: dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`).
- **Validation**: Zod.

## Best Practices & Specialized Skills

This project follows Vercel's React best practices. Agents MUST use the following skills when developing frontend features:

- `vercel-react-best-practices`: Core React implementation standards.
- `vercel-composition-patterns`: Component composition and structure patterns.
- `web-design-guidelines`: UI/UX and design consistency.

These skills are located in `.agents/skills/`.

## Theming & Styling

- **Global Styles**: `packages/ui/src/styles/globals.css` — OKLch color tokens, dark mode via `.dark` class.
- **App Styles**: `apps/web/src/styles.css` — app-specific CSS variables and animations.
- Scrollbars are disabled globally.

### Game Page Colors

The game page (where a game is actively played) uses a distinct color scheme from the rest of the app:

- **Background**: `bg-primary` (green) — the full game canvas background.
- **Buttons and interactive elements**: `bg-secondary` — keeps action elements visually distinct from the green felt surface.

This applies to any route that renders a live game (e.g., `routes/klondike.tsx`). Other pages (menus, settings, how-to-play) use the default `bg-background`.

### Conditional ClassNames

Always use the `cn()` utility from `@workspace/ui/lib/utils`. Put conditional classes on a **separate line** from the base classes.

```tsx
// CORRECT
className={cn(
  'base-class other-class',
  isActive && 'active',
  isDisabled && 'opacity-50 pointer-events-none',
)}

// WRONG — never use template literals with conditionals
className={`base-class ${isActive ? 'active' : ''}`}
```

### HugeIcons Usage

```tsx
import { Cards01Icon } from '@hugeicons/react';

<Cards01Icon size={20} />
```

## Separation of Concerns (Critical)

All frontend code must separate game rules, state, and presentation.

### Directory Structure

```
apps/web/src/
├── routes/           # TanStack Router file-based routes (one file per game + root)
├── components/       # Presentational components — no data fetching, no side effects
│   └── game/         # Shared solitaire primitives (Card, Pile, Foundation, Stock, Waste)
├── lib/
│   ├── games/        # Per-game rules engines (pure functions, no side effects)
│   │   ├── klondike/
│   │   ├── freecell/
│   │   ├── pyramid/
│   │   └── tri-peaks/
│   ├── hooks/        # Stateful game hooks (bridge store + dnd-kit + UI)
│   ├── stores/       # Zustand stores (one per game)
│   ├── utils/        # Pure utilities and transforms
│   └── types/        # Shared TypeScript types (Card, Suit, Rank, Pile, etc.)
```

### Rules

- **Pure Rules Engine**: `lib/games/<game>/` contains only pure functions. No React, no Zustand, no side effects. All game logic (deal, move validation, win detection, scoring) lives here.
- **Zustand Stores**: `lib/stores/` hold mutable game state. Store actions call the rules engine to validate moves before applying them.
- **Hooks**: `lib/hooks/` bridge the store and dnd-kit with React. They expose game state and callbacks to components. No JSX in hooks.
- **Pure Components**: Components in `components/` receive all data via props and emit interactions via callback props. They do not import stores or hooks directly.
- **Route as Orchestrator**: Route files wire hooks to components. They should contain minimal logic — mostly JSX that composes the game layout.

## Shared Game Components

The goal is to share as many components as possible across solitaire variants. The differences between games are:

- Rules engine (move validation, win condition, scoring)
- Number of decks
- Suits and ranks used
- Number of re-deals allowed
- Number of cards dealt per click (stock/deal button)

Everything else — card rendering, pile rendering, drag-and-drop wiring, animations — is shared.

### Shared Primitives (`components/game/`)

| Component | Description |
|---|---|
| `Card` | Renders a single playing card, face-up or face-down. Accepts suit, rank, and orientation. |
| `Pile` | A vertical or fanned stack of cards. Wraps dnd-kit droppable. |
| `Foundation` | A foundation slot (target pile, typically suit-based). |
| `Stock` | The draw pile. Renders face-down, handles click-to-deal. |
| `Waste` | The discard pile shown after dealing from stock. |

### Adding a Shared Component

When a UI pattern appears in more than one game, extract it to `components/game/`. Props should be typed explicitly — no leaking of store types into presentational components.

## TypeScript

- Strict mode enabled (`tsconfig.json`).
- Never use `any`. Infer types from Zod schemas with `z.infer<>` where applicable.
- Use path aliases: `#/*` or `@/*` for `apps/web/src/*`, `@workspace/ui/*` for the shared UI package.
- Card domain types (`Suit`, `Rank`, `Card`, `Pile`) belong in `lib/types/` and are shared across all games.
