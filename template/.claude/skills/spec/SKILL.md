---
name: spec
description: Define or update a feature specification. Provide a feature name and description with optional Figma link. Updates spec/feature/[name]/spec.md and design.md without touching source code.
argument-hint: "[feature-name] [description + optional Figma URL]"
context: fork
---

## Model selection

Assess task size per `spec/RULE.md` Model Routing rules:
- If updating an existing spec with minor changes (feature directory already exists, spec.md present) → spawn `spec-writer` with `model: haiku`
- If creating a new feature spec from scratch → spawn `spec-writer` with `model: sonnet`

## Task

Spawn `spec-writer` agent (with assessed model) with the following prompt:

```
Write or update the feature specification based on the following:
$ARGUMENTS
```
