---
name: pr
description: Create a pull request with auto-generated body from feature spec. Auto-detects target branch from GIT_STRATEGY.md. Optionally updates changelog and bumps version.
argument-hint: "[feature-name] [target-branch]"
context: fork
---

Spawn `pr-creator` agent (sonnet) with:

```
Create a pull request for the current branch.
Arguments: $ARGUMENTS
```
