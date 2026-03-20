# Learnings

This folder accumulates patterns and lessons discovered during development.
Each entry is written by the `learning-extractor` agent after `/loop` or `/debug` sessions.

## When entries are created

- After `/loop` completes (success or exhaustion) — patterns from repeated failures
- After `/debug` resolves a bug — root cause patterns worth remembering

## File format

Filename: `YYYY-MM-DD-[topic].md`

Example: `2024-03-15-auth-cookie-samesite.md`

## Entry structure

```markdown
## Pattern
[Concise description of the recurring pattern or mistake]

## Root Cause
[Why this keeps happening]

## Solution
[The approach that worked]

## Rule Candidate
[Optional: a rule that could be added to spec/rules/ to prevent recurrence]
> Add to: spec/rules/[filename].md

## Affected Features
- feature-name (YYYY-MM-DD)
```

## Using learnings

Before starting a new `/dev` or `/loop`:
- Scan this folder for patterns relevant to the feature
- If a Rule Candidate hasn't been added to `spec/rules/` yet, consider doing so via `/rule`
