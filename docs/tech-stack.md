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

1. **Prerequisite**: A remote server or a devcontainer.

## Commands

Run all commands from the root or within specific app/package directories:

```bash
nr dev        # Start all apps in dev mode
nr build      # Build all apps and packages
nr test       # Run Vitest tests
nr lint       # Lint all packages
nr format     # Check formatting with Prettier
nr typecheck  # Run TypeScript type checking
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
