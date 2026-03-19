# FeatureSpec Workflow Rules (Core)

> **Immutable.** Do not modify after `/init`. Project-specific coding rules belong in non-prefixed files in this directory.

## Folder Structure

```
spec/
  PROJECT.md             <- project purpose, tech stack, testing setup
  ARCHITECTURE.md        <- feature map, cross-feature dependencies
  STATE.md               <- all features and their current phases (multi-feature)
  DEBUG.md               <- debug log (created by /debug)
  rules/
    _workflow.md          <- THIS FILE (core workflow rules, immutable)
    _document-format.md   <- spec.md, design.md, history format
    _model-routing.md     <- model selection criteria
    _delegation.md        <- HANDOFF format, agent spawning rules
    _verification.md      <- 4-level verification protocol
    _loop-protocol.md     <- /loop rules and cross-iteration context
    _agent-roles.md       <- agent role boundaries and responsibilities
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
| `/spec` | Define or update a feature spec |
| `/dev` | Plan, implement, verify a feature. `--team` for parallel team mode |
| `/review` | Check spec compliance + code quality |
| `/status` | Show project status |
| `/debug` | Systematic bug fixing |
| `/rule` | Add or update a project coding rule |
| `/loop` | Loop until all REQs in spec.md are satisfied |

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
After 3 failed attempts: stop and escalate to user.

## Language
- Default language for spec documents is **English**
- If user writes in another language, match that language
- Section headers: **English or Korean** (recognized by `validate-spec.sh`)

## Context Management
- Mark each task `[x]` in PLAN.md immediately upon completion
- Keep STATE.md under 100 lines — archive old entries to feature history

## Excluded Paths
Do not read: `node_modules/`, `.next/`, `dist/`, `.turbo/`, `.cache/`, lock files

## Plan Approval Protocol
- PLAN.md must include `## Approval` with `Status:` and `Approved-at:` fields
- Planner sets `Status: pending`; updates to `approved` only after user confirmation
- Lead-engineer must verify `Status: approved` before starting

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
