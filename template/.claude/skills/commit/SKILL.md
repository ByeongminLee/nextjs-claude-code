---
name: commit
description: Analyze changes and create a commit with auto-generated message following the project's commit convention. Links to feature spec REQ numbers when a feature name is provided.
argument-hint: "[feature-name]"
context: fork
---

## Model selection

- If `$ARGUMENTS` contains a feature name → spawn with **sonnet** (REQ linking requires reading spec.md and mapping changes to requirements)
- If `$ARGUMENTS` is empty → spawn with **haiku** (simple diff analysis, no spec context needed)

## Task

Spawn `committer` agent (model per above) with:

```
Create a commit for the following changes.
Feature context: $ARGUMENTS
```
