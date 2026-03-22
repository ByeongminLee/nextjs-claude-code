---
name: issue-reporter
description: Report a bug or feature request for the NCC plugin to GitHub. Sanitizes all project-specific and personal information before submission. Always asks for user confirmation before creating the issue. Use when encountering NCC plugin issues, bugs, or wanting to request new features.
argument-hint: "[bug or feature description]"
context: fork
---

## Task

Spawn `issue-reporter` agent (sonnet) with:

```
Report the following issue to the NCC plugin repository.
User description: $ARGUMENTS
```
