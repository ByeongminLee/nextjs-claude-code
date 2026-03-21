# Delegation Protocol

> **Immutable.** Read when spawning sub-agents or resuming interrupted sessions.

## HANDOFF Format

When spawning a sub-agent via the Agent tool, use this format:

```
[HANDOFF]
TO: agent-name (model)
TASK: One-line imperative description
DONE-WHEN:
  - Observable completion criterion 1
  - Observable completion criterion 2
MUST-NOT:
  - Explicit constraint 1
  - Explicit constraint 2
READS:
  - file path the sub-agent must read
[/HANDOFF]
```

Rules:
- DONE-WHEN must be observable (file exists, test passes, build succeeds) — not subjective
- MUST-NOT applies only to this specific handoff
- READS lists only essential files the agent doesn't already know to read
- UPSTREAM (optional) lists files and exports from previous tasks that this task depends on
- Keep each handoff under 20 lines total
- All agent spawns must use this format — free-form prompts are not allowed

## Fresh Context HANDOFF

When the lead-engineer orchestrator dispatches a task to a fresh-context subagent, use this extended format:

```
[HANDOFF]
TO: {agent-name} ({model})
TASK: Implement Task N of feature "[feature-name]": [task description from PLAN.md]
DONE-WHEN:
  - File created/modified as specified
  - npx tsc --noEmit passes
MUST-NOT:
  - Modify files beyond the task's target scope
  - Make architectural decisions
READS:
  - spec/feature/[feature-name]/spec.md
  - spec/feature/[feature-name]/design.md
  - spec/feature/[feature-name]/CONTEXT.md
  - spec/rules/
UPSTREAM:
  - Task M created [files] exporting [exports]
[/HANDOFF]
```

The `UPSTREAM:` section is critical for fresh-context subagents — they have no memory of previous tasks. Include only entries that this task directly depends on (not the full ledger).

## Wave Sync Protocol

When using `wave:N` fields in PLAN.md:

1. **Within a wave**: dispatch all tasks in the same wave simultaneously (parallel subagents or teammates)
2. **Wave boundary**: after all tasks in wave N complete:
   - Collect all `[Task Complete]` reports
   - Update the task ledger with files and exports from each task
   - Mark all wave N tasks as `[x]` in PLAN.md
   - Only then start dispatching wave N+1 tasks with updated `UPSTREAM:` context
3. **Failure in a wave**: if any task in wave N fails, retry within auto-fix budget. Do NOT start wave N+1 until all wave N tasks succeed or are escalated.
4. **Solo mode**: concurrent Agent tool calls for same-wave tasks
5. **Team mode**: map waves to teammate coordination — teammates for multi-task domains, subagents for single tasks

## Resume Protocol

If `/dev` is interrupted (session crash, timeout, context limit), running `/dev` again resumes:

- STATE.md tracks each feature's phase: `idle` -> `planning` -> `executing` -> `verifying` -> `idle`
- `/dev` reads the feature's phase and routes to the appropriate agent
- Completed tasks (`- [x]`) in PLAN.md are skipped on resume
- Auto-fix budget (`Used: N`) persists across sessions

| Phase | On `/dev` resume |
|---|---|
| `idle` | Fresh start -> planner |
| `planning` | PLAN.md exists + `Status: pending` → show existing plan to user, request approval. PLAN.md exists + `Status: approved` → skip to lead-engineer. PLAN.md missing → re-run planner |
| `executing` | Skip completed tasks -> continue from first `- [ ]` (see Partial State Recovery below) |
| `executing` (PLAN.md missing) | Reset to `idle` in STATE.md, warn user, restart from planner |
| `verifying` | Re-run verifier |

## Partial State Recovery

When resuming `executing` phase, the current task (first `- [ ]`) may have been partially completed before the crash:

1. Check if the task's target files already exist
2. If they exist, inspect for stub indicators (TODO, empty functions, placeholder values)
3. If incomplete, rewrite the file from scratch (overwrite partial code)
4. Do NOT count partial attempts toward auto-fix budget — crashes are not agent failures
