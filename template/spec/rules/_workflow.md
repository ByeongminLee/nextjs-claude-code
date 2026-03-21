# FeatureSpec Workflow Rules (Core)

> **Immutable.** Do not modify after `/init`. Project-specific coding rules belong in non-prefixed files in this directory.

## Folder Structure

```
spec/
  PROJECT.md             <- project purpose, tech stack, testing setup
  ARCHITECTURE.md        <- feature map, cross-feature dependencies
  STATE.md               <- all features and their current phases (multi-feature)
  DEBUG.md               <- debug log (created by /debug)
  learnings/             <- recurring patterns extracted from /loop and /debug sessions
  rules/
    _workflow.md          <- THIS FILE (core workflow rules, immutable)
    _document-format.md   <- spec.md, design.md, history format
    _model-routing.md     <- model selection criteria
    _delegation.md        <- HANDOFF format, agent spawning rules
    _verification.md      <- 4-level verification protocol
    _loop-protocol.md     <- /loop rules and cross-iteration context
    _agent-roles.md       <- agent role boundaries and responsibilities
    _skill-budget.md      <- skill injection budget per agent
    _nextjs-ordering.md   <- Next.js task dependency ordering
    code-style.md         <- project coding rules (mutable)
    testing.md            <- project testing rules (mutable)
  feature/
    [name]/
      spec.md             <- what to build
      design.md           <- how to build it
      PLAN.md             <- task list, checkpoints, auto-fix budget
      CONTEXT.md          <- locked decisions, constraints
      LOOP_NOTES.md       <- cross-iteration context for /loop
      PRODUCT_REVIEW.md   <- product review result (created by /office-hours)
      history/            <- change history archive
```

## STATE.md Format

STATE.md tracks multiple features independently. Each feature has its own phase.

```markdown
# State
Updated: YYYY-MM-DD

## Features

### [feature-name] [phase]
Started: YYYY-MM-DD

## Completed
- [feature-name] (YYYY-MM-DD)

## Blockers
- [feature-name]: [blocker description]
```

Valid phases: `idle`, `planning`, `executing`, `verifying`, `looping`

Rules:
- Each feature's phase is independent
- When a feature completes, move it from `## Features` to `## Completed` with date
- Keep STATE.md under 100 lines — archive old completed entries

## Available Skills

| Skill | Purpose |
|---|---|
| `/init` | First-time setup: analyze codebase, populate spec docs |
| `/brainstorm` | Explore feature design when the approach is unclear or you want to compare alternatives. Use before `/spec` |
| `/spec` | Define or update a feature spec. TDD: auto-generates TEST.md skeleton. Mock + testing enabled by default |
| `/office-hours [name]` | Product review before development (business value, scope, metrics) |
| `/dev` | Plan, implement, verify a feature. TDD: writes tests first, then implements. `--team` for parallel team mode |
| `/review` | Check spec compliance + code quality |
| `/status` | Show project status |
| `/debug` | Systematic bug fixing |
| `/rule` | Add or update a project coding rule |
| `/loop` | Loop until all REQs in spec.md are satisfied |

## Per-Task Review (`/dev`)

During `/dev`, each completed task (except `[worker]` tasks) gets an independent quick review via `task-spec-reviewer` (haiku) before being marked done. The reviewer checks spec compliance first, then code quality — in a single pass.

Rules:
- Max 2 review rounds per task (fix → re-review)
- After 2 failed rounds: escalate to user
- Review rounds do NOT count toward the auto-fix budget
- `[worker]` tasks skip review (simple file operations)
- `/review` remains available as a full-feature-level review after `/dev` completes (cross-task integration perspective)

## /review vs /loop

- `/review`: read-only snapshot review of current implementation (no modifications)
- `/loop`: automated review → fix → re-verify cycles until all REQs pass
- Typical sequence: `/dev` → `/review` (optional, status check) → `/loop` (if needed, auto-fix cycle)
- `/loop` uses the same reviewer internally, so running `/review` before `/loop` is not required

## Checkpoint Conditions

| Type | Condition | Action |
|---|---|---|
| `checkpoint:decision` | Implementation direction unclear, type structure change | Present options, wait |
| `checkpoint:human-verify` | UI implementation complete | Request browser verification, wait |
| `checkpoint:auth-gate` | Payment or auth manual steps required | Always stop, never simulate |

## Auto-fix Budget

Maximum retries: **3**
- `/dev`: shared counter across session. Persists via PLAN.md `Used: N`.
- `/loop`: resets per iteration. Each iteration gets budget of 3.
- `/debug`: 3 attempts per bug. Tracked in DEBUG.md.
- Cleanup (console.log removal, unused imports, commented-out code) does NOT count toward budget in any flow.

After 3 failed attempts: stop and escalate to user.

Budget reset: to reset after manual code fixes, edit `Used:` value to `0` in PLAN.md.

## Language
- Default language for spec documents is **English**
- If user writes in another language, match that language
- Section headers: **English or Korean** (recognized by `validate-post-write.sh`)

## Fresh Context Execution

