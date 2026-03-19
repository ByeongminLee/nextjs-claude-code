# Delegation Protocol

> **Immutable.** Read when spawning sub-agents or resuming interrupted sessions.

## HANDOFF Format

When spawning a sub-agent via the Agent tool, use this format:

```
[HANDOFF]
TO: agent-name (model)
TASK: One-line imperative description
DONE-WHEN:
  - Observable completion criterion 1
  - Observable completion criterion 2
MUST-NOT:
  - Explicit constraint 1
  - Explicit constraint 2
READS:
  - file path the sub-agent must read
[/HANDOFF]
```

Rules:
- DONE-WHEN must be observable (file exists, test passes, build succeeds) — not subjective
- MUST-NOT applies only to this specific handoff
- READS lists only essential files the agent doesn't already know to read
- Keep each handoff under 15 lines total
- All agent spawns must use this format — free-form prompts are not allowed

## Resume Protocol

If `/dev` is interrupted (session crash, timeout, context limit), running `/dev` again resumes:

- STATE.md tracks each feature's phase: `idle` -> `planning` -> `executing` -> `verifying` -> `idle`
- `/dev` reads the feature's phase and routes to the appropriate agent
- Completed tasks (`- [x]`) in PLAN.md are skipped on resume
- Auto-fix budget (`Used: N`) persists across sessions

| Phase | On `/dev` resume |
|---|---|
| `idle` | Fresh start -> planner |
| `planning` | Check PLAN.md -> resume or skip to lead-engineer |
| `executing` | Skip completed tasks -> continue from first `- [ ]` |
| `verifying` | Re-run verifier |
