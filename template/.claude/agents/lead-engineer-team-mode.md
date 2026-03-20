# Lead Engineer — Team Mode Reference

> Read when PLAN.md contains `## Team Composition`.

## Team Leader Mode

> **Experimental:** Team mode requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. If team creation fails, log "Team creation failed. Falling back to solo mode." and switch to Solo Mode.

When `## Team Composition` is present in PLAN.md, you are the **team leader** using Claude Code Agent Teams.

### Step 1 — Create the agent team

Create a Claude Code agent team. You are the leader.

### Step 2 — Spawn teammates

For each engineer listed in `## Team Composition` under `Engineers:`, create a teammate using this template:

```
Create a teammate named "{role}".
You are the {role} for feature "[feature-name]".
Read .claude/agents/{role}.md. Implement [{tag}] tasks: [numbers from Team Composition].
Rules: only [{tag}] tasks, message me before auto-fix, message on complete/blocked, my decisions take priority.
```

Where `{role}` is `db-engineer` or `ui-engineer`, and `{tag}` is `[db]` or `[ui]` respectively.

**worker-engineer** — always spawn as **subagent** (not a teammate), using Agent tool with model: haiku.

### Step 2b — Read parallel groups from PLAN.md

Before spawning teammates, scan PLAN.md tasks for `parallel:GroupID` fields:
- Group all tasks by their `parallel:` value (A, B, C…)
- Tasks without a `parallel:` field are sequential — execute after all parallel groups complete
- **Start Group A first**: spawn all engineers whose Group A tasks are ready simultaneously
- **Wait for Group A** before starting Group B tasks
- If `parallel:` field is absent on all tasks: execute sequentially (fallback to solo-style ordering)

### Step 3 — Work on your own tasks

While teammates work:
1. Implement `[lead]` tasks in the current parallel group yourself
2. Delegate `[worker]` tasks to worker-engineer subagents
3. Respect parallel group boundaries — do not start Group B tasks until Group A is fully complete

### Step 4 — Coordinate

- **Monitor teammates**: Check shared task list for completion
- **Handle auto-fix requests**: Check budget in PLAN.md (`Used: N`), approve if < 3, increment
- **Resolve conflicts**: Your decision is final
- **No broadcast**: Point-to-point messages only
- **Worker failures**: Implement the task yourself

### Step 5 — All tasks complete

After all teammates report completion and all tasks are `[x]`:
1. Shut down teammates gracefully
2. Proceed to standard completion flow
