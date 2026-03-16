---
name: dev
description: Implement a feature. Supports resuming interrupted work. Reads spec/feature/[name]/spec.md and design.md, generates PLAN.md inside the feature directory, waits for user confirmation, then implements and verifies the feature.
argument-hint: "[feature name]"
context: fork
---

## Resume Protocol

Before starting, read `spec/STATE.md` and find the target feature's phase under `## Features`.

### Feature name resolution:
- If `$ARGUMENTS` is provided, use it as the feature name.
- If `$ARGUMENTS` is empty, look for features with non-idle phases in `spec/STATE.md`.
  - If exactly one non-idle feature exists, use it.
  - If multiple non-idle features exist, list them and ask the user which to continue.
  - If all features are idle, ask the user which feature to work on.

### Model selection

The planner writes a `## Model Assignment` section in the feature's PLAN.md with the recommended model for each agent.
When spawning agents, read PLAN.md and use the assigned model:
- **planner**: always sonnet (no PLAN.md exists yet at this point)
- **executor**: read `executor:` from PLAN.md `## Model Assignment`
- **verifier**: read `verifier:` from PLAN.md `## Model Assignment` (typically haiku)

If `## Model Assignment` is missing (old plan), default to sonnet.

### Phase-based routing:

- **`idle` (or no entry)** → Fresh start. Spawn `planner` agent (always sonnet) with: `Implement the following feature: $ARGUMENTS`
- **`planning`** → Planner was interrupted. Check if `spec/feature/[name]/PLAN.md` exists:
  - If PLAN.md exists with `Status: approved`:
    - **Staleness check**: Compare spec.md modification with PLAN.md Created date. If spec.md is newer, warn the user: "spec.md has been updated since this plan was created. Re-plan with `/dev [feature]` after resetting phase to idle, or proceed with the existing plan?" Wait for user response.
    - If proceeding: Update feature phase to `executing` in STATE.md, read model from PLAN.md, then spawn `executor` agent with resume prompt (see below).
  - If PLAN.md exists with `Status: pending` → Spawn `planner` agent with: `PLAN.md already exists with Status: pending for feature "[feature-name]". Present it to the user for approval and proceed.`
  - If PLAN.md does not exist → Spawn `planner` agent to restart planning.
- **`executing`** → Executor was interrupted. Read model from PLAN.md `## Model Assignment`, then spawn `executor` agent with resume prompt:
  ```
  Resume implementing feature "[feature-name]".
  This is a RESUMED session — some tasks in PLAN.md may already be marked [x].
  Skip completed tasks and continue from the first unchecked task.
  PLAN.md and CONTEXT.md are at spec/feature/[feature-name]/PLAN.md and spec/feature/[feature-name]/CONTEXT.md.
  Feature spec: spec/feature/[feature-name]/spec.md
  Feature design: spec/feature/[feature-name]/design.md
  ```
- **`verifying`** → Verifier was interrupted. Read executor model from PLAN.md, spawn `executor` agent with:
  (Note: executor is spawned instead of verifier directly because executor manages the verifier failure → fix → re-verify loop and tracks the auto-fix budget.)
  ```
  Resume implementing feature "[feature-name]".
  All tasks were completed but verification was interrupted.
  Re-spawn the verifier agent to verify the implementation.
  PLAN.md and CONTEXT.md are at spec/feature/[feature-name]/PLAN.md and spec/feature/[feature-name]/CONTEXT.md.
  Feature spec: spec/feature/[feature-name]/spec.md
  Feature design: spec/feature/[feature-name]/design.md
  ```

---

Implement the following feature:

$ARGUMENTS
