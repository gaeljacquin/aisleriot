# Aisleriot

A collection of solitaire card games for the browser — a reimplementation of classic collections like 123 Free Solitaire and GNOME Aisleriot. Fully client-side and playable offline.

## Games

| Game      | Status  |
| --------- | ------- |
| Klondike  | Done    |
| FreeCell  | Done    |
| Pyramid   | Done    |
| Tri Peaks | Done    |
| ?         | Planned |

## Getting Started

1. **Prerequisite**: Set up a DevBox (e.g., using the provided `.devcontainer` with Docker and VS Code, or a remote environment).
2. **Environment**: Ensure the `DEVBOX=true` environment variable is set. In the provided DevContainer, this is handled automatically.

### CRITICAL: No Bare Metal

**Do not run `pnpm install` or `pnpm update` on your local host machine (bare metal).** Always use the DevBox terminal for these commands for security.

## Documentation

- [Architecture](docs/architecture.md) — monorepo topology and patterns
- [Commands](docs/commands.md) — full command reference
- [Frontend Conventions](docs/frontend-conventions.md) — code structure and standards
- [Tech Stack](docs/tech-stack.md) - tech stack, monorepo structure, getting started, etc...
- [Workflows](docs/workflows.md) — how to add games, components, and routes
