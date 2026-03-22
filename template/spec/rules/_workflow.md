# FeatureSpec Workflow Rules (Core)

> **Immutable.** Project-specific rules belong in non-prefixed files.

## Folder Structure

```
spec/
  PROJECT.md, ARCHITECTURE.md, STATE.md, DEBUG.md, learnings/
  rules/_workflow.md, _document-format.md, _model-routing.md, _delegation.md,
        _verification.md, _loop-protocol.md, _agent-roles.md, _skill-budget.md,
        _nextjs-ordering.md, _artifact-limits.md, code-style.md, testing.md
  feature/[name]/ spec.md, design.md, PLAN.md, CONTEXT.md, LOOP_NOTES.md, history/
```

## STATE.md

Phases: `idle` | `existing` → `planning` → `executing` → `verifying` → `looping` → completed
- `idle`: no work started; fresh implementation
- `existing`: code detected during /init; run /spec before /dev
- Each feature's phase is independent
- Keep under 100 lines — archive completed entries

## Commands

`/init` `/create` `/brainstorm` `/spec` `/dev` `/dev --team` `/review` `/loop` `/debug` `/status` `/rule`

## Per-Task Review

During `/dev`, each task (except `[worker]`) gets a `task-spec-reviewer` (haiku) review.
Max 2 rounds. Rounds do NOT count toward auto-fix budget. After 2 fails → escalate.

## Checkpoints

Three types: `checkpoint:decision` (direction unclear → wait), `checkpoint:human-verify` (UI done → browser check), `checkpoint:auth-gate` (payment/auth → always stop). Details in `lead-engineer-completion.md`.

## Auto-fix Budget

Max retries: **3** per `/dev` session (persists via PLAN.md `Used: N`). `/loop`: resets per iteration. Cleanup doesn't count. After 3 → escalate.

## Fresh Context Execution

Lead-engineer dispatches each task to a fresh-context subagent:
`[lead]`→task-executor(sonnet), `[db]`→db-engineer(sonnet), `[ui]`→ui-engineer(sonnet), `[worker]`→worker-engineer(haiku)

Orchestrator maintains in-memory task ledger. Never writes code directly. Passes `UPSTREAM:` context to dependent tasks.

## PLAN.md Task Format

```
- [ ] [domain] Task description → target (REQ-NNN) model:haiku|sonnet [wave:N]
```

Wave rules: see `_delegation.md` > Wave Sync Protocol. Key: same wave = parallel, never same file in same wave.

## Plan Approval

`## Approval` with `Status:` + `Approved-at:` fields. Lead-engineer verifies `Status: approved` before starting.

## Code Quality (all agents)

API routes/server actions MUST: try/catch with `{ code, message }` errors, Zod input validation, error classification (400/401/404/500), no silent swallowing, no stub data when schema exists, named constants.
All files MUST: strict TypeScript (no `any`), single responsibility (<30 lines), read quality skills for error/complex logic.
DRY: If the same logic (Zod schemas, helpers, formatters) appears in 2+ files, extract to `lib/` or `utils/`. Check existing shared modules before creating local helpers.

## Document Sync on Modification

When spec.md is modified (not initial creation):
- **CONTEXT.md**: Update stale "Locked Decisions" — they override spec for downstream agents
- **design.md**: Update Data Flow, Technical Decisions if architecture/auth/API changes
- **Dependents**: Check ARCHITECTURE.md for reverse deps, flag breaking changes
- **History**: Create `history/YYYY-MM-DD-[description].md` for every modification

## Prohibited Actions

- Do not modify `_` prefixed rule files
- Do not modify spec.md/design.md during `/dev` without user approval
- Do not skip `checkpoint:auth-gate`
- Do not commit directly to main/master

## Excluded Paths

`node_modules/`, `.next/`, `dist/`, `.turbo/`, `.cache/`, lock files

## Extended References

Read ONLY when applicable: `_document-format.md`, `_model-routing.md`, `_delegation.md`, `_verification.md`, `_loop-protocol.md`, `_agent-roles.md`, `_nextjs-ordering.md`, `_skill-budget.md`, `_artifact-limits.md`
