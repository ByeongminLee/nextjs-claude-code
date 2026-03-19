# Model Routing

> **Immutable.** Read when deciding which model to assign to an agent.

Default model for all agents is **sonnet**. Opus is never used.

## Who decides the model

| Flow | Who decides | How |
|------|------------|-----|
| `/dev` | **planner** | Analyzes task size -> writes `## Model Assignment` in PLAN.md |
| `/loop` | **loop agent** | Assesses failing REQ count per iteration |
| `/review`, `/spec`, `/debug` | **skill** | Assesses task size before spawning |
| `/status`, `/rule` | **fixed** | Always haiku (frontmatter) |
| `/init` | **fixed** | Always sonnet (frontmatter) |

## Size criteria

| Size | Criteria | Model |
|------|----------|-------|
| **Small** | ≤3 files AND ≤3 tasks AND no checkpoints | `haiku` |
| **Large** | >3 files OR >3 tasks OR checkpoints present | `sonnet` |

## Agent-specific guidance

| Agent | When to use haiku |
|-------|-------------------|
| `planner` | Never — always sonnet |
| `lead-engineer` | ≤3 simple tasks AND no checkpoints |
| `db-engineer` | ≤2 DB tasks, all single-file |
| `ui-engineer` | ≤2 UI tasks, all single-file |
| `worker-engineer` | Always haiku (fixed) |
| `verifier` | Always haiku |
| `code-quality-reviewer` | Always haiku |
| `reviewer` | ≤5 REQs AND <5 files |
| `spec-writer` | Minor updates to existing spec |
| `debugger` | Single-file bug with clear steps |
| `rule-writer` | Always haiku (fixed) |
| `loop` | Never — orchestrates multiple agents |
| `init` | Never — full codebase analysis |

If unsure, default to sonnet — correctness over cost savings.
