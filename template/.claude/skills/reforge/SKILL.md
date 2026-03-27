---
name: reforge
description: "Transform an existing project into spec-driven development. Analyzes a legacy codebase from an external folder, accepts change specifications, and generates feature specs (spec.md + design.md) that blend existing logic with requested modifications. Auto-runs /init if needed."
argument-hint: "[path/to/legacy-project] [change description or 'interactive']"
context: fork
---

## Prerequisite check

1. **Parse arguments**: First token is the legacy folder path. Remaining tokens are the change description.
   - Example: `/reforge ./_legacy/old-project "Switch to App Router, add Tailwind"`
   - Legacy path: `./_legacy/old-project`, Description: `Switch to App Router, add Tailwind`
   - If no path provided, ask: "Please provide the path to the legacy project folder. (e.g., ./_legacy/old-project)"

2. **Verify legacy folder exists**: Check that the specified path exists and contains `package.json`.
   - If not exists → output: "No project found at: [path]\nClone the legacy project first: `git clone [repo-url] [path]`" → **STOP**

3. **Auto-init current project**: Check if `spec/PROJECT.md` exists.
   - If exists → pass project context to orchestrator.
   - If NOT exists → spawn `init` agent (sonnet) first to analyze current project, then proceed to reforge.

## Model selection

/reforge always requires deep reasoning → spawn `reforge-orchestrator` with `model: sonnet`.

## Task

Spawn `reforge-orchestrator` agent (sonnet) with the following prompt:

```
[HANDOFF]
TO: reforge-orchestrator (sonnet)
TASK: Run legacy-to-spec transformation pipeline
LEGACY_PATH: [parsed legacy folder path]
DESCRIPTION: [parsed change description]
AUTO_INIT: [true if /init was auto-executed, false otherwise]
DONE-WHEN:
  - ANALYSIS.md, CHANGES.md, DELTA.md, DECISION.md written to spec/reforge/[name]/
  - spec.md + design.md generated for each in-scope feature in spec/feature/[name]/
  - User has reviewed and approved generated specs
  - Recommended /dev execution order presented
MUST-NOT:
  - Modify any files in the legacy folder (read-only)
  - Write or modify source code in current project
  - Modify existing non-DRAFT spec files without user approval
READS:
  - [legacy folder path]/** (read-only, Phase 1 only)
  - spec/PROJECT.md (current project context)
  - spec/ARCHITECTURE.md (current project architecture)
[/HANDOFF]

$ARGUMENTS
```