During `/dev`, the lead-engineer acts as a **thin orchestrator** that dispatches each task to a fresh-context subagent:

| Task tag | Subagent | Model | Context |
|----------|----------|-------|---------|
| `[lead]` | `task-executor` | sonnet | Fresh per task |
| `[db]` | `db-engineer` | sonnet | Fresh per task |
| `[ui]` | `ui-engineer` | sonnet | Fresh per task |
| `[worker]` | `worker-engineer` | haiku | Fresh per task |

Benefits:
- **No context rot** — each task starts with a clean context window
- **Predictable quality** — task 10 executes with the same quality as task 1
- **Safe failures** — a failed task doesn't pollute subsequent tasks
- **Better resumability** — re-spawning picks up cleanly from the last `- [x]` in PLAN.md

The orchestrator maintains a **task ledger** (in-memory) tracking each completed task's output files and exports, passing relevant upstream context to dependent tasks via the HANDOFF `UPSTREAM:` field.

Rules:
- The orchestrator never writes implementation code directly
- Each subagent reads spec/design/context/rules independently (fresh load)
- Auto-fix attempts within a subagent count toward the shared budget in PLAN.md
- In team mode (`/dev --team`), parallel groups may use Agent Teams for multi-task coordination within a group, but individual tasks still get fresh context

## Context Management
- Mark each task `[x]` in PLAN.md immediately upon completion
- Keep STATE.md under 100 lines — archive old entries to feature history

## Excluded Paths
Do not read: `node_modules/`, `.next/`, `dist/`, `.turbo/`, `.cache/`, lock files

## PLAN.md Task Format

```
- [ ] [domain] Task description → target file(s) (REQ-NNN) model:haiku|sonnet [wave:N]
```

**`wave` field rules**:
- Tasks sharing the same `wave:N` (e.g., `wave:1`) can execute simultaneously
- Waves execute in numeric order: all `wave:1` tasks complete before any `wave:2` tasks begin
- Between waves, the orchestrator syncs the task ledger (files + exports from completed tasks)
- Omit the field for sequential execution (default, compatible with solo mode)
- Never assign the same file to two tasks in the same wave
- Solo mode: waves are dispatched as concurrent subagents; team mode: waves map to parallel groups
- Backward compat: `parallel:A` = `wave:1`, `parallel:B` = `wave:2`, etc.

## Plan Approval Protocol
- PLAN.md must include `## Approval` with `Status:` and `Approved-at:` fields
- Planner sets `Status: pending`; updates to `approved` only after user confirmation
- Lead-engineer must verify `Status: approved` before starting

## Code Quality Rules (all agents)

API routes (`app/api/`) and server actions (`actions/`) MUST:
- Wrap the entire handler in `try/catch` — return structured `{ code, message }` errors
- Validate ALL input at the boundary with Zod `.parse()` or `.safeParse()`
- Classify errors by status: 400 (validation), 401 (auth), 404 (not found), 500 (internal)
- Never swallow errors silently — log or propagate
- Never return hardcoded stub data if a database schema exists for the target data
- Extract magic numbers and strings into named constants

All source files MUST:
- Use strict TypeScript — no `any`, no `as unknown` type assertions
- Follow single responsibility — one concern per function, under 30 lines preferred
- Read the relevant quality skill (error-handling-patterns, clean-code) when the task involves error paths or complex logic

## Document Sync on Modification

When a feature's spec.md is modified (not initial creation):
- **CONTEXT.md**: Review and update all "Locked Decisions" that are affected. Stale decisions MUST be corrected — they take priority over spec for downstream agents.
- **design.md**: Update Data Flow, Technical Decisions, and Component sections if the change affects architecture, auth mechanism, data format, or API contracts.
- **Dependent features**: Check `spec/ARCHITECTURE.md` for features that list this feature in their `deps`. Flag breaking changes to the user.
- **History entry**: Create `spec/feature/[name]/history/YYYY-MM-DD-[description].md` for every modification.

This rule prevents stale CONTEXT.md from overriding correct spec.md during `/dev`.

## Prohibited Actions
- Do not modify immutable `_` prefixed rule files
- Do not modify spec.md or design.md during `/dev` without user approval
- Do not skip `checkpoint:auth-gate` under any circumstances
- Do not commit directly to main/master

## Extended References
Read ONLY when the condition applies to your current task:
- `spec/rules/_document-format.md` — when writing spec.md, design.md, or history entries
- `spec/rules/_model-routing.md` — when deciding which model to assign to an agent
- `spec/rules/_delegation.md` — when spawning sub-agents or resuming interrupted sessions
- `spec/rules/_verification.md` — when running or understanding verification levels
- `spec/rules/_loop-protocol.md` — when running /loop
- `spec/rules/_agent-roles.md` — when checking agent boundaries or responsibilities
- `spec/rules/_nextjs-ordering.md` — when project is Next.js
- `spec/rules/_skill-budget.md` — when deciding which skills to read (budget limits per agent)
- `spec/rules/_artifact-limits.md` — advisory line limits for spec documents (prevents context bloat)
