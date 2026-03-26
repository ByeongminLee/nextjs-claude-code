# Artifact Size Limits (Core)

> **Immutable.** Context budget rules for stable long-running execution.

| Artifact | Max Lines | Overflow Strategy |
|----------|-----------|-------------------|
| PROJECT.md | 80 | Move detailed stack info to ARCHITECTURE.md |
| ARCHITECTURE.md | 120 | Move detailed designs to feature/design.md |
| STATE.md | 100 | Archive completed features to history/ |
| spec.md | 150 | Move background context to CONTEXT.md |
| design.md | 200 | Move implementation details to PLAN.md tasks |
| PLAN.md | 100 | Collapse completed tasks, keep `[x]` one-liners |
| CONTEXT.md | 50 | Keep only non-negotiable decisions |
| LOOP_NOTES.md | 50 | Keep only current iteration context |
| VISION.md (create) | 80 | Keep concise — Problem, Demand, Approach sections |
| C-REVIEW.md (create) | 100 | One section per C-level + summary |
| DECISION.md (create) | 60 | Approach + key decisions only |
| ANALYSIS.md (reforge) | 150 | Split per-feature to spec/reforge/[name]/analysis/ |
| CHANGES.md (reforge) | 80 | Keep transformations concise |
| DELTA.md (reforge) | 120 | Collapse completed features |
| DECISION.md (reforge) | 60 | Summary only |
| SOURCE.md (reforge) | 10 | Path + status only |

Rules:
- Hard-gate artifacts: `PLAN.md`, `CONTEXT.md`, `LOOP_NOTES.md`
- Soft-gate artifacts: all others in this table
- Hard-gate overflow must be compacted before continuing implementation or verification
- Soft-gate overflow triggers warning and should be compacted in the same session
- When a file exceeds its limit, split content to the suggested overflow target
- Completed entries in STATE.md should be archived (date only, no details)
- PLAN.md completed tasks can be collapsed to single `[x]` lines without descriptions

## Enforcement protocol

If a hard-gate artifact exceeds its limit:
1. Stop task dispatch immediately.
2. Emit `checkpoint:decision` with a compaction plan.
3. Compact the artifact to its limit.
4. Resume only after compaction is complete.

If a soft-gate artifact exceeds its limit:
1. Emit a warning.
2. Continue current task.
3. Compact before phase completion.

## Why Limits Matter

Large spec artifacts consume context budget in every subagent that reads them. A 200-line spec.md means each of the 10 task-executors loads 200 lines of context that may be irrelevant to their specific task. Keeping artifacts lean improves:
- Subagent response quality (less noise)
- Token efficiency (lower cost per task)
- Resume speed (faster STATE.md parsing)
