---
name: brainstorm
description: "Explore and validate feature design before writing specs. Uses Socratic questioning to refine the idea, compares 2-3 approaches with trade-offs, and produces a design summary approved by the user before handing off to /spec."
argument-hint: "[feature description]"
context: fork
---

## Model selection

Brainstorming always requires reasoning and design judgment → spawn `brainstormer` with `model: sonnet`.

## Task

Spawn `brainstormer` agent (sonnet) with the following prompt:

```
[HANDOFF]
TO: brainstormer (sonnet)
TASK: Brainstorm feature design based on the following description
DONE-WHEN:
  - User has approved the final design summary
  - A concise spec-ready summary has been presented
MUST-NOT:
  - Write or modify any source code
  - Write spec.md or design.md (that is /spec's job)
  - Proceed past any phase without user approval
READS:
  - spec/ARCHITECTURE.md
  - spec/PROJECT.md
  - spec/feature/ (scan existing features)
[/HANDOFF]

$ARGUMENTS
```
