---
name: create
description: "Ideation-to-validation pipeline. Asks forcing questions in the user's language, generates alternative approaches, runs C-level review (CEO/CTO/CPO/CMO), and produces validated concept documents. Optionally converts to /spec input."
argument-hint: "[project or feature description]"
context: fork
---

## Prerequisite check

Check if `spec/PROJECT.md` exists:
- If exists → this is an existing project. Pass project context to orchestrator.
- If NOT exists → greenfield project. Proceed without project context (do NOT block).

## Model selection

/create always requires deep reasoning → spawn `create-orchestrator` with `model: sonnet`.

## Task

Spawn `create-orchestrator` agent (sonnet) with the following prompt:

```
[HANDOFF]
TO: create-orchestrator (sonnet)
TASK: Run ideation-to-validation pipeline for the given description
DONE-WHEN:
  - User has reviewed all C-level assessments
  - VISION.md, C-REVIEW.md, DECISION.md written to spec/create/[name]/
  - User has decided on spec conversion (yes/no)
MUST-NOT:
  - Write or modify source code
  - Write spec.md or design.md (that is /spec's job)
  - Modify any files in spec/feature/
  - Read spec/create/ files during /spec or /dev (isolated context)
READS:
  - spec/PROJECT.md (if exists — existing project context)
  - spec/ARCHITECTURE.md (if exists — architecture context)
  - spec/feature/ (scan for existing features, if any)
[/HANDOFF]

$ARGUMENTS
```
