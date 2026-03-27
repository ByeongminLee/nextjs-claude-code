# Vercel Plugin

- **Repository**: [vercel/vercel-plugin](https://github.com/vercel/vercel-plugin)
- **Author**: Vercel (official)
- **Focus**: Vercel ecosystem expertise injection
- **Install**: `npx plugins add vercel/vercel-plugin`
- **License**: MIT
- **Platforms**: Claude Code, Cursor

---

## What It Does

Pre-loads AI agents with a relational knowledge graph of the entire Vercel ecosystem — every product, library, CLI, API, and service. Detects what you're working on from tool calls, file paths, and project config, then injects the right expertise at the right time.

---

## Key Components

| Category | Count | Details |
| --- | --- | --- |
| Skills | 47 | AI SDK, auth, Next.js, payments, storage, observability, etc. |
| Agents | 3 | Deployment expert, performance optimizer, AI architecture designer |
| Commands | 5 | Bootstrap, deploy, env management, status, marketplace |
| Knowledge Graph | 1 | `vercel.md` — relational graph of all Vercel products |

---

## Key Features

### Automatic Detection
No manual setup needed. The plugin detects what you're working on and injects relevant expertise automatically via lifecycle hooks.

### Lifecycle Hooks
- **Session start** — Loads ecosystem graph, analyzes repository
- **Pre-tool-use** — Matches tool calls to appropriate skills
- **Pre-write validation** — Prevents deprecated patterns before code generation

### Knowledge Graph (`vercel.md`)
Text-based relational graph covering:
- All Vercel products and their relationships
- Decision matrices for tool selection
- Cross-product workflows
- Migration guidance

### Ecosystem Coverage (March 2026)
- Next.js 16
- AI SDK v6
- Workflow DevKit
- 30+ integrations
- Vercel Functions, Storage, KV, Blob, Postgres

### Manual Invocation
Skills can also be triggered directly:
- `/vercel-plugin:nextjs`
- `/vercel-plugin:deploy prod`
- `/vercel-plugin:ai-sdk`

---

## Pros
- Official Vercel plugin — authoritative, up-to-date ecosystem knowledge
- Zero-config: auto-detects project context
- Deprecation prevention via pre-write hooks
- Comprehensive coverage (47 skills across entire Vercel ecosystem)
- Knowledge graph approach gives holistic understanding, not just API docs
- Simplest installation (`npx plugins add`)

## Cons
- Vercel-specific — no value outside Vercel ecosystem
- 47 skill descriptions loaded at session start consume context
- Requires Node.js 18+ and Bun
- Only supports Claude Code and Cursor (2 platforms)
- Knowledge graph may become stale between updates
- No workflow/lifecycle management (purely knowledge injection)
