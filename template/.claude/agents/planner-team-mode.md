# Planner — Team Mode Reference

> Read when the handoff from /dev includes MODE: team.

## Team Composition (only when MODE: team)

If the handoff from `/dev` includes `MODE: team`:

Determine which engineers are needed per `spec/rules/_agent-roles.md` > Team Mode table.

Add `## Team Composition` section to PLAN.md:
```markdown
## Team Composition
Mode: team
Engineers:
  - lead-engineer (sonnet) — tasks: [numbers]
  - db-engineer (sonnet) — tasks: [numbers]
  - ui-engineer (sonnet) — tasks: [numbers]
Workers (subagent):
  - worker-engineer (haiku) — tasks: [numbers]

Task Dependencies:
  - Task N [tag] → Task M [tag]
```

If MODE is not `team` (solo mode):
- Still tag tasks with `[worker]` where applicable (lead will spawn worker subagents)
- Do NOT add `## Team Composition` section
- Other domain tags (`[lead]`, `[db]`, `[ui]`) are optional in solo mode but can be included for clarity
