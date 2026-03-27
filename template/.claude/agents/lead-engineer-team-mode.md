# Lead Engineer — Team Mode Reference

> Read when PLAN.md contains `## Team Composition`.

## Team Leader Mode

> **Experimental:** Team mode requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. If team creation fails, log "Team creation failed. Falling back to Fresh Context solo mode." and switch to Solo Mode (fresh-context orchestration).

When `## Team Composition` is present in PLAN.md, you are the **team leader** using Claude Code Agent Teams.

Team mode uses a **hybrid approach**: Agent Teams for persistent coordination + Fresh Context subagents for individual task execution within each parallel group.

### Step 1 — Create the agent team

Create a Claude Code agent team. You are the leader.

### Step 2 — Read waves from PLAN.md

Scan PLAN.md tasks for `wave:N` fields (or legacy `parallel:GroupID`):
- Group all tasks by their `wave:` value (1, 2, 3…)
- Legacy support: `parallel:A` = `wave:1`, `parallel:B` = `wave:2`, etc.
- Tasks without a `wave:` or `parallel:` field are sequential — execute after all waves complete
- Waves execute in numeric order: all `wave:1` tasks before any `wave:2` tasks
- If neither field is present on any task: execute sequentially using Fresh Context solo mode

### Step 3 — Execute waves

For each wave (1, then 2, then 3…):

1. **Spawn teammates** for multi-task domains within this group:
   - If this group has 2+ `[db]` tasks → create a `db-engineer` teammate for those tasks
   - If this group has 2+ `[ui]` tasks → create a `ui-engineer` teammate for those tasks
   - Teammates use **Team mode** (multi-task) execution within their agent

2. **Dispatch single tasks as fresh-context subagents**:
   - `[lead]` tasks → spawn `task-executor` subagent (per task)
   - Single `[db]` or `[ui]` tasks in this group → spawn as fresh-context subagent (single-task mode)

3. **Run all dispatches for this group in parallel** — teammates and subagents execute simultaneously

4. **Wait for all tasks in this group to complete** before starting the next group

5. **Mark tasks done** in PLAN.md: `- [x] Task N`

### Step 4 — Coordinate

- **Monitor**: Track subagent completion reports and teammate messages
- **Handle auto-fix requests** (from teammates): Check budget in PLAN.md (`Used: N`), approve if < 3, increment
- **Resolve conflicts**: Your decision is final
- **No broadcast**: Point-to-point messages only
- **Subagent failures**: Re-spawn with error context (counts toward auto-fix budget), do NOT implement yourself

### Step 5 — Sequential tasks

After all parallel groups complete, execute remaining sequential tasks using **Fresh Context solo mode** (dispatch per-task subagents as described in `lead-engineer.md`).

### Step 6 — All tasks complete

After all tasks are `[x]`:
1. Shut down teammates gracefully
2. Proceed to standard completion flow (read `lead-engineer-completion.md`)
