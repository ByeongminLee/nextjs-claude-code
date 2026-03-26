# Agent Role Boundaries

> **Immutable.** Read when checking which agents can modify which files.

## Permission Matrix

| Agent | Can modify source code | Can modify spec/ docs | Read-only |
|---|---|---|---|
| `init` | No | Yes | — |
| `spec-writer` | No | Yes (spec.md, design.md) | — |
| `planner` | No | Yes (CONTEXT.md, PLAN.md) | — |
| `lead-engineer` | **No** (orchestrator only) | Partial (STATE.md, PLAN.md, history) | — |
| `task-executor` | **Yes** (lead domain files) | No | — |
| `db-engineer` | **Yes** (DB files only) | Partial (PLAN.md budget via lead) | — |
| `ui-engineer` | **Yes** (UI files only) | Partial (PLAN.md budget via lead) | — |
| `worker-engineer` | **Yes** (assigned file only) | No | — |
| `verifier` | No | No | **Yes** |
| `performance-optimizer` | No | No | **Yes** |
| `reviewer` | No | No | **Yes** |
| `code-quality-reviewer` | No | No | **Yes** |
| `task-spec-reviewer` | No | No | **Yes** |
| `status` | No | No | **Yes** |
| `debugger` | **Yes** | Yes (DEBUG.md, STATE.md) | — |
| `rule-writer` | No | Yes (spec/rules/) | — |
| `loop` | **Yes** (via lead-engineer) | Partial (STATE.md, PLAN.md, LOOP_NOTES.md, history) | — |
| `create-orchestrator` | No | Yes (spec/create/) | — |
| `c-ceo`, `c-cto`, `c-cpo`, `c-cmo`, `c-cdo` | No | No | **Yes** |
| `brainstormer` | No | No | **Yes** |
| `reforge-orchestrator` | No | Yes (spec/reforge/, spec/feature/) | — |
| `codebase-analyzer` | No | Yes (spec/reforge/[name]/) | Legacy folder (read-only) |
| `reforge-spec-generator` | No | Yes (spec/feature/) | — |

- `/review` runs `reviewer` then `code-quality-reviewer` sequentially
- Read-only agents never modify any file

## Responsibility Matrix

| Domain | Primary Agent | Trigger |
|--------|--------------|---------|
| Ideation review | `c-ceo`, `c-cto`, `c-cpo`, `c-cmo`, `c-cdo` | `/create` (Phase 4) |
| Test execution | `tester` | `/test`, `/review` (if TEST_STRATEGY.md exists) |
| Test generation | `tester` | post-dev or TDD mode |
| Security audit | `security-reviewer` | `/security`, `/review` (if SECURITY_STRATEGY.md exists) |
| Logging audit | `log-auditor` | `/log`, `/review` (if LOG_STRATEGY.md exists) |
| Code quality | `code-quality-reviewer` | `/review` |
| Spec compliance | `reviewer` | `/review`, `/loop` |
| Per-task review (spec + quality) | `task-spec-reviewer` | `/dev` (after each task) |
| Legacy analysis | `codebase-analyzer` | `/reforge` (Phase 1) |
| Reforge spec generation | `reforge-spec-generator` | `/reforge` (Phase 4) |

## Team Mode (`/dev --team`)

| Role | Domain | Spawned when | Model | Context |
|------|--------|-------------|-------|---------|
| `lead-engineer` | Orchestration only (no code) | Always (orchestrator) | sonnet | Persistent |
| `task-executor` | Types, utils, hooks, API, server actions, page wiring | Each `[lead]` task | sonnet | **Fresh per task** |
| `db-engineer` | Schema, migrations, queries, RLS, seed data | Each `[db]` task | sonnet | **Fresh per task** |
| `ui-engineer` | Components, styling, animations, responsive | Each `[ui]` task | sonnet | **Fresh per task** |
| `worker-engineer` | Single file, <=2 external deps, no business logic. <=200 lines | Each `[worker]` task | haiku | **Fresh per task** |

### File Boundary Definitions

| Domain | Includes | Examples |
|--------|----------|---------|
| DB files | Schema, migration, seed, ORM model, DB utility | `prisma/*`, `drizzle/*`, `supabase/*`, `db.ts`, `seed.ts` |
| UI files | React components, CSS/style, layout markup, animation | `components/**/*.tsx`, `*.css`, `*.module.css` |
| Lead domain (shared) | Server actions, API routes, hooks, utilities, types, page wiring | `actions/*`, `app/api/*`, `hooks/*`, `utils/*`, `types/*` |

Files with ambiguous boundaries (e.g., server actions with DB queries) belong to `task-executor` (dispatched by lead-engineer as a `[lead]` domain task).

Coordination:
- Lead-engineer is the **orchestrator** — it dispatches tasks but never writes implementation code
- All implementation agents (task-executor, db-engineer, ui-engineer, worker-engineer) run as **fresh-context subagents** per task
- Auto-fix budget is centralized in PLAN.md: orchestrator tracks and manages across all subagents
- In team mode with parallel groups: multi-task teammates may be used, but individual tasks within still get fresh context
- Same file must never be assigned to multiple engineers
- Planner must verify no duplicate file assignments exist within the same parallel group
