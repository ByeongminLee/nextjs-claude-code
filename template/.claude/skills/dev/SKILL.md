---
name: dev
description: Implement a feature. Supports resuming interrupted work and team mode (--team flag). Reads spec/feature/[name]/spec.md and design.md, generates PLAN.md inside the feature directory, waits for user confirmation, then implements and verifies the feature.
argument-hint: "[feature name] [--team]"
context: fork
---

## Argument Parsing

Parse `$ARGUMENTS` before anything else:

1. If `$ARGUMENTS` contains `--team`:
   - Remove `--team` from arguments → remaining text = feature name (trimmed)
   - Set **MODE = team**
2. Otherwise:
   - Feature name = `$ARGUMENTS` as-is
   - Set **MODE = solo**

## Resume Protocol

Before starting, read `spec/STATE.md` and find the target feature's phase under `## Features`.

### Feature name resolution:
- If feature name (after parsing) is provided, use it.
- If feature name is empty, look for features with non-idle phases in `spec/STATE.md`.
  - If exactly one non-idle feature exists, use it.
  - If multiple non-idle features exist, list them and ask the user which to continue.
  - If all features are idle, ask the user which feature to work on.

### Mode detection on resume:
When resuming (phase is not `idle`), MODE is determined by the existing PLAN.md:
- If `spec/feature/[name]/PLAN.md` contains `## Team Composition` → MODE = team
- Otherwise → MODE = solo

The `--team` flag is only needed for fresh starts. Resume auto-detects from PLAN.md.

### Model selection

The planner writes a `## Model Assignment` section in the feature's PLAN.md with the recommended model for each agent.
When spawning agents, read PLAN.md and use the assigned model:
- **planner**: always sonnet (no PLAN.md exists yet at this point)
- **lead-engineer**: read `lead-engineer:` from PLAN.md `## Model Assignment`
- **verifier**: always haiku (fixed — see `spec/rules/_model-routing.md`)

If `## Model Assignment` is missing for lead-engineer, default to sonnet.

### Phase-based routing:

- **`idle` (or no entry)** → Fresh start. Spawn `planner` agent (always sonnet).

  **MODE = solo:**
  ```
  [HANDOFF]
  TO: planner (sonnet)
  TASK: Create implementation plan for feature "[feature-name]"
  DONE-WHEN:
    - PLAN.md created with Status: approved
    - CONTEXT.md created
    - Lead-engineer spawned and running
  MUST-NOT:
    - Start implementation before user confirms
    - Create plan without reading spec.md and design.md
  READS:
    - spec/feature/[feature-name]/spec.md
    - spec/feature/[feature-name]/design.md
  [/HANDOFF]
  ```

  **MODE = team:**
  ```
  [HANDOFF]
  TO: planner (sonnet)
  TASK: Create team implementation plan for feature "[feature-name]"
  MODE: team
  DONE-WHEN:
    - PLAN.md created with Status: approved
    - Team Composition section included with engineer assignments
    - CONTEXT.md created
    - Lead-engineer spawned and running
  MUST-NOT:
    - Start implementation before user confirms
    - Skip domain analysis and task tagging
    - Create plan without reading spec.md and design.md
  READS:
    - spec/feature/[feature-name]/spec.md
    - spec/feature/[feature-name]/design.md
  [/HANDOFF]
  ```

- **`planning`** → Planner was interrupted. Check if `spec/feature/[name]/PLAN.md` exists:
  - If PLAN.md exists with `Status: approved`:
    - **Staleness check**: Compare spec.md modification with PLAN.md Created date. If spec.md is newer, warn the user: "spec.md has been updated since this plan was created. Re-plan with `/dev [feature]` after resetting phase to idle, or proceed with the existing plan?" Wait for user response.
    - If proceeding: Update feature phase to `executing` in STATE.md, read model from PLAN.md, then spawn `lead-engineer` agent using the same `[HANDOFF]` format as the `executing` phase below.
  - If PLAN.md exists with `Status: pending` → Spawn `planner` agent with:
    ```
    [HANDOFF]
    TO: planner (sonnet)
    TASK: Present pending PLAN.md for feature "[feature-name]" to user for approval
    DONE-WHEN:
      - User approves plan
      - PLAN.md Status updated to approved
      - Lead-engineer spawned
    MUST-NOT:
      - Rewrite the existing plan from scratch
    READS:
      - spec/feature/[feature-name]/PLAN.md
    [/HANDOFF]
    ```
  - If PLAN.md does not exist → Spawn `planner` agent using the same `[HANDOFF]` format as the `idle` phase above (with MODE).
- **`executing`** → Lead-engineer was interrupted. Read model from PLAN.md `## Model Assignment`, then spawn `lead-engineer` agent:
  ```
  [HANDOFF]
  TO: lead-engineer ({model from PLAN.md})
  TASK: Resume implementing feature "[feature-name]" (skip completed tasks)
  DONE-WHEN:
    - All tasks in PLAN.md marked [x]
    - npx tsc --noEmit passes
    - Verifier passes Level 1-3
  MUST-NOT:
    - Re-do tasks already marked [x]
    - Modify spec.md or design.md
  READS:
    - spec/feature/[feature-name]/PLAN.md
    - spec/feature/[feature-name]/CONTEXT.md
  [/HANDOFF]
  ```
- **`verifying`** → Verifier was interrupted. Read lead-engineer model from PLAN.md, spawn `lead-engineer` agent with:
  (Note: lead-engineer is spawned instead of verifier directly because lead-engineer manages the verification failure → auto-fix → re-verify loop and tracks the auto-fix budget. Even on a simple re-run, routing through lead-engineer ensures the budget counter stays consistent across sessions.)
  ```
  [HANDOFF]
  TO: lead-engineer ({model from PLAN.md})
  TASK: Resume verification for feature "[feature-name]" (all tasks done, re-run verifier)
  DONE-WHEN:
    - Verifier passes Level 1-3
    - Level 4 checkpoint:human-verify presented
  MUST-NOT:
    - Re-implement completed tasks
    - Modify spec.md or design.md
  READS:
    - spec/feature/[feature-name]/PLAN.md
    - spec/feature/[feature-name]/CONTEXT.md
  [/HANDOFF]
  ```
- **`looping`** → Feature is in a `/loop` cycle. Do NOT start `/dev` flow.
  Report to the user:
  ```
  Feature "[feature-name]" is currently in looping phase (managed by /loop).
  - To continue the loop: run `/loop [feature-name]`
  - To restart from scratch: manually set the phase to idle in spec/STATE.md, then run `/dev [feature-name]`
  ```
  Stop here — do not spawn any agent.

---

Implement the following feature:

$ARGUMENTS
