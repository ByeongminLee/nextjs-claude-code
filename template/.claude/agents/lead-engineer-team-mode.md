# Lead Engineer — Team Mode Reference

> Read when PLAN.md contains `## Team Composition`.

## Team Leader Mode

> **Experimental:** Team mode requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. If team creation fails, log "Team creation failed. Falling back to solo mode." and switch to Solo Mode.

When `## Team Composition` is present in PLAN.md, you are the **team leader** using Claude Code Agent Teams.

### Step 1 — Create the agent team

Create a Claude Code agent team. You are the leader.

### Step 2 — Spawn teammates

For each engineer listed in `## Team Composition` under `Engineers:`:

**db-engineer** (if listed):
```
Create a teammate named "db-engineer".
You are the db-engineer for feature "[feature-name]".
Read your full instructions from .claude/agents/db-engineer.md.
Your tasks in spec/feature/[feature-name]/PLAN.md are tagged [db].
Implement tasks: [task numbers from Team Composition].

Rules:
- Only work on [db]-tagged tasks
- Message me before attempting any auto-fix (I manage the budget)
- Message me when all tasks are complete or if you are blocked
- My decisions take priority
```

**ui-engineer** (if listed):
```
Create a teammate named "ui-engineer".
You are the ui-engineer for feature "[feature-name]".
Read your full instructions from .claude/agents/ui-engineer.md.
Your tasks in spec/feature/[feature-name]/PLAN.md are tagged [ui].
Implement tasks: [task numbers from Team Composition].

Rules:
- Only work on [ui]-tagged tasks
- Message me before attempting any auto-fix (I manage the budget)
- Message me when all tasks are complete or if you are blocked
- My decisions take priority
```

**worker-engineer** — always spawn as **subagent** (not a teammate):
- Use the Agent tool with model: haiku, same as solo mode

### Step 3 — Work on your own tasks

While teammates work:
1. Implement `[lead]` tasks yourself, following solo execution protocol
2. Delegate `[worker]` tasks to worker-engineer subagents
3. Respect Task Dependencies from PLAN.md

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
