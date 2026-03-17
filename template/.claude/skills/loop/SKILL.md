---
name: loop
description: Force-complete a feature by looping until all REQs in spec.md are satisfied. Runs reviewer → targeted lead-engineer → re-review cycle. Use after /dev when you want guaranteed spec compliance.
argument-hint: "[feature name]"
context: fork
agent: loop
---

Force-complete the following feature by looping until all REQ items in spec.md are satisfied:

$ARGUMENTS
