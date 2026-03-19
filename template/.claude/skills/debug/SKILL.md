---
name: debug
description: Systematically analyze and fix a bug. Uses hypothesis-driven debugging, records the process in spec/DEBUG.md, and updates spec/STATE.md on resolution.
argument-hint: "[bug symptom or description]"
context: fork
---

## Model selection

Assess task size per `spec/rules/_model-routing.md`:
- If the bug description references a single file or a clear, localized symptom → spawn `debugger` with `model: haiku`
- If the bug is cross-feature, involves unclear reproduction, or could have multiple root causes → spawn `debugger` with `model: sonnet`
- If unsure → default to `model: sonnet`

## Task

Spawn `debugger` agent (with assessed model) with the following prompt:

```
Analyze and fix the following bug:
$ARGUMENTS
```
