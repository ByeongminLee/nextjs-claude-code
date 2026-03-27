# Get Shit Done (GSD)

- **Repository**: [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done)
- **Focus**: Spec-driven development with multi-agent orchestration
- **Install**: `npx get-shit-done-cc@latest`
- **License**: MIT
- **Platforms**: Claude Code, OpenCode, Gemini CLI, Codex, Copilot, Cursor, Antigravity

---

## What It Does

A meta-prompting and context engineering system that fights "context rot" (quality degradation as context window fills). Enforces architectural discipline through structured planning, XML-formatted prompts, multi-agent orchestration, and atomic git commits.

---

## Core Workflow

1. **`/gsd:new-project`** — Interactive questioning + parallel research agents → PROJECT.md, REQUIREMENTS.md, ROADMAP.md
2. **`/gsd:discuss-phase`** — Captures implementation preferences → CONTEXT.md
3. **`/gsd:plan-phase`** — Research agents + XML task plans with verification → PLAN.md
4. **`/gsd:execute-phase`** — Wave-based parallel execution, fresh 200k context per plan, atomic commits
5. **`/gsd:verify-work`** — UAT + root-cause diagnosis for failures
6. **`/gsd:ship`** — PR creation with auto-generated descriptions
7. **`/gsd:complete-milestone`** — Archive, tag release, start next cycle

---

## Key Features

### Wave Execution Model
Plans grouped into dependency-aware waves. Wave 1 runs independent plans in parallel, Wave 2 waits for Wave 1, etc. "Vertical slices" (complete features) over "horizontal layers" (all models first).

### XML Prompt Formatting
```xml
<task type="auto">
  <name>Create login endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>Use jose for JWT. Validate credentials. Return httpOnly cookie.</action>
  <verify>curl -X POST localhost:3000/api/auth/login returns 200 + Set-Cookie</verify>
</task>
```

### Context Engineering Artifacts
| Artifact | Purpose |
| --- | --- |
| `PROJECT.md` | Vision (always loaded) |
| `REQUIREMENTS.md` | Scoped requirements with phase traceability |
| `ROADMAP.md` | Milestone structure |
| `STATE.md` | Decisions, blockers, current position |
| `research/` | Stack, patterns, pitfalls |
| `{phase}-CONTEXT.md` | Implementation preferences |
| `{phase}-N-PLAN.md` | XML task with verification |

### Multi-Agent Orchestration
| Stage | Agents |
| --- | --- |
| Research | 4 parallel researchers (stack, features, architecture, pitfalls) |
| Planning | Planner + Checker (iterates until pass) |
| Execution | Wave Manager + Executors (fresh 200k context each) |
| Verification | Verifier + Debuggers |

### Additional Commands
- `/gsd:quick` — Ad-hoc tasks with GSD guarantees
- `/gsd:ui-phase` / `/gsd:ui-review` — Design contracts + 6-pillar visual audits
- `/gsd:plant-seed` — Forward-looking ideas with trigger conditions
- `/gsd:thread` — Persistent cross-session context
- `/gsd:map-codebase` — Analyze existing codebases

### Security
- Path traversal prevention, prompt injection detection
- `gsd-prompt-guard` PreToolUse hook
- CI-ready scanner for agent/workflow files

### Model Profiles
| Profile | Planning | Execution | Verification |
| --- | --- | --- | --- |
| quality | Opus | Opus | Sonnet |
| balanced | Opus | Sonnet | Sonnet |
| budget | Sonnet | Sonnet | Haiku |

---

## Pros
- Comprehensive lifecycle from project init to milestone completion
- Wave execution prevents context rot with fresh 200k context per plan
- Strong verification loops (plan verification + UAT + debugging)
- XML structure maximizes Claude instruction clarity
- Detailed context artifacts create traceable decision history
- Multi-runtime support (7 platforms)

## Cons
- Heavy ceremony — may be overkill for simple tasks (mitigated by `/gsd:quick`)
- Lots of generated artifacts can clutter the project directory
- Recommends `--dangerously-skip-permissions` for best experience
- Learning curve for the full workflow (7 stages + many commands)
- Opinionated about project structure (`.planning/` directory)
