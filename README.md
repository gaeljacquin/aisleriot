# Aisleriot

A collection of solitaire card games for the browser — a reimplementation of classic collections like 123 Free Solitaire and GNOME Aisleriot. Fully client-side and playable offline.

## Games

| Game | Status |
|---|---|
| Klondike | Done |
| FreeCell | Done |
| Pyramid | Done |
| Tri Peaks | Done |
| Knaves | Planned |


## Getting Started

1. **Prerequisite**: Install Docker and VS Code (with the "Dev Containers" extension).
2. **Open in DevContainer**: Open the project folder in VS Code and click "Reopen in Container" when prompted.
3. **Environment**: The DevContainer automatically runs `pnpm install` and sets up the environment.

### CRITICAL: No Bare Metal
**Do not run `pnpm install` or `pnpm update` on your host machine (bare metal).** Always use the DevContainer terminal for these commands for security.


## Documentation

- [Architecture](docs/architecture.md) — monorepo topology and patterns
- [Commands](docs/commands.md) — full command reference
- [Frontend Conventions](docs/frontend-conventions.md) — code structure and standards
- [Tech Stack](docs/tech-stack.md) - tech stack, monorepo structure, getting started, etc...
- [Workflows](docs/workflows.md) — how to add games, components, and routes
