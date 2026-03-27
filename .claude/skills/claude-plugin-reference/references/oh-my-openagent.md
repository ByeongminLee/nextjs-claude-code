# Oh My OpenAgent (OmO)

- **Repository**: [code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)
- **Focus**: Multi-model orchestration with vendor-agnostic agents
- **Install**: Copy installation prompt into your LLM agent, or `curl` the install guide
- **License**: MIT
- **Platforms**: OpenCode (primary), Claude Code (compatible)

---

## What It Does

A multi-model orchestration system that avoids vendor lock-in. Coordinates Claude, GPT, Kimi, GLM, Minimax, and Gemini models in specialized roles — each task routes to the optimal model automatically. "The future isn't picking one winner — it's orchestrating them all."

---

## Discipline Agents

| Agent | Role | Default Model |
| --- | --- | --- |
| **Sisyphus** | Main orchestrator — plans, delegates, drives to completion | Claude Opus 4.6 / Kimi K2.5 / GLM-5 |
| **Hephaestus** | Autonomous deep worker — explores, researches, executes end-to-end | GPT-5.3-Codex |
| **Prometheus** | Strategic planner — interviews, scopes, builds detailed plans | Claude Opus 4.6 / Kimi K2.5 |
| **Oracle** | Architecture specialist | — |
| **Librarian** | Documentation and search | — |
| **Explore** | Fast codebase scanning | — |

### Task Category Routing
- `visual-engineering` → Frontend/UI work
- `deep` → Autonomous research and execution
- `quick` → Single-file changes
- `ultrabrain` → Complex logic (routes to GPT-5.4 xhigh)

---

## Key Features

### Hash-Anchored Edit Tool ("Hashline")
Each code line includes a content hash (e.g., `11#VK|`), validating changes and preventing stale-line errors. Eliminates a major source of edit failures in large files.

### `ultrawork` / `ulw` Command
Single command activating all agents. Orchestration continues until task completion. `/ulw-loop` (Ralph Loop) persists until 100% done.

### LSP Integration
- `lsp_rename` — Workspace-wide symbol renaming
- `lsp_goto_definition` — Jump to definitions
- `lsp_find_references` — Find all references
- Pre-build diagnostics and AST-aware rewrites

### AST-Grep
Pattern-aware searching and rewriting across 25 languages. Structural code search beyond regex.

### Tmux Integration
Full interactive terminal access for REPLs, debuggers, and TUI applications.

### Built-in MCPs
- **Exa** — Web search
- **Context7** — Official documentation lookup
- **Grep.app** — GitHub code search

### Skill-Embedded MCPs
Skills carry scoped MCP servers, eliminating global context bloat. MCPs load only when the relevant skill activates.

### `/init-deep`
Generates hierarchical `AGENTS.md` files throughout the project for efficient context distribution.

### IntentGate
Analyzes user intent before classification or action — prevents misrouted tasks.

---

## Pros
- True multi-model orchestration — not locked to one provider
- Hash-anchored edits solve the stale-line problem elegantly
- LSP/AST integration provides IDE-level precision
- Skill-embedded MCPs prevent context bloat
- 5+ background agents run in parallel
- Claude Code fully compatible (hooks, commands, skills, MCPs, plugins)

## Cons
- Requires multiple AI subscriptions for full benefit (ChatGPT, Kimi, etc.)
- OpenCode primary — Claude Code is compatible but secondary
- `dev` branch is main development branch (not `main`)
- Complex multi-model setup has more moving parts to debug
- Installation via prompt copy (less conventional than npm/plugin)
- Model routing requires understanding task categories
