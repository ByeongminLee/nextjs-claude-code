# Subagent Execution Rules

> **Immutable.** Compact rules for fresh-context subagents (task-executor, db-engineer, ui-engineer).
> For full orchestrator rules, see `_workflow.md`.

## Fresh Context Execution

You are running in a **fresh context window** — isolated per task with no carry-over from previous tasks. The lead-engineer orchestrator manages your lifecycle:
- Your scope is exactly ONE task from PLAN.md
- Upstream context is passed via `UPSTREAM:` in the HANDOFF — do not assume prior state
- Report results back via the completion report format in your agent file

## Code Quality

API routes/server actions MUST: try/catch with `{ code, message }` errors, Zod input validation, error classification (400/401/404/500), no silent swallowing, no stub data when schema exists, named constants.
All files MUST: strict TypeScript (no `any`), single responsibility (<30 lines), read quality skills for error/complex logic.
DRY: If the same logic appears in 2+ files, extract to `lib/` or `utils/`. Check existing shared modules before creating local helpers.

## Auto-fix Budget

You have **2 auto-fix attempts** per task. The orchestrator manages a **3-attempt session total** across all tasks (tracked in PLAN.md `Used: N`). If you exhaust your 2 attempts → STOP and report the error. The orchestrator decides whether to re-spawn you with remaining session budget.

## Checkpoints

If you detect any of these conditions during implementation, **do not act on them** — report in your completion report `Issues` field:
- `checkpoint:decision` — direction is unclear, needs user input
- `checkpoint:human-verify` — UI needs browser verification
- `checkpoint:auth-gate` — payment/auth flow, always requires user approval

## PLAN.md Task Format

```
- [ ] [domain] Task description → target (REQ-NNN) model:haiku|sonnet [wave:N]
```

## Prohibited Actions

- Do not modify `_` prefixed rule files
- Do not modify spec.md/design.md during `/dev` without user approval
- Do not spawn sub-agents (no Agent tool)
- Do not modify spec.md or design.md
- Do not modify PLAN.md, STATE.md, or CONTEXT.md — orchestrator (lead-engineer) only

## Before Starting (Standard Preamble)

Every subagent must complete these steps before implementation:

1. **Read the task specification** from the lead-engineer's spawn prompt
2. **Read `spec/rules/_subagent-rules.md`** (this file)
3. **Read `spec/rules/conventions.md`** — coding conventions
4. **Read the feature's `spec.md`** — requirements
5. **Read the feature's `design.md`** — architecture decisions
6. **Read the feature's `CONTEXT.md`** — locked decisions (non-negotiable)
7. **Read target files** — if modifying existing files, always read them first
8. **Read upstream outputs** — files from previous tasks listed in UPSTREAM

Domain-specific additions:
- `[db]` agents: also read `spec/PROJECT.md` for ORM detection, skip UI rule files
- `[ui]` agents: also read `spec/PROJECT.md` for UI framework detection, load Figma context if available, skip DB rule files
- `[lead]` agents: also read `testing.md` if task creates tests

## Excluded Paths

`node_modules/`, `.next/`, `dist/`, `.turbo/`, `.cache/`, lock files
