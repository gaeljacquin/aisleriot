# Tech Stack

## Moving Parts

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Vite + React 19 + TanStack Router
- **Styling**: Tailwind CSS v4 + Base UI
- **Icons**: HugeIcons (`@hugeicons/react`)
- **State**: Zustand
- **Drag-and-drop**: dnd-kit
- **Testing**: Vitest + Testing Library
- **UI Library**: `packages/ui` (shadcn/ui components)

## Monorepo Structure

```
apps/
  web/        # Main Vite SPA (all games)
packages/
  ui/         # Shared UI component library (@workspace/ui)
docs/         # Developer documentation
.claude/      # Agent definitions and skills
```

## Getting Started

```bash
pnpm install
pnpm dev        # Start dev server at http://localhost:3000
```

## Commands

```bash
pnpm dev        # Start all apps in dev mode
pnpm build      # Build all apps and packages
pnpm test       # Run Vitest tests
pnpm lint       # Lint all packages
pnpm format     # Check formatting with Prettier
pnpm typecheck  # Run TypeScript type checking
```

## Adding UI Components

To add a shadcn/ui component to the shared UI package:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components are placed in `packages/ui/src/components/` and imported via:

```tsx
import { Button } from '@workspace/ui/components/button';
```
