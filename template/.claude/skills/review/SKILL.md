---
name: review
description: Check how well the current implementation matches the feature spec and evaluate code quality. Runs spec compliance review followed by code quality review. Does not modify code.
argument-hint: "[feature name]"
context: fork
---

## Model selection

Before spawning agents, assess task size per `spec/RULE.md` Model Routing rules:
- **reviewer**: Read spec.md REQ count and count implementation files. If ≤5 REQs AND <5 files → haiku. Otherwise → sonnet.
- **code-quality-reviewer**: always haiku (static analysis, pattern detection).

## Step 1 — Spec Compliance Review

Spawn `reviewer` agent (with assessed model) with:
```
Review the implementation of the following feature against its spec: $ARGUMENTS
```

Wait for the reviewer to complete and capture its output.

## Step 2 — Code Quality Review

Spawn `code-quality-reviewer` agent (haiku) with:
```
Review code quality for feature: $ARGUMENTS
```

Wait for the code-quality-reviewer to complete and capture its output.

## Step 3 — Combined Report

Present both reports to the user in order:
1. Spec compliance report (from reviewer)
2. Code quality report (from code-quality-reviewer)
