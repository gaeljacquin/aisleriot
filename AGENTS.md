# AGENTS.md

Aisleriot is a Turborepo monorepo with a Vite + TanStack Router web app — a collection of client-side solitaire card games.

## Essentials

- Package manager: `pnpm` (unified for root and all apps/packages).
- Commands:
  - `pnpm dev` (or `turbo dev`) — start dev server at http://localhost:3000
  - `pnpm build` (or `turbo build`) — build all apps and packages
  - `pnpm test` — run Vitest tests
  - `pnpm lint` (or `turbo lint`) — ESLint across all packages
  - `pnpm format` — Prettier format check
  - `pnpm typecheck` (or `turbo typecheck`) — TypeScript type checking

## More Guidance

- [Architecture overview](docs/architecture.md)
- [Dev commands](docs/commands.md)
- [Frontend conventions (separation of concerns)](docs/frontend-conventions.md)
- [Common workflows](docs/workflows.md)

## Specialized Agent Skills

The project uses Vercel's agent skills for high-quality React and design implementation. Agents should refer to these skills when working on the frontend:

- **React Best Practices**: Located in `.agents/skills/vercel-react-best-practices`
- **Composition Patterns**: Located in `.agents/skills/vercel-composition-patterns`
- **Web Design Guidelines**: Located in `.agents/skills/web-design-guidelines`
- **Turborepo**: Located in `.agents/skills/turborepo`
- **Deploy to Vercel**: Located in `.agents/skills/deploy-to-vercel`
