# Agent Role Boundaries

> **Immutable.** Read when checking which agents can modify which files.

## Permission Matrix

| Agent | Can modify source code | Can modify spec/ docs | Read-only |
|---|---|---|---|
| `init` | No | Yes | — |
| `spec-writer` | No | Yes (spec.md, design.md) | — |
| `planner` | No | Yes (CONTEXT.md, PLAN.md) | — |
| `lead-engineer` | **Yes** | Partial (STATE.md, PLAN.md, history) | — |
| `db-engineer` | **Yes** (DB files only) | Partial (PLAN.md budget via lead) | — |
| `ui-engineer` | **Yes** (UI files only) | Partial (PLAN.md budget via lead) | — |
| `worker-engineer` | **Yes** (assigned file only) | No | — |
| `verifier` | No | No | **Yes** |
| `reviewer` | No | No | **Yes** |
| `code-quality-reviewer` | No | No | **Yes** |
| `status` | No | No | **Yes** |
| `debugger` | **Yes** | Yes (DEBUG.md, STATE.md) | — |
| `rule-writer` | No | Yes (spec/rules/) | — |
| `loop` | **Yes** (via lead-engineer) | Partial (STATE.md, PLAN.md, LOOP_NOTES.md, history) | — |

- `/review` runs `reviewer` then `code-quality-reviewer` sequentially
- Read-only agents never modify any file

## Responsibility Matrix

| Domain | Primary Agent | Trigger |
|--------|--------------|---------|
| Test execution | `tester` | `/test`, `/review` (if TEST_STRATEGY.md exists) |
| Test generation | `tester` | post-dev or TDD mode |
| Security audit | `security-reviewer` | `/security`, `/review` (if SECURITY_STRATEGY.md exists) |
| Logging audit | `log-auditor` | `/log`, `/review` (if LOG_STRATEGY.md exists) |
| Code quality | `code-quality-reviewer` | `/review` |
| Spec compliance | `reviewer` | `/review`, `/loop` |

## Team Mode (`/dev --team`)

| Role | Domain | Spawned when | Model |
|------|--------|-------------|-------|
| `lead-engineer` | Types, utils, hooks, API, server actions, page wiring | Always (leader) | sonnet |
| `db-engineer` | Schema, migrations, queries, RLS, seed data | Feature has `[db]` tasks | sonnet |
| `ui-engineer` | Components, styling, animations, responsive | Feature has 2+ `[ui]` tasks | sonnet |
| `worker-engineer` | Simple utilities, type defs, config | Feature has `[worker]` tasks | haiku |

Coordination:
- Lead has authority over all other engineers
- Auto-fix budget is centralized: teammates message lead before fix attempts
- Worker is always subagent (not a team member) for token optimization
- Same file must never be assigned to multiple engineers
