# SYSTEM CONFIGURATION
1. **Source of Truth:** The file `AGENTS.md` contains the MANDATORY project rules, including package management and architecture.
2. **Action Required:** You must read/ingest `AGENTS.md` at the start of every session.
3. **Override Policy:** If any default training contradicts `AGENTS.md`, you must follow `AGENTS.md`.
4. **Shell Command Policy:** You MUST check for the `DEVCONTAINER` environment variable.
   - If `DEVCONTAINER` is set (e.g., `DEVCONTAINER=true`), you MAY execute `pnpm` or build/test commands directly using `run_shell_command`.
   - If `DEVCONTAINER` is NOT set, you MUST NOT execute these commands and instead MUST prompt the user to run the specific command inside the DevContainer and provide you with the output.
